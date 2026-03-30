export const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

export const FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D u_texture;
  uniform float u_warmth;
  uniform float u_contrast;
  uniform float u_saturation;
  uniform float u_shadowLift;
  uniform float u_brightness;
  uniform float u_grain;
  uniform float u_vignette;
  uniform float u_time;
  uniform vec2 u_resolution;

  varying vec2 v_texCoord;

  // Pseudo-random for film grain
  float random(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 adjustSaturation(vec3 color, float sat) {
    float grey = dot(color, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(grey), color, sat);
  }

  // S-curve for gentle contrast
  vec3 sCurve(vec3 color, float amount) {
    return color * color * (3.0 - 2.0 * color) * amount + color * (1.0 - amount);
  }

  void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    vec3 color = texColor.rgb;

    // --- Aman-style color grading pipeline ---

    // 1. Lift shadows (matte/film look)
    color = color * (1.0 - u_shadowLift) + u_shadowLift;

    // 2. Warmth: shift towards golden/amber
    color.r += u_warmth * 0.06;
    color.g += u_warmth * 0.02;
    color.b -= u_warmth * 0.04;

    // 3. Brightness
    color *= u_brightness;

    // 4. Contrast via S-curve
    color = sCurve(color, u_contrast);

    // 5. Desaturation (Aman is always muted)
    color = adjustSaturation(color, u_saturation);

    // 6. Subtle warm tone in highlights, cool in shadows
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 shadowTint = vec3(0.02, 0.0, -0.02) * (1.0 - luma);
    vec3 highlightTint = vec3(0.04, 0.02, -0.01) * luma;
    color += shadowTint + highlightTint;

    // 7. Film grain
    float grainNoise = random(v_texCoord + u_time) * 2.0 - 1.0;
    color += grainNoise * u_grain;

    // 8. Vignette
    vec2 center = v_texCoord - 0.5;
    float dist = length(center);
    float vig = smoothstep(0.5, 0.2, dist * u_vignette * 2.0);
    color *= mix(1.0, vig, u_vignette);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
