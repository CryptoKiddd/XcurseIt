const mongoose = require('mongoose')
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1)

})
//configuring enviromental variables
dotenv.config({ path: './config.env' });
//express app
const app = require('./app');
//connect to mongodb database on atlas cloud
const DB = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.yi71emt.mongodb.net/natours?retryWrites=true&w=majority`;
(async () => {
    try {
        const database = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log('database connected')
    } catch (error) {
        console.log('db auth failed check password and username')

    }

})();



//initializing server
const port = process.env.PORT || 6969
const server = app.listen(port, () => {
    console.log(`server is at ${port}`)
    console.log(process.env.NODE_ENV)

})
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1)
    })
})

