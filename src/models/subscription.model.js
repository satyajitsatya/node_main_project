//import shcema from mangoose
import mongoose from "mongoose";
import mangoose ,{Schema} from "mongoose"


//create shcem object
const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    chanel: {
        type: Schema.Types.ObjectId,
        ref: "User"

    }
},{timestamps : true})



export const subscription = mongoose.model("Subscription",subscriptionSchema)

//export model