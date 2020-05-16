import { getImageColorInfo } from "./imagesColors";

export const imageLoaded = (imgUrl, index) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "Anonymous";
    img.onload = async () => {
      const colorInfo = await getImageColorInfo(img);
      const imageIdInfo =
        typeof index !== "undefined" ? { imageId: `image-${imgUrl}` } : {};
      resolve({
        imgUrl,
        status: "ok",
        ...colorInfo,
        ...imageIdInfo,
      });
    };
    img.onerror = () => resolve({ imgUrl, status: "error" });

    img.src = imgUrl;
  });
};

export const loadAllImages = async (images) => {
  return Promise.all(images.map(imageLoaded));
};
