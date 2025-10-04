import mongoose from 'mongoose'
const {Schema} = mongoose;

const cartItemSchema = new Schema({
    productId : {
        type : Schema.Types.ObjectId,
        ref : "Product",
        required : true 
    },
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    qty : {
        type : Number,
        required : true
    },
    imgSrc : {
        type : String,
        
    }
});

const cartSchema = new Schema({

    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true 
    },
    items : [cartItemSchema]

}, {timestamps:true});

export const Cart = mongoose.model("Cart", cartSchema);