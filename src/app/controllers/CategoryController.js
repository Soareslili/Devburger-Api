import * as Yup from 'yup'
import Category from '../models/Category';
import User from '../models/User'

class CategoryController {
    async store(request, response){
    const schema = Yup.object({
        name: Yup.string().required(),
    });

  
    const {admin: isAdmin} = await User.findByPk(request.userId);

    if(!isAdmin) {
        return response.status(401).json();
    }

    const {filename: path} = request.file
    const { name } = request.body;

    const categoryExists = await Category.findOne({
        where: {
            name, 
        },
    });

    if (categoryExists) {
       return response.status(400).json({error: 'Category already exists'})
    }



    const { id } = await Category.create({
      name, 
      path
   });


    try{
        schema.validateSync(request.body, {abortEarly: false});
    } catch(err) {
       return response.status(400).json({error: err.errors});
    }

        return response.status(201).json({id, name})

    }

    async upadate(request, response){
        const schema = Yup.object({
            name: Yup.string(),
        });
    
      
        const {admin: isAdmin} = await User.findByPk(request.userId);
    
        if(!isAdmin) {
            return response.status(401).json();
        }
    
        const { id } = request.params

        const categoryExists = await Category.findByPk(id);

        if(! categoryExists) {
            return response
            .status(400)
            .json({message: 'Make sure you category ID is corret'});
        }

        await Category.update(
            {
                name,
                path,
            },
            {
                where: {
                    id,
                },
            },
        )
     
    let path;
    if (request.file){
        path = request.file.filename
    }

        const { name } = request.body;

        if(name){
            const categoryNameExists = await Category.findOne({
                where: {
                    name, 
                },
            });
        
            if (categoryNameExists && categoryNameExists, id != +id ) {
               return response.status(400).json({error: 'Category already exists'})
            }
        }
    
    
    

    
    
        try{
            schema.validateSync(request.body, {abortEarly: false});
        } catch(err) {
           return response.status(400).json({error: err.errors});
        }
    
            return response.status(200).json()
    
        }

    async index(request, response) {
        const categories = await Category.findAll();
        
        return response.json(categories)
    }
}


export default new CategoryController();