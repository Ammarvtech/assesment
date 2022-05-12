const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mealSchema = mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    meal: {
        type: String,
        required: true,
        trim: true,
        minLength: 3
    },
    calories: {
        type: Number,
        required: true,
    },
    price:{
        type: Number,
        require:true,
    },
    date: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
})

const Meal = mongoose.model('Meal', mealSchema)

module.exports = Meal