import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    imgSrc: {
        type: String,
        required: true
    },
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);