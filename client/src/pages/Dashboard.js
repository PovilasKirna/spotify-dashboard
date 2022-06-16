import React from "react";
import useAuth from "../useAuth";
import { Container, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "../components/TrackSearchResult";
import Player from "../components/Player";
import axios from "axios";
import UserButton from "../components/UserButton";
import { shuffle } from "lodash";

const SpotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const colors = [
	"indigo",
	"blue",
	"green",
	"yellow",
	"orange",
	"red",
	"purple",
	"pink",
	"teal",
	"cyan",
];

export default function Dashboard({ code }) {
	const accessToken = useAuth(code);
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [lyrics, setLyrics] = useState("");
	const [playingTrack, setPlayingTrack] = useState();
	const [user, setUserDetails] = useState();
	const [color, setColor] = useState(null);

	function chooseTrack(track) {
		setPlayingTrack(track);
		setSearch("");
		setLyrics("");
	}

	useEffect(() => {
		setColor(shuffle(colors).pop());
	}, []);

	//accesstoken
	useEffect(() => {
		if (!accessToken) return;
		SpotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	//search
	useEffect(() => {
		if (!search) return setResults([]);
		if (!accessToken) return;
		let cancel = false;
		SpotifyApi.searchTracks(search, { limit: 20 }).then((res) => {
			if (cancel) return;
			setResults(
				res.body.tracks.items.map((track) => {
					return {
						name: track.name,
						artist: track.artists[0].name,
						uri: track.uri,
						albumUrl: track.album.images[0].url,
					};
				})
			);
		});

		return () => {
			cancel = true;
		};
	}, [search, accessToken]);

	//set lyrics
	useEffect(() => {
		if (!playingTrack) return;

		axios
			.get("http://localhost:3001/lyrics", {
				params: {
					track: playingTrack.name,
					artist: playingTrack.artist,
				},
			})
			.then((res) => {
				setLyrics(res.data.lyrics);
			});
	}, [playingTrack]);

	//user
	useEffect(() => {
		if (!accessToken) return;
		axios
			.get("http://localhost:3001/user", {
				params: {
					accessToken: accessToken,
				},
			})
			.then((res) => {
				setUserDetails(res.data.user);
			});
	}, [accessToken]);

	return (
		<Container
			className="flex flex-col container items-center pt-2 min-w-full min-h-full overflow-hidden scrollbar-hide"
			style={{
				background: `linear-gradient(0deg, rgba(0,0,0,1) 60%, ${color} 100%)`,
			}}
		>
			<div
				className={`flex flex-row content-between`}
				style={{ minWidth: "80vw" }}
			>
				<Form.Control
					type="search"
					placeholder={`Artists, songs or genres`}
					className="flex-grow p-4 rounded-full"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				{user && <UserButton user={user} />}
			</div>
			<div className="overflow-auto flex-grow scrollbar-hide">
				<div className="flex flex-col">
					{results.map((track) => (
						<TrackSearchResult
							track={track}
							key={track.uri}
							chooseTrack={chooseTrack}
						/>
					))}
				</div>
				{results.length === 0 && (
					<div className="text-center whitespace-pre overflow-auto scrollbar-hide text-white justify-center">
						<p className="text-[40px] font-bold text-left">{lyrics}</p>
					</div>
				)}
			</div>
			<div
				className="rounded-md bg-[#191414] p-2 mb-2"
				style={{ minWidth: "80vw" }}
			>
				<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
			</div>
		</Container>
	);
}
