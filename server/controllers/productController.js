
import { v2 as cloudinary } from "cloudinary"
import Product from "../models/product.js"

//Add Product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    
    let productData = JSON.parse(req.body.productData); // includes offerPrice
        console.log('Received productData:', productData);
    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // ✅ Save to database with offerPrice
    await Product.create({ ...productData, image: imagesUrl });

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get Product: /api/product/list
export const productList= async (req,res)=>{
    try {
        const products = await Product.find({})
        res.json({success:true, products})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message })
    }

}

//Get single Product: /api/product/id
export const ProductById= async (req,res)=>{
    try {
        const {id} = req.body
        const product = await Product.findById(id)
        res.json({success:true, product})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }

}

//Change Product: /api/product/stock
export const changeStock= async (req,res)=>{
    try {
        const {id,inStock} = req.body
        await Product.findByIdAndUpdate(id,{inStock})
        res.json({success:true, message: "Stock Updated"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }

}