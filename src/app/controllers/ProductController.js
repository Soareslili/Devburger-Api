import * as Yup from 'yup'
import Product from '../models/Product';
import Category from '../models/Category'
import User from '../models/User'

class ProductController {
    async store(request, response){
    const schema = Yup.object({
        name: Yup.string(),
        price: Yup.number(),
        category_id: Yup.number,
        offer: Yup.boolean(),
    });

    const {admin: isAdmin} = await User.findByPk(request.userId);

    if(!isAdmin) {
        return response.status(401).json();
    }

    const { id } = request.params;

    const findProduct =await Product.findByPk(id);

    if (findProduct) {
        return response.status(400).json({error: 'Make sure you product ID is conrrect'})
    }

    let path;
    if (request.file){
        path = request.file.filename
    }
   
   
    const {name, price, category_id, offer} = request.body;

   await Product.update({
        name, 
        price,
        category_id,
        path,
        offer,
    }, {
        where: {
            id,
        }
    });



    try{
        schema.validateSync(request.body, {abortEarly: false});
    } catch(err) {
       return response.status(400).json({error: err.errors});
    }

        return response.status(200).json()

    }

    async update(request, response){
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });
    
        const {admin: isAdmin} = await User.findByPk(request.userId);
    
        if(!isAdmin) {
            return response.status(401).json();
        }
       
       
        const {filename: path} = request.file;
        const {name, price, category_id, offer} = request.body;
    
        const Product = await Product.create({
            name, 
            price,
            category_id,
            path,
            offer,
        });
    
    
        try{
            schema.validateSync(request.body, {abortEarly: false});
        } catch(err) {
           return response.status(400).json({error: err.errors});
        }
    
            return response.status(201).json({message: 'Ok'})
    
        }
    

    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ('id', 'name')
                }
            ]
        });
        
        return response.json(products)
    }
}


export default new ProductController();