import express from 'express'
import dotenv from 'dotenv'
import connectDB from './DB/index.js';
import bodyParser from 'express'
import cors from 'cors';

dotenv.config(); // this allows access from the '.env'

const app = express();

// util code
app.use(bodyParser.json())
app.use(cors({
  origin:true,
  methods:[ "GET","POST","PUT","DELETE"],
  credentials:true
}))


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