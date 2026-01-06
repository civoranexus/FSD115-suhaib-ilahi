import {v2 as Cloud} from 'cloudinary'
import { log } from 'console'
import fs from 'fs'
import { ApiError } from './apiError.js'
import { response } from 'express'

Cloud.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})


const uploadOnCloud = async (localFilePath) => {
    try {
        if(!localFilePath){
            throw new ApiError(400,"Could not find the path of the file to be uploaded on cloudinary")
        } 
        const response = await Cloud.uploader.upload(localFilePath ,
             {resource_type : 'auto'})
             .then(
                console.log("file is uploaded successfully on cloudinary")
             )

        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw new ApiError("upload on cloudinary failed",error)
        return null;
    }
}


export {uploadOnCloud}






