import {Request, Response} from 'express';

const registerUser= async (req:Request,res:Response):Promise<void>=>{
    try{
        const{email,password,name}=req.body;
        res.status(201).json({
            status:'success',
            message:'Controller Successfully intercepted the request',
            data:{
                email,
                name
            }
        });
    }
    catch(error){
        res.status(500).json({
            status:'error',
            message:'Internal Server Error'
        });
    }
}
export {registerUser};