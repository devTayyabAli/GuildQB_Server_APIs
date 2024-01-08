const express = require("express");
const bodyParser = require("body-parser");

// import router 
const { Add_Address, Update_Point, get_Ponits, get_All_Refferal, Update_reward, get_User, Update_bonus_point} = require("../controller/userController");
const { Add_Follower, get_Follower, get_Follower_All } = require("../controller/Follower_Controller");
const { Discord_login, Auth_discord_callback, get_UserNamer, get_Discord_Auth_Data } = require("../controller/Auth_Discord_GuildQb");
const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.route("/Add_Address").post(Add_Address)
router.route("/Add_Follower").post(Add_Follower)
router.route("/get_Follower").post(get_Follower)
router.route("/get_Follower_All").post(get_Follower_All)

router.route("/Update_Point").post(Update_Point)
router.route("/get_Ponits").get(get_Ponits)
router.route("/get_All_Refferal").get(get_All_Refferal)
router.route("/Update_reward").get(Update_reward)
router.route("/Update_bonus_point").get(Update_bonus_point)

router.route("/get_User").get(get_User)

router.route("/Discord_login").get(Discord_login)
// router.route("/auth/discord/callback").get(Auth_discord_callback)
// router.route("/get_UserNamer").get(get_UserNamer)
router.route("/get_Discord_Auth_Data").get(get_Discord_Auth_Data)











module.exports = router;