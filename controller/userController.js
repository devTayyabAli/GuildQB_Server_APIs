const User_Model_GuildQB = require("../models/userModel")

exports.Add_Address = async (req, res) => {
    try {
        let { UserAddress } = req.body
        let User_Addrss = await User_Model_GuildQB.find({ UserAddress: UserAddress })
        if (User_Addrss.length == 0) {
            const data = new User_Model_GuildQB(req.body);
            await data.save();
            res.status(201).send({
                success: true,
                msg: "Data Store Successfuly"
            })
        } else {

            res.status(201).send({
                success: false,
                msg: "Already Registor"
            })
        }

    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.Update_Point = async (req, res) => {
    try {
        let { UserAddress } = req.body
        let point_Details = await User_Model_GuildQB.find({ UserAddress: UserAddress })

        if (point_Details.length == 0) {
            res.status(201).send({
                data: [],
                success: false,
                msg: "Refferal Is not Exit"
            })
        } else {
            point_Details = point_Details[0]
            let update = {
                UserAddress: point_Details.UserAddress,
                Refferal_Address: point_Details.Refferal_Address,
                Point: Number(point_Details.Point) + Number(1),
            }
            const updatedDocument = await User_Model_GuildQB.findOneAndUpdate({
                UserAddress: UserAddress
            }, {
                $set: update
            }, {
                new: true
            });
            res.status(201).send({
                data: updatedDocument,
                success: true,
                msg: "Update Follower Point"
            })
        }

    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.get_Ponits = async (req, res) => {
    try {
        let { UserAddress } = req.query
        let User_Addrss = await User_Model_GuildQB.find({ UserAddress: UserAddress })
        // console.log("User_Addrss", User_Addrss);
        if (User_Addrss.length == 0) {
           
            res.status(201).send({
                data:[],
                success: false,
                msg: "User No Registor"
            })
        } else {
            res.status(201).send({
                data:User_Addrss,
                success: true,
                msg: "User Reward"
            })
        }

    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.get_All_Refferal = async (req, res) => {
    try {
        let { Refferal_Address } = req.query
        let User_Addrss = await User_Model_GuildQB.find({ Refferal_Address: Refferal_Address })
        // console.log("User_Addrss", User_Addrss);
        if (User_Addrss.length == 0) {
           
            res.status(201).send({
                data:[],
                success: false,
                msg: "User No Registor"
            })
        } else {
            res.status(201).send({
                data:User_Addrss,
                success: true,
                msg: "User Reward"
            })
        }

    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.Update_reward = async (req, res) => {
    try {
        let { UserAddress } = req.query
        let User_Data = await User_Model_GuildQB.find({ UserAddress: UserAddress })
        console.log("Update_reward",User_Data);

        if (User_Data.length == 0) {
            res.status(201).send({
                data: [],
                success: false,
                msg: "Address Is not Exit"
            })
        } else {
            User_Data = User_Data[0]

            let update = {
                UserAddress: User_Data.UserAddress,
                Refferal_Address: User_Data.Refferal_Address,
                Point: User_Data.Point,
                reward:true
            }
            const updatedDocument = await User_Model_GuildQB.findOneAndUpdate({
                UserAddress: UserAddress
            }, {
                $set: update
            }, {
                new: true
            });
            res.status(201).send({
                data: updatedDocument,
                success: true,
                msg: "Update Reward"
            })

        }



    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.Update_bonus_point = async (req, res) => {
    try {
        let { UserAddress } = req.query
        let User_Data = await User_Model_GuildQB.find({ UserAddress: UserAddress })
        console.log("Update_bonus_point",User_Data);

        if (User_Data.length == 0) {
            res.status(201).send({
                data: [],
                success: false,
                msg: "Address Is not Exit"
            })
        } else {
            User_Data = User_Data[0]

            let update = {
                UserAddress: User_Data.UserAddress,
                Refferal_Address: User_Data.Refferal_Address,
                Point: User_Data.Point,
                bonus_point:true
            }
            const updatedDocument = await User_Model_GuildQB.findOneAndUpdate({
                UserAddress: UserAddress
            }, {
                $set: update
            }, {
                new: true
            });
            res.status(201).send({
                data: updatedDocument,
                success: true,
                msg: "Update bonus_point"
            })

        }



    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.get_User = async (req, res) => {
    try {
        let { UserAddress } = req.query
        let User_Addrss = await User_Model_GuildQB.find({ UserAddress: UserAddress })
        // console.log("User_Addrss", User_Addrss);
        if (User_Addrss.length == 0) {
           
            res.status(201).send({
                data:[],
                success: false,
                msg: "User No Registor"
            })
        } else {
            res.status(201).send({
                data:User_Addrss,
                success: true,
                msg: "User Data"
            })
        }

    } catch (error) {
        console.error("error while get user", error);
    }
}