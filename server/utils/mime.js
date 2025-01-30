const isImage = (mimeType) => {
    const imageMimeTypes = [
      "image/jpeg", // JPEG
      "image/png",  // PNG
      "image/gif",  // GIF
      "image/webp", // WebP
      "image/svg+xml", // SVG
      "image/bmp",  // BMP
      "image/x-icon", // ICO
      "image/tiff", // TIFF
    ];
  
    return imageMimeTypes.includes(mimeType);
  };

  module.exports = {
    isImage
  }