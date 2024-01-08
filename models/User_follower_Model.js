const mongoose = require("mongoose");

const schema = mongoose.Schema({
    User_Address:{
        type:String,
        required:true,
    },
    twitter_Follow:{
        type:Boolean,
        required:true,
        default: false
    },
    discord_Follow:{
        type:Boolean,
        required:true,
        default: false

    } ,
    Post_Follow:{
        type:Boolean,
        required:true,
        default: false

    } 
})

const User_Follower_GuildQB = mongoose.model("User_Follower_GuildQB", schema);
module.exports = User_Follower_GuildQB;