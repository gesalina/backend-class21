import express from "express";
import session from "express-session";
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import run from './run.js';

dotenv.config()

const app = express();

/**
* Set the templates engine
*/
app.engine('handlebars', handlebars.engine());
app.set('views', './src/api/routers/views');
app.set('view engine', 'handlebars');

/**
 * User mongo sessions
 */
app.use(session({
    store: MongoStore.create({
        mongoUrl:`mongodb+srv://${process.env.USER}:${process.env.KEY}@cluster0.frrn8pq.mongodb.net/ecommerce`,
        dbName: 'sessions',
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret:'gsal',
    resave:true,
    saveUninitialized: true
}))

/**
 * Initialize passport
 */

initializePassport();

app.use(passport.initialize());
app.use(passport.session());

/**
* Middleware for parse to JSON 
*/
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/**
* Set the static folder
*/
app.use('/content', express.static('./public'));


/**
* Establish database connection
*/
let serverHttp;

try {
    await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.KEY}@cluster0.frrn8pq.mongodb.net/ecommerce`)
    serverHttp = app.listen(8080, () => console.log(`Running server`));                                                      
    const io = new Server(serverHttp);  
    run(io, app)
} catch(err) {
    console.log(err)
}

