import { motion } from "framer-motion";

const CLIP_PATHS = {
	third: {
		initial: "inset(0% 0% 0% 100%)",
		exit: "inset(0% 100% 0% 0%)",
	},
	fourth: {
		initial: "inset(100% 0% 0% 0%)",
		exit: "inset(0% 0% 100% 0%)",
	},
	default: {
		initial: "inset(0% 0% 100% 0%)",
		exit: "inset(100% 0% 0% 0%)",
	},
};

const ImagePanel = ({ imgSrc, isLeft, title, id, onClose, batch }) => {
	const clipPath = CLIP_PATHS[batch] || CLIP_PATHS.default;

	return (
		<div
			className={`fixed inset-0 flex items-center p-5 pointer-events-none z-[2000] ${
				isLeft ? "justify-start" : "justify-end"
			}`}>
			<motion.img
				src={imgSrc}
				alt={title}
				className="max-h-screen max-w-full object-contain pointer-events-auto"
				initial={{ opacity: 0, clipPath: clipPath.initial }}
				animate={{
					opacity: [0, 1, 1],
					clipPath: [
						clipPath.initial,
						"inset(0% 0% 0% 0%)",
						"inset(0% 0% 0% 0%)",
					],
				}}
				transition={{
					times: [0, 0.6, 1],
					duration: 0.6,
					delay: 0.9,
					ease: "easeOut",
				}}
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
				<button
					className="cursor-pointer pointer-events-auto"
					onClick={onClose}>
					Close
				</button>
			</motion.div>
		</div>
	);
};

export default ImagePanel;
