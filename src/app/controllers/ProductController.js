import * as Yup from 'yup'
import Product from '../models/Product';

class ProductController {
    async store(request, response){
    const schema = Yup.object({
        name: Yup.string().required(),
        price: Yup.number().required(),
        category: Yup.string().required(),
    });

    const {filename: path} = request.file;
    const {name, price, category} = request.body;

    const Product = await Product.create({
        name, 
        price,
        category,
        path,
    });


    try{
        schema.validateSync(request.body, {abortEarly: false});
    } catch(err) {
       return response.status(400).json({error: err.errors});
    }

        return response.status(201).json({message: 'Ok'})

    }

    async index(request, response) {
        const products = await Product.findAll();
        
        return response.json(products)
    }
}


export default new ProductController();