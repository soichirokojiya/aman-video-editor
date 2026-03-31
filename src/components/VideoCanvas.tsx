"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore, useActiveSlide, TextOverlay, KenBurnsPreset } from "@/lib/store";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "@/lib/shaders";
import { FORMAT_PRESETS } from "@/lib/instagram-presets";

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

// Ken Burns: compute source rect for a given progress (0-1)
function getKenBurnsTransform(
  kb: KenBurnsPreset,
  progress: number,
  imgW: number,
  imgH: number,
  canvasW: number,
  canvasH: number,
  cropOx: number,
  cropOy: number
) {
  const canvasAspect = canvasW / canvasH;
  const imgAspect = imgW / imgH;

  // Base: cover the canvas
  let baseW: number, baseH: number;
  if (imgAspect > canvasAspect) {
    baseH = imgH;
    baseW = imgH * canvasAspect;
  } else {
    baseW = imgW;
    baseH = imgW / canvasAspect;
  }

  const t = progress; // 0 -> 1
  const ease = t * t * (3 - 2 * t); // smoothstep easing

  // Scale factor for zoom (start at 1.0, end at 1.15 or vice versa)
  let scale: number;
  let offsetX = 0;
  let offsetY = 0;

  switch (kb) {
    case "zoom-in":
      scale = 1.0 + ease * 0.15;
      break;
    case "zoom-out":
      scale = 1.15 - ease * 0.15;
      break;
    case "pan-left":
      scale = 1.1;
      offsetX = (1 - ease) * (imgW - baseW * scale) * 0.3;
      break;
    case "pan-right":
      scale = 1.1;
      offsetX = ease * (imgW - baseW * scale) * 0.3;
      break;
    case "pan-up":
      scale = 1.1;
      offsetY = (1 - ease) * (imgH - baseH * scale) * 0.3;
      break;
    case "pan-down":
      scale = 1.1;
      offsetY = ease * (imgH - baseH * scale) * 0.3;
      break;
    case "drift-diagonal-tl":
      scale = 1.12;
      offsetX = (1 - ease) * (imgW - baseW * scale) * 0.25;
      offsetY = (1 - ease) * (imgH - baseH * scale) * 0.25;
      break;
    case "drift-diagonal-tr":
      scale = 1.12;
      offsetX = ease * (imgW - baseW * scale) * 0.25;
      offsetY = (1 - ease) * (imgH - baseH * scale) * 0.25;
      break;
    case "drift-diagonal-bl":
      scale = 1.12;
      offsetX = (1 - ease) * (imgW - baseW * scale) * 0.25;
      offsetY = ease * (imgH - baseH * scale) * 0.25;
      break;
    case "drift-diagonal-br":
      scale = 1.12;
      offsetX = ease * (imgW - baseW * scale) * 0.25;
      offsetY = ease * (imgH - baseH * scale) * 0.25;
      break;
    case "zoom-in-pan-left":
      scale = 1.0 + ease * 0.18;
      offsetX = (1 - ease) * (imgW - baseW * scale) * 0.2;
      break;
    case "zoom-in-pan-right":
      scale = 1.0 + ease * 0.18;
      offsetX = ease * (imgW - baseW * scale) * 0.2;
      break;
    case "zoom-out-pan-up":
      scale = 1.2 - ease * 0.12;
      offsetY = (1 - ease) * (imgH - baseH * scale) * 0.2;
      break;
    case "zoom-out-drift":
      scale = 1.2 - ease * 0.1;
      offsetX = ease * (imgW - baseW * scale) * 0.15;
      offsetY = ease * (imgH - baseH * scale) * 0.1;
      break;
    case "slow-push":
      scale = 1.0 + ease * 0.08;
      break;
    case "pull-reveal":
      scale = 1.25 - ease * 0.25;
      break;
    case "none":
    default:
      scale = 1.0;
      break;
  }

  const sw = baseW / scale;
  const sh = baseH / scale;

  // Apply crop offset: shift from center based on available slack
  const maxSlackX = imgW - sw;
  const maxSlackY = imgH - sh;
  const sx = maxSlackX / 2 + cropOx * (maxSlackX / 2) + offsetX;
  const sy = maxSlackY / 2 + cropOy * (maxSlackY / 2) + offsetY;

  return { sx, sy, sw, sh };
}

export default function VideoCanvas() {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const dragRef = useRef<{ startX: number; startY: number; startOx: number; startOy: number } | null>(null);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    texture: WebGLTexture;
  } | null>(null);

  const slide = useActiveSlide();
  const { aspectRatio, setCropOffset } = useEditorStore();

  const videoUrl = slide?.url ?? null;
  const mediaType = slide?.mediaType ?? "image";
  const filter = slide?.filter ?? { warmth: 0, contrast: 1, saturation: 1, shadowLift: 0, brightness: 1, grain: 0, vignette: 0, speed: 1 };
  const textOverlays = slide?.textOverlays ?? [];
  const showEndCard = slide?.showEndCard ?? false;
  const kenBurns = slide?.kenBurns ?? "none";
  const photoDuration = slide?.photoDuration ?? 5;
  const cropOffsetX = slide?.cropOffsetX ?? 0;
  const cropOffsetY = slide?.cropOffsetY ?? 0;

  const preset = FORMAT_PRESETS[aspectRatio];

  // Drag-to-pan handlers for image mode
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (mediaType !== "image") return;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startOx: cropOffsetX,
        startOy: cropOffsetY,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [mediaType, cropOffsetX, cropOffsetY]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const container = glCanvasRef.current?.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const dx = (e.clientX - dragRef.current.startX) / rect.width;
      const dy = (e.clientY - dragRef.current.startY) / rect.height;

      // Invert: drag right → image moves left → offset decreases
      setCropOffset(
        dragRef.current.startOx - dx * 2,
        dragRef.current.startOy - dy * 2
      );
    },
    [setCropOffset]
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // Initialize WebGL
  const initGL = useCallback(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    canvas.width = preset.width;
    canvas.height = preset.height;

    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const texLoc = gl.getAttribLocation(program, "a_texCoord");

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    glRef.current = { gl, program, texture };
  }, [preset.width, preset.height]);

  // Draw text overlays
  const drawText = useCallback(
    (overlays: TextOverlay[], w: number, h: number) => {
      const canvas = textCanvasRef.current;
      if (!canvas) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const t of overlays) {
        ctx.save();
        ctx.globalAlpha = t.opacity;
        ctx.fillStyle = t.color;
        ctx.font = `${t.fontWeight} ${t.fontSize * (w / 360)}px "${t.fontFamily}"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        (ctx as CanvasRenderingContext2D).letterSpacing = `${t.letterSpacing}px`;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fillText(t.text.toUpperCase(), (t.x / 100) * w, (t.y / 100) * h);
        ctx.restore();
      }
    },
    []
  );

  // Init GL on mount / aspect change
  useEffect(() => {
    initGL();
  }, [initGL]);

  // Load image when mediaType is image
  useEffect(() => {
    if (mediaType !== "image" || !videoUrl) {
      imageRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      if (!sourceCanvasRef.current) {
        sourceCanvasRef.current = document.createElement("canvas");
      }
      startTimeRef.current = performance.now();
    };
    img.src = videoUrl;
  }, [videoUrl, mediaType]);

  // Load video when mediaType is video
  useEffect(() => {
    if (mediaType !== "video") return;
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    video.src = videoUrl;
    video.load();
    video.playbackRate = filter.speed;

    const playOnReady = () => {
      video.play().catch(() => {});
    };
    video.addEventListener("canplay", playOnReady);
    return () => {
      video.removeEventListener("canplay", playOnReady);
    };
  }, [videoUrl, filter.speed, mediaType]);

  // Render loop
  useEffect(() => {
    if (!glRef.current) return;
    const { gl, program } = glRef.current;

    const setUniforms = () => {
      gl.uniform1f(gl.getUniformLocation(program, "u_warmth"), filter.warmth);
      gl.uniform1f(gl.getUniformLocation(program, "u_contrast"), filter.contrast);
      gl.uniform1f(gl.getUniformLocation(program, "u_saturation"), filter.saturation);
      gl.uniform1f(gl.getUniformLocation(program, "u_shadowLift"), filter.shadowLift);
      gl.uniform1f(gl.getUniformLocation(program, "u_brightness"), filter.brightness);
      gl.uniform1f(gl.getUniformLocation(program, "u_grain"), filter.grain);
      gl.uniform1f(gl.getUniformLocation(program, "u_vignette"), filter.vignette);
      gl.uniform1f(gl.getUniformLocation(program, "u_time"), performance.now() / 1000);
      gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), preset.width, preset.height);
    };

    const render = () => {
      const w = preset.width;
      const h = preset.height;
      gl.viewport(0, 0, w, h);

      if (mediaType === "image" && imageRef.current) {
        const img = imageRef.current;
        const srcCanvas = sourceCanvasRef.current!;
        srcCanvas.width = w;
        srcCanvas.height = h;
        const sCtx = srcCanvas.getContext("2d")!;

        // Ken Burns animation (loops)
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        const loopTime = photoDuration;
        const progress = (elapsed % loopTime) / loopTime;

        const { sx, sy, sw, sh } = getKenBurnsTransform(
          kenBurns,
          progress,
          img.naturalWidth,
          img.naturalHeight,
          w,
          h,
          cropOffsetX,
          cropOffsetY
        );

        sCtx.clearRect(0, 0, w, h);
        sCtx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

        // Upload to WebGL
        gl.bindTexture(gl.TEXTURE_2D, glRef.current!.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);

        setUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        drawText(textOverlays, w, h);
      } else if (mediaType === "video") {
        const video = videoRef.current;
        if (video && video.readyState >= 2) {
          gl.bindTexture(gl.TEXTURE_2D, glRef.current!.texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

          setUniforms();
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          drawText(textOverlays, w, h);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [filter, textOverlays, preset, drawText, mediaType, kenBurns, photoDuration, cropOffsetX, cropOffsetY]);

  const containerStyle = {
    aspectRatio: `${preset.width} / ${preset.height}`,
  };

  const isDraggable = mediaType === "image";

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        className="hidden"
        muted
        loop
        playsInline
        crossOrigin="anonymous"
      />

      <div
        className={`relative h-full ${isDraggable ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ ...containerStyle, maxHeight: "100%", maxWidth: "100%" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <canvas
          ref={glCanvasRef}
          className="h-full w-auto object-contain rounded-sm"
          style={containerStyle}
        />
        <canvas
          ref={textCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Drag hint for images */}
        {isDraggable && (cropOffsetX === 0 && cropOffsetY === 0) && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <p className="text-[10px] text-white/60 bg-black/30 px-3 py-1 rounded-full tracking-wider uppercase backdrop-blur-sm">
              Drag to reposition
            </p>
          </div>
        )}

        {showEndCard && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="bg-black/60 px-8 py-4 rounded">
              <p className="text-aman-cream text-xs tracking-[0.4em] font-display font-light uppercase text-center">
                End Card Preview
              </p>
            </div>
          </div>
        )}
      </div>

      {!videoUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-aman-stone">
          <div className="w-16 h-16 mb-4 border border-aman-stone/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm tracking-[0.3em] uppercase font-light">
            Upload video or photo
          </p>
        </div>
      )}
    </div>
  );
}
