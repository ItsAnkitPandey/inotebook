const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://ankitpandey272003:JIvfVsZ0pVP7P3Uv@cluster0.2fzxxaz.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = ()=> {
    mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  
}
module.exports = connectToMongo;