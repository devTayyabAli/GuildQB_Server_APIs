const mongoose = require("mongoose");

const schema = mongoose.Schema({

    UserAddress:{
        type:String,
        required:true,
    },
    Refferal_Address:{
        type:String,
        
    } ,
    Point:{
        type:Number,
        default: 0
    },
    reward:{
        type:Boolean,
        default: false
    },
    bonus_point:{
        type:Boolean,
        default: false
    }
})

const User_Model_GuildQB = mongoose.model("User_Model_GuildQB", schema);
module.exports = User_Model_GuildQB;