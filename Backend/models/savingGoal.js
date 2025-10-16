const mongoose = require("mongoose");
const { Schema } = mongoose;

const savingGoalSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    goalName:{
        type:String,
        required:true,
        trim:true,
    },
    targetAmount:{
        type:Number,
        required:true,
        min:[0.01, 'Target amount must be a positive number'],
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    }
}, {timestamps: true});

module.exports = mongoose.model("SavingGoal", savingGoalSchema);