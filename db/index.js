const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true);
mongoose
   .connect('mongodb://127.0.0.1:27017/notify-app',{useUnifiedTopology: true}).then(() => console.log('DB connection successful!'))
    //.connect('mongodb+srv://notifyDB:TM7NMR0QHtlt4dBt@notify-app.3ndni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useUnifiedTopology: true}).then(() => console.log('DB connection successful!'))
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection
module.exports = db