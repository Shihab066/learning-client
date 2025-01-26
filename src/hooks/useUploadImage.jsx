import axios from "axios";
import useAxiosSecure from "./useAxiosSecure";
import { useState } from "react";

const useUploadImage = () => {
  const [axiosSecure] = useAxiosSecure();
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = async (image) => {
    if (image) {
      // Request upload signature from your backend
      const { data } = await axiosSecure.get('/upload/image/get-signature');

      const formData = new FormData();
      formData.append('file', image);
      formData.append('timestamp', data.timestamp);
      formData.append('signature', data.signature);
      formData.append('upload_preset', data.upload_preset);
      formData.append('api_key', data.cloud_api);

      setIsUploading(true);
      // Make the upload request to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
        formData
      );
      setIsUploading(false);
      console.log(response.data);
      return response.data.public_id;
    }
    return null;
  }

  return { uploadImage, isUploading };
};

export default useUploadImage;