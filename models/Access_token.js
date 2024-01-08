const mongoose = require("mongoose");

const schema = mongoose.Schema({

    Access_token:{
        type:String,
        required:true,
    },
    
    
})

const User_Access_token = mongoose.model("User_Access_token", schema);
module.exports = User_Access_token;