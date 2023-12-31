// Importamos el módulo 'mongoose' para interactuar con la base de datos MongoDB
const mongoose = require('mongoose');
const Review = require('./review')
const { campgroundSchema } = require('../schemas');

// Extraemos el objeto 'Schema' de 'mongoose'
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

ImageSchema.virtual('cardImage').get(function() {   
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop'); 
})

const opts = { toJSON: {virtuals:true}};

// Definimos un nuevo esquema ('CampgroundSchema') para el modelo de datos de campamento
const CampgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    price: Number,
    description: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },

    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {   
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>
    `; 
})

CampgroundSchema.post('findOneAndDelete', async function (doc){
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// Exportamos el modelo 'Campground' creado a partir del esquema 'CampgroundSchema'
module.exports = mongoose.model('Campground', CampgroundSchema)