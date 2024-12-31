import express, { Application, Request, Response, NextFunction } from "express";
import "colors";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import config from "./config/config";
import Middleware from "./shared/middlewares/middlewares";
import V1Router from './api/v1/routes/main';
import { mongoDBConnection } from "./shared/db/mongo";
import FileClient from "./utils/fileclient";
import path from "path";
const app:Application = express();
const PORT = config.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
(async function(){
    await mongoDBConnection();
    console.log(`||--- Store Path :: ${await FileClient.createStore()} ---||`.yellow.underline);
})();
app.use(express.static(FileClient.getStorePath()));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Server is Running');
    return;
});

app.use('/api/v1', V1Router);

app.use(Middleware.UnhandleRouteMiddleware);

app.use(Middleware.ErrorMiddleware);

app.listen(PORT, ()=>{
    console.log(`||--- Server is Running At ${PORT} P_Id: ${process.pid} ---||`.cyan.underline);
});

process.on('uncaughtException', function(error){
    console.log(`UnCaught Error :: ${error}`.red.underline);
});