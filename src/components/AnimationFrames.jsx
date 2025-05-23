import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Clip path configurations
const CLIP_PATHS = {
	default: {
		initial: "inset(0% 0% 100% 0%)",
		exit: "inset(100% 0% 0% 0%)",
	},
	third: {
		initial: "inset(0% 0% 0% 100%)",
		exit: "inset(0% 100% 0% 0%)",
	},
	fourth: {
		initial: "inset(100% 0% 0% 0%)",
		exit: "inset(0% 0% 100% 0%)",
	},
};

const AnimationFrames = ({
	isAnimating,
	sourceRect,
	targetRect,
	imgSrc,
	onAnimationComplete,
	isLeft,
	tilt = false,
	batch,
}) => {
	const [frames, setFrames] = useState([]);

	useEffect(() => {
		if (!isAnimating || !sourceRect || !targetRect) return;

		const generatedFrames = generateFrames(
			sourceRect,
			targetRect,
			isLeft,
			tilt,
			batch
		);
		setFrames(generatedFrames);

		const timer = setTimeout(onAnimationComplete, 1700); // ~1.7s total duration
		return () => clearTimeout(timer);
	}, [
		isAnimating,
		sourceRect,
		targetRect,
		isLeft,
		batch,
		tilt,
		onAnimationComplete,
	]);

	if (!isAnimating || !frames.length) return null;

	const clipPath = CLIP_PATHS[batch] || CLIP_PATHS.default;

	return (
		<div className="fixed inset-0 pointer-events-none">
			<AnimatePresence>
				{frames.map((frame) => (
					<motion.div
						key={frame.id}
						className="absolute overflow-hidden"
						style={{
							left: frame.left,
							top: frame.top,
							width: frame.width,
							height: frame.height,
							zIndex: 1500 + frame.id,
							rotate: frame.rotation,
						}}
						initial={{ opacity: 0, clipPath: clipPath.initial }}
						animate={{
							opacity: [0, 0.9, 0.9, 0],
							clipPath: [
								clipPath.initial,
								"inset(0% 0% 0% 0%)",
								"inset(0% 0% 0% 0%)",
								clipPath.exit,
							],
						}}
						transition={{
							times: [0, 0.2, 0.7, 1],
							duration: 1,
							delay: frame.delay,
							ease: "easeInOut",
						}}>
						<img
							src={imgSrc}
							alt=""
							className={`w-full h-full object-cover ${
								batch === "fourth" ? "contrast-200" : ""
							}`}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

function generateFrames(startRect, endRect, isLeft, tilt, batch) {
	const frameCount = 10;
	const frames = [];

	const start = getRectCenter(startRect);
	const end = getFinalPosition(endRect, isLeft);
	const arcHeight = batch === "third" ? 200 : 0;

	for (let i = 1; i < frameCount; i++) {
		const progress = i / frameCount;
		const eased = easeInOut(progress);

		const width = lerp(startRect.width, endRect.width, eased);
		const height = lerp(startRect.height, endRect.height, eased);
		const x = lerp(start.x, end.x, progress);
		const y =
			lerp(start.y, end.y, progress) + Math.sin(Math.PI * progress) * arcHeight;

		frames.push({
			id: i,
			left: x - width / 2,
			top: y - height / 2,
			width,
			height,
			rotation: tilt ? (i % 2 === 0 ? 5 : -5) : 0,
			delay: i * 0.06,
		});
	}

	return frames;
}

function getRectCenter(rect) {
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	};
}

function getFinalPosition(endRect, isLeft) {
	const padding = 20;
	const x = isLeft
		? padding + endRect.width / 2
		: window.innerWidth - padding - endRect.width / 2;

	return { x, y: window.innerHeight / 2 };
}

const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export default AnimationFrames;
