const user = require("../../db/models/user");
const openpgp = require("openpgp");

const createNewUser = (req, res) => {
  const { username, salt, verifier } = req.body;
  const newUser = new user({
    username,
    salt,
    verifier,
  });
  newUser
    .save()
    .then((result) => {
      res.status(201);
      res.json(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

const generatePGP = (req, res) => {
  (async () => {
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: "rsa", // Type of the key
      rsaBits: 4096, // RSA key size (defaults to 4096 bits)
      userIDs: [{ name: "Jon Smith", email: "jon@example.com" }], // you can pass multiple user IDs
      passphrase: "super long and hard to guess secret", // protects the private key
    });
    // console.log(privateKey);
    // console.log(publicKey);
    const publicKey1 = await openpgp.readKey({ armoredKey: publicKey });

    const privateKey1 = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
      passphrase: "super long and hard to guess secret",
    });

    const unsignedMessage = await openpgp.createCleartextMessage({
      text: "Hello, World!",
    });
    const cleartextMessage = await openpgp.sign({
      message: unsignedMessage, // CleartextMessage or Message object
      signingKeys: privateKey1,
    });
    console.log(cleartextMessage);

    const unsignedMessage2 = await openpgp.createCleartextMessage({
      text: "dddd",
    });

    const cleartextMessage2 = await openpgp.sign({
      message: unsignedMessage2, // CleartextMessage or Message object
      signingKeys: privateKey1,
    });

    const signedMessage = await openpgp.readCleartextMessage({
      cleartextMessage: cleartextMessage2, // parse armored message
    });
    const verificationResult = await openpgp.verify({
      message: signedMessage,
      verificationKeys: publicKey1,
    });
    const { verified, keyID } = verificationResult.signatures[0];
    try {
      await verified; // throws on invalid signature
      console.log("Signed by key id " + keyID.toHex());
    } catch (e) {
      throw new Error("Signature could not be verified: " + e.message);
    }
  })();
  res.json("ok");
};

const getUserDataById = (req, res) => {
  const id = req.params.id;
  user
    .findOne({ _id: id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports = {
  createNewUser,
  getUserDataById,
  generatePGP,
};
