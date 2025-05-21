import { motion } from "framer-motion";

const ImagePanel = ({ imgSrc, isLeft, title, id, onClose }) => {
	return (
		<motion.div
			className="fixed inset-0 bg-white flex"
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			<div
				className={`flex-1 flex items-center p-5 ${
					isLeft ? "justify-start" : "justify-end"
				}`}>
				<motion.div className="relative">
					<motion.img
						src={imgSrc}
						alt={title}
						className="max-h-screen max-w-full object-contain"
						initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
						animate={{
							opacity: [0, 1, 1], // Match the opacity sequence
							clipPath: [
								"inset(0% 0% 100% 0%)", // Start clipped from bottom
								"inset(0% 0% 0% 0%)", // Fully visible
								"inset(0% 0% 0% 0%)", // Stay fully visible
							],
						}}
						transition={{
							times: [0, 0.6, 1],
							duration: 0.6,
							delay: 0.5, // Keep your existing delay
							ease: "easeOut", // Match the easeOut of the last frame
						}} // Adjusted timing to match the final frame
					/>

					<motion.div
						className={`fixed bottom-4 text-xs text-black ${
							isLeft ? "right-4" : "left-4"
						}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.1 }}>
						<p className="mb-2 font-medium">
							{title} - {id}
						</p>
						<button onClick={onClose}>Close</button>
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default ImagePanel;
