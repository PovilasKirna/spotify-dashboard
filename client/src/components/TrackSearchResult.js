import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
	function handlePlay() {
		chooseTrack(track);
	}

	return (
		<div
			className="flex m-2 align-items-center cursor-pointer"
			onClick={handlePlay}
		>
			<img
				src={track.albumUrl}
				style={{ height: "64px", width: "64px" }}
				alt="searchTrackCover"
			/>
			<div className="ml-3">
				<div className="text-white">{track.name}</div>
				<div className="text-[#6c757d]">{track.artist}</div>
			</div>
		</div>
	);
}
