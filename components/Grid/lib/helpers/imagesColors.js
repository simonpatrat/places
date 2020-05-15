import ColorThief from "colorthief";

export const getImageColorInfo = (img, index) => {
  return new Promise((resolve, reject) => {
    if (ColorThief) {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      const palette = colorThief.getPalette(img, 5);
      resolve({
        // imageId: `image-${index}`,
        color,
        palette,
      });
    }
  });
};

export const getAllImagesColorInfos = async (images) => {
  const colorInfos = await Promise.all(
    images.map((img, index) => getImageColorInfo(img, index))
  );
  return colorInfos;
};
