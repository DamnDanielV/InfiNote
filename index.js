const express = require('express');
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')


//variables de entorno
require('dotenv').config({path: 'variables.env'})
// modelo db
require('./models/Proyectos')
require('./models/Tareas')

const app = express();

//conexion a la base de datos
const db = require('./config/database');

//helpers
const { varDump } = require('./helpers');



db.sync() // crea los modelos definidos y ejecuta las sentencias para la base de datos
    .then(() => {
        console.log("conexion establecida")
    })
    .catch((err) => {
        console.log(err)
    })

// archivos estatitos
app.use(express.static('public'))

// habilitar pug
app.set('view engine', 'pug')

// añadir la carpeta de vistas
app.set('views', path.join(__dirname, './views'))

// flash para errores entre request
app.use(flash());

//habilitar body parser 
app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    // cookie: { secure: true }
  }))
//passport para autenticacion de usuarios
app.use(passport.initialize());
app.use(passport.session())

// configuracion de variables locales
app.use((req, res, next) => {
    res.locals.errores = req.flash()
    res.locals.fecha = new Date().getFullYear()
    res.locals.vardump = varDump;
    res.locals.usuario = {...req.user} || null
    next();
})


app.use('/', routes())


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log("servidor funcionando")
})