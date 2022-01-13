require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Error, Mongoose } = require("mongoose");
const Users = require("../../../db/models/user");
const srp = require("secure-remote-password/server");
let serverEphemeralSecret;
let salt;
let verifier;
let serverEphemeral;

const info = (req, res) => {
  console.log(req.body.Username)
  Users.findOne({ username: req.body.Username })
    .then((result) => {
      console.log(result)
      if (result === null) {
        const err = new Error("The username doesn't exist");
        err.status = 404;
        res.json({
          message: err.message,
          status: err.status,
        });
      } else {
        salt = result.salt;
        verifier = result.verifier;
        serverEphemeral = srp.generateEphemeral(verifier);
        serverEphemeralSecret = serverEphemeral.secret;

        // res.set({
        //   "access": "application/vnd.protonmail.api+json;apiversion=3",
        //   "access-control-allow-credentials": "true",
        //   "access-control-allow-origin": "http://localhost:8081 (http://localhost:8081/)",
        //   "access-control-expose-headers": "Date, Retry-After",
        //  "cache-control": "max-age=0, must-revalidate, no-cache, no-store, private",
        //  "connection": "close",
        //  "Content-Encoding": "gzip",
        //  "Accept-Encoding": "gzip, deflate"




        // })

        
        



        
        res.json({
          Salt: salt.slice(0,16),
          ServerEphemeral: serverEphemeral.public,
          Modulus: "-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA256\n\n+1IvUX/gFZczqjnytXg3w6MuT5KoTZ4/0eIudFzIy28+L59RLF9ucBXamWdX8cytWmvLyufQ+IqcIZAX1C3ie3JgS7fpl7vZxnd2d3AYxJbvBMUmRpjAxIEjU1V16hVSDZkxwPn728fqyBtvzKL0ud91muFNnG2SgW8ilVoFO89y3l4y4bN+ivfpiw0LnruCEGiibvbRO+zocsPRDhzmAaO/JqkngW6BNjwQ7kWNeT/6iOucUxHnB5ToJFW0PzyDppKiO/zCghuAI37zsZ0/Mo7pZR+n0InwEFd/UT92NSpPk6i5h6efo/L8LIsdC1C3cU1MlZh3TwXNB6rx+7HjoA==\n-----BEGIN PGP SIGNATURE-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\nwl4EARYIABAFAlwB1jwJEDUFhcTpUY8mAACj3QEArnZtJPcPfcyiYsgzhSbH\nY5Dtxe4BLshpzvMAWwaVqQQBAO0FMBp7c1aXb7KOIhgJsTf5Fq6xmqtEtsJC\nBo6aXEIC\n=momX\n-----END PGP SIGNATURE-----\n",
          SRPSession: "4ac3003175c277c9906ae0e83076858e",
          Version: 4
        });
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

const checkLogin = (req, res) => {
  try {
    const serverSession = srp.deriveSession(
      serverEphemeralSecret,
      req.body.ClientEphemeral,
      salt,
      req.body.Username,
      verifier,
      req.body.ClientProof
    );
    res.json({
      "ServerProof": serverSession.proof,
      "AccessToken": "u6va55adcwzebluo6z3zmrqpuyspsbl7",
      "Code": 1000,
      "EventID": "btQIQAdXsZXobkaIGilFYVzn6dBhQ3aWvVJYWKnFsVMzLWO2_7HPW1N2kZRITGtQ2qQwkdLPq8TykQx1hv1ymA==",
      "ExpiresIn": 864000,
      "LocalID": 28,
      "PasswordMode": 1,
      "RefreshToken": "rcavibitit63pighy36v5wa77gvysmbu",
      "Scope": "full self payments keys parent user loggedin nondelinquent mail calendar verified",
      "TemporaryPassword": 0,
      "TokenType": "Bearer",
      "TwoFactor": 0,
      "UID": "zgiimmu7mmnjywuezat267o55qq5fz2b",
      "Uid": "zgiimmu7mmnjywuezat267o55qq5fz2b",
      "UserID": "gHklmByboqB2egWpspxL7Zew9BAF_OLVC4xKrBIjK2bwzqa1ctGFYySqqb1f_CvQ-3hSQoAFHdlNMnyJPCiBfg==",
      "Scopes": ["full", "self", "payments", "keys", "parent", "user", "loggedin", "nondelinquent", "mail", "calendar","verified"],
      "2FA":{
        "Enabled":0,
        "FIDO2":{
           "AuthenticationOptions":null,
           "RegisteredKeys":[
              
           ]
        },
        "TOTP":0
     },
     "TemporaryPassword":0
    });
  } catch (error) {
    console.error("error");
    res.send("Auth failed");
  }

  // const payload = {
  //   userId: id,
  // };
  // console.log(payload);
  // const options = { expiresIn: "60m" };

  // const secret = process.env.SECRET;
  // const token = jwt.sign(payload, secret, options);

  // res.json({ token: token, userId: id });
};

const userinfo =(req, res)=>{
  try {
    res.json({
      code : 1000 , 
      User  :{ 
        Credit: 0,
        Currency: "EUR",
        Delinquent: 0,
        DisplayName: "omarpgp",
        DriveEarlyAccess: 0,
        Email: "omarpgp@protonmail.com",
        ID: "gHklmByboqB2egWpspxL7Zew9BAF_OLVC4xKrBIjK2bwzqa1ctGFYySqqb1f_CvQ-3hSQoAFHdlNMnyJPCiBfg==",
        Keys: [{
          Active: 1,
          Fingerprint: "b58d3dc3472e67a386322e35cd1799eab3ef5965",
          ID: "zkrqp3A495mJjU0aPniodpjt21BIuM_gA-Rg07B2ldvebzYYTLgAAz1jnLwjn8xIJuXU3ncbVMnViJxqgjXN-A==",
          Primary: 1,
          PrivateKey: "-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\n\nxYYEYdrKHxYJKwYBBAHaRw8BAQdAo1HM4wqz3Qc7HyUQh5ZugtSivKt2mSqu\nDLAp3YNsKSX+CQMInXR/BBz51NFguK57DngxDL+Z/MmSm+uU3/qaiDJcdhxZ\nQxySasnXE6P4Jxjbw8MR0/o2+FQtDW71J6TCYJWw3ElVTQlx1hAvATvuoQ/w\n9807bm90X2Zvcl9lbWFpbF91c2VAZG9tYWluLnRsZCA8bm90X2Zvcl9lbWFp\nbF91c2VAZG9tYWluLnRsZD7CjwQQFgoAIAUCYdrKHwYLCQcIAwIEFQgKAgQW\nAgEAAhkBAhsDAh4BACEJEM0Xmeqz71llFiEEtY09w0cuZ6OGMi41zReZ6rPv\nWWVbyQD8DKK4qUO6oMy/mC/2vVPlqP1IH1gL388t85M200rURp0BAIfgWO+g\nQueyNFFlxjT+k5fO/64cCuXnEVOpXW/TLuINx4sEYdrKHxIKKwYBBAGXVQEF\nAQEHQO+c7NQgN+Tih67JMheCOl23DckUfS8CCPwGHOPdll8oAwEIB/4JAwhM\nPqWZIJbuWmAzVyhRx9Cq+b7jz2PIK91cLyPrHNF8a8ZeVTaBZSElXnCseb2r\nbG2PM2sBany2+bR4Dw4vnosau1K8J45R3s14Yi63lpBnwngEGBYIAAkFAmHa\nyh8CGwwAIQkQzReZ6rPvWWUWIQS1jT3DRy5no4YyLjXNF5nqs+9ZZduhAQCJ\ng4ZGpn3cKzGfZkA5oj4oIcO7+ARvpv75w2oxFvNpvwD+L/DAa6m1aUPyhHwY\n2opcVpTrdMNUzeV0LW1pzc4lEgo=\n=XZTM\n-----END PGP PRIVATE KEY BLOCK-----\n",
          RecoverySecret: null,
          RecoverySecretSignature: null,
          Version: 3,
        }],
        MaxSpace: 524288000,
        MaxUpload: 26214400,
        MnemonicStatus: 1,
        Name: "omarpgp",
        Private: 1,
        Role: 0,
        Services: 1,
        Subscribed: 0,
        ToMigrate: 0,
        Type: 1,
        UsedSpace: 627441,
      }

      
    });
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}


const userSalts =(req, res)=>{
  try {
    res.json({Code:1000,
    KeySalts:[{ID:"zkrqp3A495mJjU0aPniodpjt21BIuM_gA-Rg07B2ldvebzYYTLgAAz1jnLwjn8xIJuXU3ncbVMnViJxqgjXN-A==",
    KeySalt:"sKSEYByZktEnmzyy8lhlUQ=="},
    {ID:"WE-6WqXlvFIicuGxk7EjozTiCQnyk3AfyfCW_7mnaZBkI9TWvDfggv_oGbVU8tRY8Na75cX802BfGxbcZ5UPgQ==",
    KeySalt:null}]}
    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}










const authentication = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const secret = process.env.SECRET;
  jwt.verify(token, secret, (err, result) => {
    if (err) {
      const err = new Error("The token is invalid or expired");
      err.status = 403;
      res.json({
        message: err.message,
        status: err.status,
      });
    }
    if (result) {
      req.token = result;
      console.log(result);
      next();
    }
  });
};

const authorization = (p) => {
  return (req, res, next) => {
    let status = false;
    for (let x = 0; x < req.token.role.permissions.length; x++) {
      if (req.token.role.permissions[x] === p) {
        status = true;
      }
    }
    if (status === false) {
      const err = new Error("forbidden");
      err.status = 403;
      res.json({
        message: err.message,
        status: err.status,
      });
    } else {
      next();
    }
  };
};

module.exports = { userSalts , userinfo , info, checkLogin, authentication, authorization };
