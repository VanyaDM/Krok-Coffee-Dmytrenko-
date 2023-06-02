require('dotenv').config();

const mongoose = require('mongoose');

const connectionStr = "mongodb+srv://firstuser:wiAkB2SBK4G$$fG@cluster0.b3obhzz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})
