import React from "react";
import { Container } from "react-bootstrap";

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=8b4c2a5217f34dbb81fb75c49182743e&response_type=code&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export default function Login() {
	return (
		<Container
			className="flex flex-col container mx-auto justify-center items-center bg-black"
			style={{ minHeight: "100vh", minWidth: "100vw" }}
		>
			{/* insert spotify logo as an image */}
			<a>
				<img
					src="https://cdn.cdnlogo.com/logos/s/48/spotify.svg"
					height={250}
					alt="Spotify"
					className="w-32 md:w-48 lg:w-64"
				/>
			</a>
			<a
				className="rounded-lg hover:shadow-lg hover:shadow-green-500 pt-4 pb-4 pr-8 pl-8 font-bold text-xl text-center text-white bg-green-500"
				href={AUTH_URL}
			>
				Login With Spotify
			</a>
		</Container>
	);
}
