import express from 'express';
import { upload } from '../configs/multer.js';  // Make sure this is here
import authSeller from '../middleware/authSeller.js';
import { addProduct, changeStock, ProductById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', authSeller, upload.array('images', 5), addProduct);
productRouter.get('/list', productList);
productRouter.get('/id', ProductById);
productRouter.post('/stock', authSeller, changeStock);

export default productRouter;
