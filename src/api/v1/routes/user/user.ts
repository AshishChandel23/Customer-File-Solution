import express from "express";
import UserController from "../../controllers/user/user.controller";
import Middleware from "../../../../shared/middlewares/middlewares";

const User = UserController;
const {verifyToken, verifyUser} = Middleware;
const router = express.Router();

router.get('/getUser', verifyToken, verifyUser, User.getUser);

export default router;