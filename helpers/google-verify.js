const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client();

async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const { name, email, picture: img } = ticket.getPayload();
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  return {
    name,
    email,
    img,
  };
}

module.exports = {
  googleVerify,
};
