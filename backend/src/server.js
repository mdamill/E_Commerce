import express from 'express'
import dotenv from 'dotenv'
import connectDB from './DB/index.js';
import cors from 'cors';
import userRouter from './Routes/user.routes.js'
import productRouter from './Routes/product.routes.js'
import cartRouter from './Routes/cart.routes.js'
import addressRouter from './Routes/address.routes.js'
import orderRouter from './Routes/order.routes.js';
import adminRouter from "./Routes/admin.routes.js";

dotenv.config(); // this allows access from the '.env'

const app = express();

// util code
app.use(express.json()); // parses JSON in request bodies
app.use(cors({
  origin:true,
  methods:[ "GET","POST","PUT","DELETE"],
  credentials:true
}))

// testing route
app.get('/ping', (req, res) => {
    res.send(`PONG`)
})

// user Router
app.use('/api/user', userRouter)

// product Router
app.use('/api/product', productRouter);

// cart Router
app.use('/api/cart', cartRouter)

// Router for address
app.use('/api/address', addressRouter)

// Router for orders
app.use('/api/order', orderRouter);

// Route for admin
app.use("/api/admin", adminRouter);

connectDB()
    .then(() => {

        app.listen(process.env.PORT, () => {
            console.log(`http:localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {console.log("Database connection failed !!!" ,err)});