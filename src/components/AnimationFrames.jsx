import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimationFrames = ({
	isAnimating,
	sourceRect,
	targetRect,
	imgSrc,
	onAnimationComplete,
	isLeft,
}) => {
	const [movers, setMovers] = useState([]);
	const frameCount = 10;

	useEffect(() => {
		if (!isAnimating || !sourceRect || !targetRect) return;

		// Create path between start and end elements
		const frames = generateMotionPath(
			sourceRect,
			targetRect,
			frameCount,
			isLeft
		);
		setMovers(frames);

		// Calculate total animation duration
		const appearanceDuration = frameCount * 0.05; // Time for all frames to appear
		const disappearanceDuration = 1; // Faster disappearance for non-last frames
		const totalDuration = appearanceDuration + disappearanceDuration + 0.2;

		const timer = setTimeout(() => {
			onAnimationComplete();
		}, totalDuration * 1000);

		return () => clearTimeout(timer);
	}, [isAnimating, sourceRect, targetRect, isLeft, onAnimationComplete]);

	// Generate motion path between start and end elements
	const generateMotionPath = (startRect, endRect, steps, isLeft) => {
		const path = [];
		const startCenter = {
			x: startRect.left + startRect.width / 3,
			y: startRect.top + startRect.height / 2,
		};

		const endCenter = {
			x: endRect.left + endRect.width / 2,
			y: endRect.top + endRect.height / 2,
		};

		// For each step in the path
		for (let i = 1; i < steps; i++) {
			const t = i / (steps - 1);
			const eased = easeInOut(t);

			// Lerp width and height
			const width = lerp(startRect.width, endRect.width, eased);
			const height = lerp(startRect.height, endRect.height, eased);

			// Calculate position with straight line path
			const x = lerp(startCenter.x, endCenter.x, t);
			const y = lerp(startCenter.y, endCenter.y, t);

			// No rotation for cleaner look
			const rotation = 0;

			// Add this frame to the path
			path.push({
				id: i,
				left: x - width / 2,
				top: y - height / 2,
				width,
				height,
				rotation,
				delay: i * 0.06, // Staggered delay for sequential appearance
				// Last frame has no disappearance, others disappear quickly after all frames appear
				isLastFrame: i === steps - 1,
				disappearDelay:
					i === steps - 1 ? null : frameCount * 0.06 + (steps - i) * 0.03,
			});
		}

		return path;
	};

	// Linear interpolation helper
	const lerp = (a, b, t) => a + (b - a) * t;

	// Simple easing function
	const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

	if (!isAnimating || movers.length === 0) return null;

	return (
		<div className="fixed inset-0 pointer-events-none">
			<AnimatePresence>
				{movers.map((mover) => (
					<motion.div
						key={mover.id}
						className="absolute origin-center"
						style={{
							left: mover.left,
							top: mover.top,
							width: mover.width,
							height: mover.height,
							zIndex: 1000 + mover.id,
							overflow: "hidden",
						}}
						initial={{
							opacity: 0,
							clipPath: "inset(0% 0% 100% 0%)", // Start clipped from bottom
							rotate: mover.rotation,
						}}
						animate={
							mover.isLastFrame
								? {
										// Last frame stays visible
										opacity: [0, 1, 1],
										clipPath: [
											"inset(0% 0% 100% 0%)", // Start clipped from bottom
											"inset(0% 0% 0% 0%)", // Fully visible
											"inset(0% 0% 0% 0%)", // Stay fully visible
										],
								  }
								: {
										// Other frames appear and then quickly disappear
										opacity: [0, 0.9, 0.9, 0],
										clipPath: [
											"inset(0% 0% 100% 0%)", // Start clipped from bottom
											"inset(0% 0% 0% 0%)", // Fully visible
											"inset(0% 0% 0% 0%)", // Stay visible briefly
											"inset(100% 0% 0% 0%)", // Exit to top quickly
										],
								  }
						}
						transition={
							mover.isLastFrame
								? {
										// Last frame transition - just appear and stay
										times: [0, 0.6, 1],
										duration: 0.6,
										delay: mover.delay,
										ease: "easeOut",
								  }
								: {
										// Other frames transition - appear and disappear quickly
										times: [0, 0.2, 0.7, 1],
										duration: 1,
										delay: mover.delay,
										ease: "easeInOut",
								  }
						}>
						<img
							src={imgSrc || "/placeholder.svg"}
							alt={`Animation frame ${mover.id}`}
							className="w-full h-full object-cover"
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

export default AnimationFrames;
