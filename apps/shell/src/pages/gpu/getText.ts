

await document.fonts.ready;

export function rasterizeTextToImageData(
  text: string,
  font: string,
  fontSize: number,
  padding = 4
): ImageData {
  // 1. 测量文本尺寸
  const measureCanvas = new OffscreenCanvas(1, 1);
  const ctx = measureCanvas.getContext('2d')!;
  ctx.font = `${fontSize}px ${font}`;
  const metrics = ctx.measureText(text);
  
  const width = Math.ceil(metrics.width) + padding * 2;
  const height = fontSize + padding * 2;

  // 2. 创建光栅化画布
  const canvas = new OffscreenCanvas(width, height);
  const drawCtx = canvas.getContext('2d')!;
  drawCtx.font = `${fontSize}px ${font}`;
  drawCtx.textBaseline = 'top';
  drawCtx.fillStyle = 'white';
  drawCtx.clearRect(0, 0, width, height);
  drawCtx.fillText(text, padding, padding);

  // 3. 返回像素数据
  return drawCtx.getImageData(0, 0, width, height);
};

export function createTextureFromImageData(
  device: GPUDevice,
  imageData: ImageData
): GPUTexture {
  const texture = device.createTexture({
    size: [imageData.width, imageData.height],
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
  });

  device.queue.writeTexture(
    { texture },
    imageData.data,
    { bytesPerRow: imageData.width * 4 },
    [imageData.width, imageData.height]
  );

  return texture;
}