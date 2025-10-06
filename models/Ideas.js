import mongoose from "mongoose";

const ideaSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
       
    },
    tags: {
        type: [string],
        default: [],
    }
   
}, {
        timestamps: true
    },);

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea