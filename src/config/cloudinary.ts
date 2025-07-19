import axios from "axios";

const CLOUDINARY_CLOUD_NAME = 'dhrrrgsc6';
const CLOUDINARY_UPLOAD_PRESET = 'react_ums';

export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try{
        interface CloudinaryResponse {
            secure_url: string;
            [key: string]: any;
        }
        const response = await axios.post<CloudinaryResponse>(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        console.log("cloudinary image URL response at the cloudinary:", response);
        if(response?.data?.secure_url) {

        }
        return response?.data?.secure_url;
    }catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return null
    }
}