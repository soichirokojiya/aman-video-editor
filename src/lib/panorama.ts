export function isPanorama(width: number, height: number): boolean {
  return width / height > 1.8;
}

export async function splitImage(
  file: File,
  sliceCount: 2 | 3
): Promise<Blob[]> {
  const img = await loadImage(file);
  const sliceW = Math.floor(img.naturalWidth / sliceCount);
  const sliceH = img.naturalHeight;
  const blobs: Blob[] = [];

  for (let i = 0; i < sliceCount; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = sliceW;
    canvas.height = sliceH;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, i * sliceW, 0, sliceW, sliceH, 0, 0, sliceW, sliceH);
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    blobs.push(blob);
  }

  return blobs;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
