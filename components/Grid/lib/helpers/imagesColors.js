import ColorThief from "colorthief";

export const getImageColorInfo = (img, index) => {
  return new Promise((resolve, reject) => {
    if (ColorThief) {
      const colorThief = new ColorThief();
      try {
        console.log(img, img.width);
        const color = colorThief.getColor(img);
        const palette = colorThief.getPalette(img, 5);
        resolve({
          // imageId: `image-${index}`,
          color,
          palette,
        });
      } catch (err) {
        reject(err);
      }
    }
  });
};

export const getAllImagesColorInfos = async (images) => {
  const colorInfos = await Promise.all(
    images.map((img, index) => getImageColorInfo(img, index))
  );
  return colorInfos;
};
