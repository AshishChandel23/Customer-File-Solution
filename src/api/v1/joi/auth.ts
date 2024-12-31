import Joi from "joi";
import { IRegister, ILogin } from "../types/auth.interface";

export const registerSchema = Joi.object<IRegister>({
    name: Joi.string().required(),
    email: Joi.string()
              .email()
              .required()
              .messages({
                  'string.empty': 'Email cannot be empty',
                  'string.email': 'Invalid email format',
              }),
    contactNo: Joi.string().required(),
    password: Joi.string()
                .min(5) 
                .required()
                .messages({
                    'string.empty': 'Password cannot be empty',
                    'string.min': 'Password must be at least 5 characters long',
                }),
});

export const loginSchema = Joi.object<ILogin>({
    email: Joi.string()
        .email({ tlds: { allow: false } }) 
        .required() 
        .messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format',
        }),
    password: Joi.string()
        .min(5) 
        .required()
        .messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 5 characters long',
        }),
});