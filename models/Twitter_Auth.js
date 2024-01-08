const mongoose = require("mongoose");

const schema = mongoose.Schema({

    UserAddress:{
        type:String,
        required:true,
    },
    UserName:{
        type:String,
        
    } ,
    
})

const Auth_Twitter_GuildQB = mongoose.model("Auth_Twitter_GuildQB", schema);
module.exports = Auth_Twitter_GuildQB;