const [major] = process.versions.node.split(".");

if (major < 10) {
  console.log("Go with the latest version of node");
  process.exit();
}

import express from "express";
import "dotenv/config";
import cors from "cors";
import queryString from "query-string";
import axios from "axios";
import jwt from "jsonwebtoken";
// Initialise our app
const app = express();
// convert the data in json which comes from the body
app.use(express.json());
// set the port on our application
app.set("port", process.env.PORT || 9090);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Hello From Server" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const authParams = queryString.stringify({
  client_id: process.env.GOOGLE_CLIENT_ID,
  redirect_uri: process.env.REDIRECT_URL,
  response_type: "code",
  scope: "openid profile email",
  access_type: "offline",
  state: "standard_oauth",
  prompt: "consent",
});

app.get("/auth/url", async (_, res) => {
  try {
    res.status(200).json({
      url: `https://accounts.google.com/o/oauth2/v2/auth?${authParams}`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/auth/token", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send({ message: "code is missing" });
    const tokenParams = queryString.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URL,
    });
    const {
      data: { id_token },
    } = await axios.post(`https://oauth2.googleapis.com/token?${tokenParams}`);
    if (!id_token) return res.status(400).json({ message: "Auth Error" });
    const { name, picture, email } = jwt.decode(id_token);
    console.log(name);
    res.status(200).json({ message: "Login successfull" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// listening our App on PORT
const server = app.listen(app.get("port"), () => {
  console.log(`🚀 server is running on ${server.address().port}`);
});
