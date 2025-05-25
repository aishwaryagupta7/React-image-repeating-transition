import { useRef } from "react";
import { motion } from "framer-motion";

const Card = ({ imgSrc, title, id, onClick, index }) => {
	const cardRef = useRef(null);

	const handleClick = () => {
		// Pass the card's DOM element reference to the onClick handler
		// This will be used to calculate the starting position for the animation
		onClick(index, cardRef.current);
	};

	return (
		<motion.div
			className="flex flex-col justify-center w-full mb-14 cursor-pointer"
			onClick={handleClick}
			ref={cardRef}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.3 }}>
			<div className="overflow-hidden">
				<motion.img
					src={imgSrc}
					alt={title}
					className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
				/>
			</div>
			<motion.div className="mt-1 flex justify-end">
				<p className="text-xs font-bold lowercase text-black">
					{title} - <span>{id}</span>
				</p>
			</motion.div>
		</motion.div>
	);
};

export default Card;
