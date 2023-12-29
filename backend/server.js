import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './config/database.js';

const app = express();
 dotenv.config();

 const PORT = process.env.PORT || 5001

 app.get('/', (req, res) => {
    res.send('Welcome to programming');
 })

 const startServer =  async() => {
    try {
        await dbConnect();
        app.listen(PORT, () => {
            console.log(`Server is listening on: http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }   
}

startServer();

 