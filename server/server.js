require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit');

const ExpressError = require('./utils/ExpressError.js')
const eventRoutes = require('./routes/eventRoutes.js')
const formRoutes = require('./routes/formRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const achievementRoute = require('./routes/achievementRoute.js')
const alumniRoute = require('./routes/alumniRoute.js')
const authRoutes = require('./routes/authRoutes.js')
const projectRoutes = require('./routes/projectRoute.js')
const teamMembersRoutes = require('./routes/teamMembersRoute.js')
const issueRoutes=require('./routes/issueRoutes.js')
const postRoutes=require("./routes/postRoutes.js");
const coreAuthMiddleware = require('./middlewares/coreAuthMiddleware.js')

const app = express()
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

app.use(cors());

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, 
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiter to all requests
// app.use(limiter);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health-check', (req, res) => {
    return res.send('EveryThing is Fine. Say Nexus...')
})

app.use('/auth', authRoutes);

app.use(coreAuthMiddleware);

app.use('/event', eventRoutes)
app.use('/forms', formRoutes)
app.use('/team', teamMembersRoutes)
app.use('/user', userRoutes)
app.use('/achievements', achievementRoute)
app.use('/alumni', alumniRoute)
app.use('/projects', projectRoutes);
app.use("/issue",issueRoutes);
app.use('/posts', postRoutes);

mongoose.connect(MONGO_URL, { maxPoolSize: 10, serverSelectionTimeoutMS: 10000 })
    .then(() => {
        app.listen(PORT, (req, res) => {
            console.log('connected to db')
            console.log('listening on port', PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'page not found'))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'something went wrong' } = err
    res.status(statusCode).send(err.message)
})