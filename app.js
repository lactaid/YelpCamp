if(process.env.Node_ENV !== 'production'){
    require('dotenv').config();
}


// Importamos el módulo 'express' y lo asignamos a la variable 'express'
const express = require('express')
// Importamos el módulo 'path' para manejar rutas de archivos y directorios
const path = require('path');
// Importamos el módulo 'mongoose' para interactuar con la base de datos MongoDB
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const helmet = require('helmet')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const MongoDBStore = require('connect-mongo')(session)

const mongoSanitize = require('express-mongo-sanitize');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1/yelp-camp';

// Conexión a la base de datos MongoDB usando Mongoose.
// mongoose.connect('mongodb://127.0.0.1/yelp-camp');
mongoose.connect(dbUrl);
// Obtenemos una referencia a la conexión de la base de datos.
const db = mongoose.connection;
// Definimos un manejador de eventos para el evento 'error' de la conexión.
db.on("error", console.error.bind(console, "connection error:"));
// Definimos un manejador de eventos para el evento 'open' de la conexión.
db.once("open", () => {
    console.log("Database connected");
});


// Creamos una instancia de la aplicación Express
const app = express();
app.engine('ejs', ejsMate)
// Configuramos la aplicación para usar el motor de vistas EJS
app.set('view engine', 'ejs');  
// Especificamos la carpeta donde se encuentran las vistas de la aplicación
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore ({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function(e){
    console.log("Session store error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        //Secure:true no va a funcionar en localhost
        //secure: true
    }

}

app.use(session(sessionConfig))
app.use(flash())
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drusyvtdg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)


app.get('/', (req,res) => {
    res.render('home')
})

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) =>{
    const{statusCode = 500} = err;
    if (!err.message) err.message ='Something Went Wrong';
    res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=> {
    console.log('serving on port 3000')
})