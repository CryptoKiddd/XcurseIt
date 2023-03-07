const fs= require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel')


//configuring enviromental variables
dotenv.config({ path: './config.env' });

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

//read json file where the tours are
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

//import the tours to the database
const importData = async()=>{
    try {
        await Tour.create(tours)
        console.log('data loaded to DB from json')
        
    } catch (error) {
        console.log(error)
    }
    process.exit()
};

//Delete all data from collection
const deleteData = async()=>{
    try {
        await Tour.deleteMany()
        console.log('data deleted  from DB');
    } catch (error) {
        console.log(error)
    }
    process.exit()
}
if(process.argv[2] === '--import'){
    importData()
}
if(process.argv[2] === '--delete'){
    deleteData()
}
console.log(process.argv)