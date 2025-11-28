const CLOUDINARY_CLOUD_NAME = "dwzjxsdli";           
const CLOUDINARY_UPLOAD_PRESET = "petshop_unsigned"; 

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Upload ảnh thất bại");
    }

    console.log("Upload thành công:", data.secure_url);
    return data.secure_url; // ← URL sẽ được lưu vào DB
  } catch (error) {
    console.error("Lỗi upload Cloudinary:", error);
    throw error;
  }
};