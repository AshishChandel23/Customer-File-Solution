import Joi from "joi";
import { IFolder } from "../../../models/folder.model";

export const FolderSchema = Joi.object<IFolder>({
    name: Joi.string()
          .regex(/^[a-zA-Z0-9, ]*$/, 'Alphanumerics, space and comma characters')
          .min(3)
          .max(30)
          .required()
    ,
    path: Joi.string().allow(''),
    parentFolder: Joi.string().allow(null),
})