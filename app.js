const express = require('express')
const app = express()

require('./configs/OAuth')
require('dotenv').config()

const cors = require('cors')
const bodyParser = require('body-parser')
const httpLogger = require('./utils/httpLogger')
const rateLimiter = require('./configs/rateLimiter')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const donationRouter = require('./routers/donationRouter')

const appError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
require('./models/db').init()

// USE SESSION
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DEV_MONGO_URL || process.env.MONGO_URL,
            collectionName: 'sessions'
        })
    })
)

app.use(
    cors({
        credentials: true,
        origin: "*"
    })
);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(httpLogger)
app.use(rateLimiter)

app.get("/", (req, res) => {
    return res.send(
        "Welcome to the CACSA-UI! \n <a href='/api/v2/auth/google'>Continue with Google</a>"
    );
});

// REGISTER ROUTES
app.use('/api/v2/auth', authRouter)
app.use('/api/v2/user', userRouter)
app.use('/api/v2/donations', donationRouter)

app.use('*', (req, res, next) => {
    return next(new appError(`${req.originalUrl} not found on this server`, 404));
})

app.use(globalErrorHandler)
module.exports = app