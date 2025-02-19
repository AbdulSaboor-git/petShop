/**
 * getCroppedImg - Crop an image using canvas
 *
 * @param {string} imageSrc - source URL of the image
 * @param {object} pixelCrop - cropping dimensions { x, y, width, height }
 * @returns {Promise<string>} - a Promise that resolves to a base64 image URL
 */
export default function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // if the image is from a different domain
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Return base64 image
      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
}
