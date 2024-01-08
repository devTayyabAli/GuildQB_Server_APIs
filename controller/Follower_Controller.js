const User_Follower_GuildQB = require("../models/User_follower_Model")

exports.Add_Follower = async (req, res) => {
    try {
        let { User_Address } = req.body
        let User_Data = await User_Follower_GuildQB.find({ User_Address: User_Address })

        if (User_Data.length == 0) {
            const data = new User_Follower_GuildQB(req.body);
            // console.log("UserAddress", User_Data.length);
            await data.save();
            res.status(201).send({
                success: true,
                msg: "Data Followers"
            })
        } else {

            User_Data = User_Data[0]
            let { twitter_Follow, discord_Follow, Post_Follow } = req.body
            let update = {
                User_Address: User_Address,
                twitter_Follow: User_Data.twitter_Follow == true ? true : twitter_Follow,
                discord_Follow: User_Data.discord_Follow == true ? true : discord_Follow,
                Post_Follow: User_Data.Post_Follow == true ? true : Post_Follow,


            }
            const updatedDocument = await User_Follower_GuildQB.findOneAndUpdate({
                User_Address: User_Address
            }, {
                $set: update
            }, {
                new: true
            });
            res.status(201).send({
                data: updatedDocument,
                success: true,
                msg: "Update Follower"
            })
        }
    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.get_Follower = async (req, res) => {
    try {

        let { User_Address } = req.body
        let User_Data = await User_Follower_GuildQB.find({ User_Address: User_Address })
        if (User_Data.length != 0) {
            User_Data = User_Data[0]
            // console.log("User_Data", User_Data.discord_Follow);
            if (User_Data.discord_Follow == true && User_Data.twitter_Follow == true && User_Data.Post_Follow == true) {

                res.status(201).send({
                    data: User_Data,
                    success: true,
                    msg: "You get One Point Successfuly"
                })
            }else{
                res.status(201).send({
                    data: [],
                    success: false,
                    msg: "Please Follow social Platform"
                })
            }
   


        } else {
            res.status(201).send({
                success: false,
                msg: "Not Registor"
            })
        }



    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.get_Follower_All = async (req, res) => {
    try {

        let { User_Address } = req.body
        let User_Data = await User_Follower_GuildQB.find({ User_Address: User_Address })
        // console.log("User_Data", User_Data);
        if (User_Data.length != 0) {
            res.status(201).send({
                data: User_Data,
                success: true,
                msg: "Folower Details"
            })

        } else {
            res.status(201).send({
                success: false,
                msg: "Not Registor"
            })
        }



    } catch (error) {
        console.error("error while get user", error);
    }
}