const express = require("express");
const app = express();
const spotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const genius = require("genius-lyrics-api");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

app.post("/refresh", (req, res) => {
	const refreshToken = req.body.refreshToken;
	const spotifyApi = new spotifyWebApi({
		redirectUri: process.env.SPOTIFY_REDIRECT_URI,
		clientId: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		refreshToken,
	});

	spotifyApi
		.refreshAccessToken()
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				expiresIn: data.body.expires_in,
			});
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

app.post("/login", (req, res) => {
	const { code } = req.body;

	const spotifyApi = new spotifyWebApi({
		clientId: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		redirectUri: process.env.SPOTIFY_REDIRECT_URI,
	});
	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			console.log(data);
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expires_in,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err.message,
			});
		});
});

//https://github.com/farshed/genius-lyrics-api
//https://genius.com/api-clients
app.get("/lyrics", async (req, res) => {
	const options = {
		apiKey: process.env.GENIUS_API_KEY,
		title: req.query.track,
		artist: req.query.artist,
		optimizeQuery: true,
	};
	const lyrics = await genius.getLyrics(options);
	res.json({ lyrics });
});

app.get("/user", async (req, res) => {
	const accessToken = req.query.accessToken;
	const spotifyApi = new spotifyWebApi({
		clientId: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		redirectUri: process.env.SPOTIFY_REDIRECT_URI,
	});
	spotifyApi.setAccessToken(accessToken);
	const user = await spotifyApi.getMe();
	res.json({ user });
	console.log(user);
});

app.listen(3001);
console.log("Server running on port 3001");
