
// Importamos el módulo 'mongoose' para interactuar con la base de datos MongoDB
const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

// Conexión a la base de datos MongoDB usando Mongoose.
mongoose.connect('mongodb://127.0.0.1/yelp-camp');

// Obtenemos una referencia a la conexión de la base de datos.
const db = mongoose.connection;
// Definimos un manejador de eventos para el evento 'error' de la conexión.
db.on("error", console.error.bind(console, "connection error:"));
// Definimos un manejador de eventos para el evento 'open' de la conexión.
db.once("open", () => {
    // Este código se ejecuta una vez que la conexión con la base de datos se ha establecido con éxito.
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i<200; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '658488a311634014a54c5123',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam varius eget orci commodo ullamcorper. Etiam mauris arcu, pretium quis rutrum non, gravida luctus mi. Cras vitae velit a nibh consectetur posuere. Integer sem sem, facilisis in molestie nec, eleifend ut arcu.',
            price: price,
            "geometry": {
                "type": "Point",
                "coordinates": [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [{
                url: 'https://res.cloudinary.com/drusyvtdg/image/upload/v1703627520/YelpCamp/aey93hqm7mzyskj3k6qy.jpg',
                filename: 'YelpCamp/aey93hqm7mzyskj3k6qy'
            }]
        }) 
        await camp.save();
    }

}

seedDB().then(()=>{
    mongoose.connection.close()
})