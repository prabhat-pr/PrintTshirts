import cloudinary from "../config/cloudinary.js";

export async function uploadProductImage(fileBuffer, productId) {
  if (!fileBuffer) {
    throw new Error("Image file is required");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "printtshirts/products",
        public_id: `product-${productId}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteProductImage(publicId) {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}
