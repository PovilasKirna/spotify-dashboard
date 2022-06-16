import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function UserButton({ user }) {
	const [xPos, setxPos] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setxPos(110);
		}, 5000);
	});

	var variants = {
		open: {
			opacity: 1,
			x: xPos,
		},
		close: {
			opacity: 0,
			x: 200,
		},
	};

	return (
		<AnimatePresence>
			<motion.a
				style={{
					position: "absolute",
					height: "56px",
					backgroundColor: "rgb(0, 0, 0, 50%)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: "30px 0 0 30px",
					border: "none",
					paddingRight: "8px",
					fontSize: "1rem",
					color: "white",
					right: 0,
					textDecoration: "none",
				}}
				variants={variants}
				initial={"close"}
				animate={"open"}
				transition={{ duration: 0.5 }}
				whileHover={() => setxPos(0)}
				//onClick go back to login
				href="/login"
			>
				<img
					className="rounded-full mr-4 h-[56px]"
					src={user.body.images[0].url}
					height={"50px"}
					alt="userImage"
				/>
				{user.body.display_name}
			</motion.a>
		</AnimatePresence>
	);
}

export default UserButton;
