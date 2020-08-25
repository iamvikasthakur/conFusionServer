const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favouriteSchema = new Schema({
    user : {
        type : String,
        ref : 'User'
    },
    dishes : [{
        type : String,
        ref : 'Dish'
    }]
},{
    timestamps : true
});

const Favourites = mongoose.model('favourite', favouriteSchema);

module.exports = Favourites;