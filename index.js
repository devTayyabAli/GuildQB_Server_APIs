const express = require("express");
const axios = require('axios');
const cors = require("cors");
var LocalStorage = require('node-localstorage');
// localStorage = new LocalStorage();
const session = require("express-session")
var cookieParser = require('cookie-parser')
const MongoDBStore = require("connect-mongodb-session")
// import db connection
const dbConnection = require("./connection/db")
// import router
const router = require("./router/router");
const Auth_Discord_GuildQB = require("./models/Discord_Auth");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const querystring = require("querystring");
const Auth_Twitter_GuildQB = require("./models/Twitter_Auth");
const { mongo_url } = require("./config");
const User_Access_token = require("./models/Access_token");

require('dotenv').config()
const app = express();

app.use(cors());
const mongoStore = MongoDBStore(session);
const store = new mongoStore({
  collection: "userSessions",
  uri: mongo_url,
  expires: 1000,
});
app.use(session({
  name: "access_token",
  secret: "HH",
  store: store,
  saveUninitialized: false,
  resave: false,


}));
// let User_token = null
let oauthToken_value = null
let oauthTokenSecret_value = null
app.use(router)

app.get("/", (req, res) => {

  res.send("server running fine 🏃‍♂️")
})



app.use("/auth/discord/callback", async (req, res, next) => {
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
    // User_token = response.data.access_token
    
      res.redirect(`${process.env.CLIENT_REDIRECT_URL}?User_token=${response.data.access_token}`);

  } catch (error) {
    console.error("error while get user", error);
  }
})

app.get("/get_UserName", async (req, res) => {
  try {
    let { User_Address,User_token } = req.query
    // console.log("User_token", User_Address);

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
        let User_Data = await Auth_Discord_GuildQB.findOne({ UserAddress: User_Address })

        if (User_Data == null) {
          if (User_Address != undefined) {

            const data = new Auth_Discord_GuildQB({
              UserAddress: User_Address,
              UserName: userResponse.data.username
            });
            await data.save();
            console.log("userResponse", userResponse.data);
            res.status(201).send({
              data: userResponse.data,
              success: true,
              msg: "Added"
            })
          }
        } else {
          res.status(201).send({
            data: [],
            success: false,
            msg: " This User is Already Registor!"
          })
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      data: [],
      success: false,
      msg: "Error during authentication"
    })
  }

})






const consumerKey = "jhFiTCxc7NdlVNUbzcrmRDQgx";
const consumerSecret = "oeYUE23kpMWqN5kx79d3XbhdScI7AhVSAip0NJBX0YuSyBzNR7";

const oauth = OAuth({
  consumer: { key: consumerKey, secret: consumerSecret },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/auth/twitter", (req, res) => {
  const requestData = {
    url: "https://api.twitter.com/oauth/request_token",
    method: "POST",
    data: { oauth_callback: "oob" },
  };

  const requestToken = {
    key: "",
    secret: "",
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, requestToken));
  const data = querystring.stringify(requestData.data);

  axios({
    method: requestData.method,
    url: requestData.url,
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  })
    .then((response) => {
      const data = querystring.parse(response.data);
      const oauthToken = data.oauth_token;
      const oauthTokenSecret = data.oauth_token_secret;

      oauthToken_value = oauthToken;
      oauthTokenSecret_value = oauthTokenSecret;

      res.redirect(
        `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`
      );
    })
    .catch((error) => {
      console.error("Error:", error.data);
      res.status(500).send("Error during authentication");
    });
});

app.get("/auth/twitter/callback", (req, res) => {
  const oauthVerifier = req.query.oauth_verifier;
  const { address } = req.query
  console.log("oauthVerifier", address);


  const accessTokenRequestData = {
    url: "https://api.twitter.com/oauth/access_token",
    method: "POST",
    data: { oauth_verifier: oauthVerifier },
  };


  const requestToken = {
    key: oauthToken_value,
    secret: oauthTokenSecret_value,
  };

  const headers = oauth.toHeader(
    oauth.authorize(accessTokenRequestData, requestToken)
  );
  const data = querystring.stringify(accessTokenRequestData.data);

  axios({
    method: accessTokenRequestData.method,
    url: accessTokenRequestData.url,
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  })
    .then((response) => {
      const data = querystring.parse(response.data);
      const oauthAccessToken = data.oauth_token;
      const oauthAccessTokenSecret = data.oauth_token_secret;

      // console.log("Access Token:", oauthAccessToken);
      // console.log("Access Token Secret:", oauthAccessTokenSecret);

      const request_data = {
        url: "https://api.twitter.com/1.1/account/verify_credentials.json",
        method: "GET",
      };
      const token = {
        key: oauthAccessToken,
        secret: oauthAccessTokenSecret,
      };

      axios
        .get(request_data.url, {
          headers: oauth.toHeader(oauth.authorize(request_data, token)),
        })
        .then(async (response) => {

          const data = new Auth_Twitter_GuildQB({
            UserAddress: address,
            UserName: response.data.name
          });
          await data.save();

          console.log("data", data);
          res.status(201).send({
            data: data,
            success: true,
            msg: "User Data"
          })


        })
        .catch((error) => {
          res.status(400).send({
            data: [],
            success: false,
            msg: "Error during authentication"
          })
        });
    })
    .catch((error) => {
      console.error("Error:", error);
      // res.status(400).send("Error during authentication callback");
      res.status(400).send({
        data: [],
        success: false,
        msg: "Error during authentication callback"
      })
    });
});

app.get("/get_Twitter_Auth_Data", async (req, res) => {
  try {
    let { User_Address } = req.query

    let User_Data = await Auth_Twitter_GuildQB.find({ UserAddress: User_Address })
    // console.log("User_Data", User_Data);
    if (User_Data.length != 0) {
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
    console.log(error);
  }
})



let PATH = process.env.PORT || 3344;
let server = app.listen(PATH, () => {
  dbConnection();
  console.log(`GuildQB server listening at http://localhost:${PATH}`);
})
process.on('unhandledRejection', error => {
  console.log(error.message);
  server.close(() => process.exit(1));
});