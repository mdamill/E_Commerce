import express from 'express'
import dotenv from 'dotenv'
import connectDB from './DB/index.js';

dotenv.config(); // this allows access from the '.env'

const app = express();

app.get('/ping', (req, res) => {
    res.send(`PONG`)
})


connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`http:localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {console.log("Database connection failed !!!" ,err)});