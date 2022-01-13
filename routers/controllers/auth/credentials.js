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


const userCookies =(req, res)=>{
  try {
    res.json({Code:1000,
      UID:"4y7rsuiztewyi74yqiludqw6luecutcz",
      LocalID:6}

    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}


const userAddress =(req, res)=>{
  try {
    res.json(
    {Code:1000,
    Addresses:[
      {ID:"VgNpIulfYqwsSE1A87TN02tfnzCuM_OgGG0Bi9Y5_am6B5X5mltWuz1nsASX8CdruwRWamAkxyQhQ02H8M2tfw==",
      DomainID:"l8vWAXHBQmv0u7OVtPbcqMa4iwQaBqowINSQjPrxAr-Da8fVPKUkUcqAq30_BCxj1X0nW70HQRmAa-rIvzmKUA==",
      Email:"omarpgp@protonmail.com",
      Status:1,
      Type:1,
      Receive:1,
      Send:1,
      DisplayName:"omarpgp",
      Signature:"",
      Order:1,
      Priority:1,
      ConfirmationState:1,
      HasKeys:1,
      SignedKeyList:{MinEpochID:null,
                 MaxEpochID:null,
                 ExpectedMinEpochID:1,
                 Data:"[{\"Primary\":1,\"Flags\":3,\"Fingerprint\":\"7511208ceb2177c356761e50ef74e91cb7e84246\",\"SHA256Fingerprints\":[\"244ecd3e3ddf27c372f587986effae37ad56d9cadb364ed5922bbca011a37e11\",\"310d44a1db31ddf87d764baaf3f3754a15bcf2f462d5172bd28df4c794866478\"]}]",
                 ObsolescenceToken:null,
                 Signature:"-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.10.10\r\nComment: https://openpgpjs.org\r\n\r\nwnUEARYKAAYFAmHaylsAIQkQ73TpHLfoQkYWIQR1ESCM6yF3w1Z2HlDvdOkc\r\nt+hCRiKRAP9xkecZn3AMO7hyImnrTJP+JDQKdXl7Q0qL0IUIevU6wAEAlOtw\r\nAT/16qnSU2A/Ymlkuo6jolJrXNw1gcvcawCDHQw=\r\n=wIzO\r\n-----END PGP SIGNATURE-----\r\n"},
      Keys:[
        {ID:"WE-6WqXlvFIicuGxk7EjozTiCQnyk3AfyfCW_7mnaZBkI9TWvDfggv_oGbVU8tRY8Na75cX802BfGxbcZ5UPgQ==",
        Primary:1,
        Flags:3,
        Fingerprint:"7511208ceb2177c356761e50ef74e91cb7e84246",
        Fingerprints:["0634e9690ff9c66f5e6d933e94b0199e7c543bca","7511208ceb2177c356761e50ef74e91cb7e84246"],
        PublicKey:"-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: ProtonMail\n\nxjMEYdrKHxYJKwYBBAHaRw8BAQdASoekZ3lL6gjwsZfDQ3ZT+H+a5FVQjchM\nE+Ntx/E1fEPNL29tYXJwZ3BAcHJvdG9ubWFpbC5jb20gPG9tYXJwZ3BAcHJv\ndG9ubWFpbC5jb20+wo8EEBYKACAFAmHayh8GCwkHCAMCBBUICgIEFgIBAAIZ\nAQIbAwIeAQAhCRDvdOkct+hCRhYhBHURIIzrIXfDVnYeUO906Ry36EJGS/YB\nAJep8tXjqSulQikaHvSr0h52VMQ8sl7cbIM6NYNNTzYLAP9sEM62uZbXqWh9\nvVuN2yu2ffvUhiXS4ygJBQJ6ZeekBM44BGHayh8SCisGAQQBl1UBBQEBB0Bp\ndE/SndyKtRswQ5dRjwIosuQZWYrBMDlMgiHdos/MdgMBCAfCeAQYFggACQUC\nYdrKHwIbDAAhCRDvdOkct+hCRhYhBHURIIzrIXfDVnYeUO906Ry36EJGvkcA\n+QGMrTktRLrhP0rjnReErmn71mVpkMAQ+kqMXSdRtypJAP9mgbWRVJrhseRE\nqM5/xNTO17ajBwadkR7sJukQPcpmBA==\n=cS5C\n-----END PGP PUBLIC KEY BLOCK-----\n",
        Active:1,
        Version:3,
        Activation:null,
        PrivateKey:"-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: ProtonMail\n\nxYYEYdrKHxYJKwYBBAHaRw8BAQdASoekZ3lL6gjwsZfDQ3ZT+H+a5FVQjchM\nE+Ntx/E1fEP+CQMI366T9V7BYzdgIDyF8mAHeUawYv6l67mgkSFy9i1n4pfs\nZemNEOSYNVjvZD1rmo8CHgNJKWA2KsxZi5BTEJnKitkXhL2lCptJ9Ngs43WR\no80vb21hcnBncEBwcm90b25tYWlsLmNvbSA8b21hcnBncEBwcm90b25tYWls\nLmNvbT7CjwQQFgoAIAUCYdrKHwYLCQcIAwIEFQgKAgQWAgEAAhkBAhsDAh4B\nACEJEO906Ry36EJGFiEEdREgjOshd8NWdh5Q73TpHLfoQkZL9gEAl6ny1eOp\nK6VCKRoe9KvSHnZUxDyyXtxsgzo1g01PNgsA/2wQzra5ltepaH29W43bK7Z9\n+9SGJdLjKAkFAnpl56QEx4sEYdrKHxIKKwYBBAGXVQEFAQEHQGl0T9Kd3Iq1\nGzBDl1GPAiiy5BlZisEwOUyCId2iz8x2AwEIB/4JAwjk5tQVpIbb1GBfIqYD\nIosp6EGUCWOvDuBQrc4UP0Zx1uAHnFMNcyib/lejXBxqueJGKSJlIAhWvUvg\nKjF7qU52zkQbZ30suUK0H+2j+HuKwngEGBYIAAkFAmHayh8CGwwAIQkQ73Tp\nHLfoQkYWIQR1ESCM6yF3w1Z2HlDvdOkct+hCRr5HAPkBjK05LUS64T9K450X\nhK5p+9ZlaZDAEPpKjF0nUbcqSQD/ZoG1kVSa4bHkRKjOf8TUzte2owcGnZEe\n7CbpED3KZgQ=\n=YOMZ\n-----END PGP PRIVATE KEY BLOCK-----\n",
        Token:"-----BEGIN PGP MESSAGE-----\nVersion: ProtonMail\n\nwV4DBpzEmvhq64kSAQdAo4W+sepL8ol0JcGDSJhGT45OpbZv64qxfp3TT5SJ\nhSwwVkAV+Un/09sFAxsSnBKwGLgOiDLnysP3HgzABdifwDzA9Z/F7t+/QUYi\nr07HhKs10ngBpzW0Q3pYh78g4qTcnOP7OA6Q3AsaFxR/5c3Uca7KImgRX3Xn\neeR+/6ePfJhoPHC+Ynch06OLPWsO+j5JA03WTOiOSb+B0HbyM5pGhAi99VY9\nAL1mnNwPh2ipDhUwhcVkh2i+xHzBt5pqjHf4ZkUQgMGeqYCbUHg=\n=4bGA\n-----END PGP MESSAGE-----\n",
        Signature:"-----BEGIN PGP SIGNATURE-----\nVersion: ProtonMail\n\nwnUEARYKAAYFAmHaylsAIQkQzReZ6rPvWWUWIQS1jT3DRy5no4YyLjXNF5nq\ns+9ZZVYhAQCg5h7JmOaXntogWgFvSrHimdN6cj/4nAKVhzszpuBQtgD/YEiu\nKaeXadNf+Ykp5kVqackQK05S6O4Fem6vbUBMAQc=\n=EAGf\n-----END PGP SIGNATURE-----\n"}]}],
    Total:1}

    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}




const features =(req, res)=>{
  try {
    res.json(
      {Code:1000,
      Features:[
        {Code:"EarlyAccess",
        Type:"enumeration",
        Global:false,
        DefaultValue:"beta",
        Value:"beta",
        Options:["alpha","beta"],
        Writable:true}
      ],
      Total:1}
      

    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}



const settings =(req, res)=>{
  try {
    res.json(
      {Code:1000,
      UserSettings:{
        Email:{Value:"omarzead19@yahoo.com",Status:0,Notify:1,Reset:1},
        Phone:{Value:null,Status:0,Notify:1,Reset:1},
        Password:{Mode:1,ExpirationTime:null},
        PasswordMode:1,
        "2FA":{Enabled:0,Allowed:3,ExpirationTime:null,U2FKeys:[],RegisteredKeys:[]},
        TOTP:0,
        News:239,
        Locale:"en_US",
        LogAuth:1,
        InvoiceText:"",
        Density:0,
        Theme:null,
        ThemeType:0,
        WeekStart:0,
        DateFormat:0,
        TimeFormat:0,
        Flags:{Welcomed:1,InAppPromosHidden:0},
        TwoFactor:0,
        Welcome:1,
        WelcomeFlag:1,
        AppWelcome:{Mail:["Web"]},
        EarlyAccess:0,
        FontSize:0,
        Checklists:["get-started"]
      }
      }
      

    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}


const labels =(req, res)=>{
  try {
    res.json(
      {Code:1000,
      Labels:[]} 
      

    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}

const mailSettings =(req, res)=>{
  try {
    res.json(
      {"Code":1000,
      "MailSettings":{"LastLoginTime":1642072178,"AutoSaveContacts":1,"AutoWildcardSearch":1,"ComposerMode":0,"FontSize":null,"FontFace":null,"MessageButtons":0,"ShowImages":2,"ShowMoved":0,"ViewMode":0,"ViewLayout":0,"SwipeLeft":3,"SwipeRight":0,"AlsoArchive":0,"Hotkeys":0,"Shortcuts":1,"PMSignature":2,"ImageProxy":0,"TLS":0,"RightToLeft":0,"AttachPublicKey":0,"Sign":0,"PGPScheme":16,"PromptPin":0,"KT":0,"Autocrypt":0,"StickyLabels":0,"ExpandFolders":0,"ConfirmLink":1,"DelaySendSeconds":10,"ThemeType":0,"ThemeVersion":null,"Theme":"","DisplayName":"","Signature":"",
      "AutoResponder":{"StartTime":0,"EndTime":0,"DaysSelected":[],"Repeat":0,"Subject":"Auto","Message":"","IsEnabled":false,"Zone":"Europe/Zurich"}
      ,"EnableFolderColor":0,"InheritParentFolderColor":1,"NumMessagePerPage":50,"RecipientLimit":100,"DraftMIMEType":"text/html","ReceiveMIMEType":"text/html","ShowMIMEType":"text/html"}
    } 
      

    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}



const emailContact =(req, res)=>{
  try {
    res.json(
      {"Code":1000,
      "ContactEmails":[
        {"ID":"loDF07uR2IGVQzb4BZWT2UQy7Lhbxt5Sc1GsHGQIuonPqPOVxAjgYGYSiqSoSeKEG8QjfhzGsq2RH0GN4KGHMA==","Name":"omarpgp@protonmail.com","Email":"omarpgp@protonmail.com","Type":[],"Defaults":1,"Order":1,"LastUsedTime":1641728985,"ContactID":"vmgvijEtjaisdHcnUPJUf5KSgbKba-aghv18RUVKF-mxYEflvmadOk9sGTnOZ7pGKRImXUQ4LaigkMh4i4Wy9w==","LabelIDs":[],"CanonicalEmail":"omarpgp@protonmail.com"
      }
     ],
      "Total":1}
      

    );
  } catch (error) {
    console.error("error");
    res.send("user failed");
  }

}


const latestEvent =(req, res)=>{
  try {
    res.json({
      Code: 1000,
      EventID: "btQIQAdXsZXobkaIGilFYVzn6dBhQ3aWvVJYWKnFsVMzLWO2_7HPW1N2kZRITGtQ2qQwkdLPq8TykQx1hv1ymA==",
      More: 0,
      Notices:[],
      Refresh: 0
    }
      
      

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

module.exports = { latestEvent ,emailContact , mailSettings, labels, settings ,features, userAddress , userCookies , userSalts , userinfo , info, checkLogin, authentication, authorization };
