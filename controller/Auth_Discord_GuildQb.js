const { default: axios } = require("axios");
const Auth_Discord_GuildQB = require("../models/Discord_Auth");

let User_token = ""

exports.Discord_login = async (req, res) => {
    try {
        const url =
            'https://discord.com/api/oauth2/authorize?client_id=1141673749226209370&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify';

        res.redirect(url);

    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.Auth_discord_callback = async (req, res) => {
    try {

        if (!req.query.code) throw new Error('Code not provided.');
        const { code } = req.query;

        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/x-www-form-urlencoded'
        };

        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            params,
            {
                headers
            }
        );
        User_token = response.data.access_token
        req.session.user = { token:User_token };

        // console.log("response", response);
        // const userResponse = await axios.get('https://discord.com/api/users/@me', {
        //     headers: {
        //         Authorization: `Bearer ${response.data.access_token}`,
        //         ...headers
        //     }
        // });

        // const data = new Auth_Discord_GuildQB({
        //     UserAddress:"0xa97f580c34beC1Ee1643BBa25C949DEb4279759D",
        //     UserName:userResponse.data.username
        // });
        //     await data.save();
        // console.log("userResponse", userResponse.data);
        res.redirect(process.env.CLIENT_REDIRECT_URL);
        // return  userResponse.data



    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.get_UserNamer = async (req, res) => {
    try {
        const user = req.session.user;
        console.log("User_token", user);
        let { User_Address } = req.query

        if (User_token != "") {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/x-www-form-urlencoded'
            };
            const userResponse = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${User_token}`,
                    ...headers
                }
            });

            if (userResponse) {
                const data = new Auth_Discord_GuildQB({
                    UserAddress:User_Address ,
                    UserName: userResponse.data.username
                });
              
                await data.save();
                console.log("userResponse", userResponse.data);
                 res.status(201).send({
                    data:  userResponse.data,
                    success: true,
                    msg: "Added"
                })
            }

        }

    } catch (error) {
        console.error("error while get user", error);
    }
}

exports.get_Discord_Auth_Data = async (req, res) => {
    try {

        let { User_Address } = req.query
        let User_Data = await Auth_Discord_GuildQB.findOne({ UserAddress: User_Address })
        console.log("User_Data", User_Data);
        if (User_Data != null) {
            res.status(201).send({
                data: User_Data,
                success: true,
                msg: "Auth User Details"
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