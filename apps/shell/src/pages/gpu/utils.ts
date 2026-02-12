

export async function getTextureImg(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const image = new Image();
  image.src = URL.createObjectURL(blob);
  await image.decode();
  return image;
};

export async function getImgRangerSize(image: HTMLImageElement) {
  return [
    image.width / window.devicePixelRatio,
    image.height / window.devicePixelRatio,
  ];
};
