import{v2 as cloudinary}from"cloudinary";
import fs from"fs";


const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath) return null;
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        console.log("file is uploaded on cloudinary",response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);//remove the locally saved temporary file as the upload failed
        return null;
    }
}


export{uploadOnCloudinary}



