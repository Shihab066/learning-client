import axios from "axios";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";


const useVideoUpload = () => {
    const { getCourseId: courseId } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    
    const uploadVideo = async (video) => {
        if (video) {
            console.log(video);
            // Request upload signature from your backend
            const { data } = await axiosSecure.get(`/upload/video/get-signature`);
            const { cloud_name, cloud_api, timestamp, signature, upload_preset } = data

            const formData = new FormData();
            formData.append('file', video);
            formData.append('api_key', cloud_api);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('upload_preset', upload_preset);
            formData.append('resource_type', 'video');

            // Make the upload request to Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`,
                formData
            );

            const savePlaylist = await axiosSecure.post(`/upload/video/add/${response.data.public_id}/${courseId}`)
            if (savePlaylist.data.insertedId) {
                console.log('video upload successfully');
                return response.data.public_id
            }
        }
        return null;
    }

    return { uploadVideo };
};

export default useVideoUpload;