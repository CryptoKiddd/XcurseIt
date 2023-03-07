const mongoose = require('mongoose')
const dotenv = require('dotenv');


//configuring enviromental variables
dotenv.config({ path: './config.env' });
//express app
const app = require('./app')
//connect to mongodb database on atlas cloud
const DB = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.yi71emt.mongodb.net/natours?retryWrites=true&w=majority`; 
(async() => {
        const database = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log('database connected')
    })();



//initializing server
const port = process.env.PORT || 6969
app.listen(port, () => {
    console.log(`server is at ${port}`)
})

