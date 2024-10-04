import axios from "axios";
import useAxiosSecure from "./useAxiosSecure";


const useUploadImage = () => {
  const [axiosSecure] = useAxiosSecure();
  const uploadImage = async (image) => {
    if (image) {
      // Request upload signature from your backend
      const { data } = await axiosSecure.get('/get-signature');

      const formData = new FormData();
      formData.append('file', image);
      formData.append('timestamp', data.timestamp);
      formData.append('signature', data.signature);
      formData.append('upload_preset', data.upload_preset);
      formData.append('api_key', data.cloud_api);

      // Make the upload request to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
        formData
      );

      console.log(response.data.secure_url);
      return response.data.secure_url;
    }
    return null;
  }

  return { uploadImage };
};

export default useUploadImage;