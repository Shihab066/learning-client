import axios from "axios";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";


const useVideoUpload = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const uploadVideo = async (video) => {
        if (video) {
            console.log(video);

            // Request upload signature from your backend
            const { data } = await axiosSecure.get('http://localhost:5000/api/v1/upload/video/get-signature');
            const { cloud_name, cloud_api, timestamp, signature, upload_preset } = data                           

            const formData = new FormData();
            // Append encrypted video as a Blob            
            formData.append('file', video);
            formData.append('api_key', cloud_api);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('upload_preset', upload_preset);
            // formData.append('folder', `Learning_Point_Assets/Learning_Point_Courses_Videos/${user.uid}`);
            formData.append('resource_type', 'video');
            // formData.append('type', 'authenticated');

            // // Make the upload request to Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`,
                formData
            );
            console.log(response);

            // const res = await axios.get(response.data.playback_url);
            // console.log(res);
            // return response.data.secure_url;
        }
        return null;
    }

    return { uploadVideo };
};

export default useVideoUpload;