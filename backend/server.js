import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './config/database.js';
import userRoute from './routes/userRoute.js';

const app = express();
 dotenv.config();

const PORT = process.env.PORT || 5001


 //middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: [`http://localhost:${PORT}`, 'https://shopswift.vercel.app'],
    credentials: true
})
);

//Routes
app.use('/api/users', userRoute);

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

 