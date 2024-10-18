import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js"

// add product controller
const addProduct = async (req, res) => {
   try {
     const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
 
     // Safely access files
     const image1 = req.files && req.files.image1 ? req.files.image1[0] : null;
     const image2 = req.files && req.files.image2 ? req.files.image2[0] : null;
     const image3 = req.files && req.files.image3 ? req.files.image3[0] : null;
     const image4 = req.files && req.files.image4 ? req.files.image4[0] : null;
 
     // Filter out null or undefined values
     const images = [image1, image2, image3, image4].filter(item => item !== null && item !== undefined);
 
     if (images.length === 0) {
       throw new Error('No images provided');
     }
 
     // Upload images to Cloudinary
     let imagesUrl = await Promise.all(
       images.map(async (item) => {
         if (item && item.path) {
           let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
           return result.secure_url;
         }
       })
     );
     
 
     const productData = {
      name, 
      description, 
      price : Number(price), 
      category, 
      subCategory, 
      sizes: JSON.parse(sizes), 
      bestseller : bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now()
     }

     console.log(productData);

     const product = new productModel(productData);

     await product.save();
     
 
     res.json({ success: true, message: "Product Added" });
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }
 };
 

// List product controller
const listProducts = async(req, res)=>{

   try {

      const allProducts = await productModel.find();
      console.log(addProduct);

      res.json({success: true , allProducts})
      
   } catch (error) {
      console.log(error);
      res.json({success: false , message: error.message});
      
   }
   

}

// remove product controller
const removeProduct = async(req, res)=>{
   try {
      await productModel.findByIdAndDelete(req.body.id);
      res.json({success: true, message:"product removed"})
   } catch (error) {
      console.log(error);
      res.json({success: false , message: error.message});
   }
}

// single product info controller
const singleProduct = async(req, res)=>{
   try {
      const product = await productModel.findById(req.body.id);
      res.json({success:true, product, message:"Product fetched successfully"})
   } catch (error) {
      console.log(error);
      res.json({success: false , message: error.message});
   }
}


export {listProducts, singleProduct, removeProduct, addProduct}