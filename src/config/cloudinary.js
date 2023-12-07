import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

const uploadImage = async(filePath) => {
    return await cloudinary.uploader.upload(filePath,{folder:'ninios'})
}

const deleteImage = async (publicId)=>{
    return await cloudinary.uploader.destroy(publicId)
}

export{
    uploadImage,
    deleteImage
}
// Permite cargar imágenes
// npm i cloudinary
// npm install fs-extra