"use client";

import { motion } from "framer-motion";

// Utility function to get clip path animations (shared logic)
const getClipPathAnimation = (batch) => {
	const isThirdBatch = batch === "third";
	const isFourthBatch = batch === "fourth";

	const clipPathStart = isThirdBatch
		? "inset(0% 0% 0% 100%)" // third: right→left
		: isFourthBatch
		? "inset(100% 0% 0% 0%)" // fourth: bottom→top
		: "inset(0% 0% 100% 0%)"; // default: top→bottom

	const clipPathVisible = "inset(0% 0% 0% 0%)";

	const clipPathExit = isThirdBatch
		? "inset(0% 100% 0% 0%)" // third exit
		: isFourthBatch
		? "inset(0% 0% 100% 0%)" // fourth exit (back to clipped bottom)
		: "inset(100% 0% 0% 0%)"; // default exit

	return {
		initial: clipPathStart,
		animate: clipPathVisible,
		exit: clipPathExit,
	};
};

const ImagePanel = ({ imgSrc, isLeft, title, id, onClose, batch }) => {
	const clipPaths = getClipPathAnimation(batch);

	return (
		<>
			<div
				className={`fixed inset-0 flex items-center p-5 pointer-events-none z-[2000] ${
					isLeft ? "justify-start" : "justify-end"
				}`}>
				<motion.div className="relative pointer-events-auto">
					<motion.img
						src={imgSrc}
						alt={title}
						className="max-h-screen max-w-full object-contain z-[2000]"
						initial={{
							opacity: 0,
							clipPath: clipPaths.initial,
						}}
						animate={{
							opacity: [0, 1, 1],
							clipPath: [
								clipPaths.initial,
								clipPaths.animate,
								clipPaths.animate,
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
						className={`fixed bottom-4 text-xs text-black  ${
							isLeft ? "right-4" : "left-4"
						}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: 0.5,
							duration: 0.1,
						}}>
						<p className="mb-2 font-medium">
							{title} - {id}
						</p>
						<button
							className="cursor-pointer pointer-events-auto"
							onClick={onClose}>
							Close
						</button>
					</motion.div>
				</motion.div>
			</div>
		</>
	);
};

export default ImagePanel;
