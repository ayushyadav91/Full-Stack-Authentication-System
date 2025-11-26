import * as Z from 'zod';



export const registerValidationUserSchema = Z.object({
    username:
     Z.string().min(3,"username must be atleast 3 characters").max(20,"username must be less than 20 characters"),
    email:
     Z.string().email("Invalid email"),
    password: 
    Z.string().min(8,"Passowrd must be 8 character log").max(20),
});