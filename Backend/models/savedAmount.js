const mongoose = require("mongoose");
const { Schema } = mongoose;

const savedAmountSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    goal:{
        type:Schema.Types.ObjectId,
        ref:"SavingGoal",
        required:true,
    },
    savedAmount:{
        type:Number,
        required:true,
        min:[0.01, 'Target amount must be a positive number'],
    },
    date:{
        type:Date,
        default: Date.now,
    },

}, {timestamps: true});

module.exports = mongoose.model("SavedAmount", savedAmountSchema);