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

const Auth_Discord_GuildQB = mongoose.model("Auth_Discord_GuildQB", schema);
module.exports = Auth_Discord_GuildQB;