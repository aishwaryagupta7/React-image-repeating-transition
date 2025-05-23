import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const AnimationFrames = ({
	isAnimating,
	sourceRect,
	targetRect,
	imgSrc,
	onAnimationComplete,
	isLeft,
	tilt = "false",
	batch,
}) => {
	const [movers, setMovers] = useState([]);
	const frameCount = 9;

	useEffect(() => {
		if (!isAnimating || !sourceRect || !targetRect) return;

		const frames = generateMotionPath(
			sourceRect,
			targetRect,
			frameCount,
			isLeft,
			tilt,
			batch
		);
		setMovers(frames);

		const appearanceDuration = frameCount * 0.05;
		const disappearanceDuration = 1;
		const totalDuration = appearanceDuration + disappearanceDuration + 0.2;

		const timer = setTimeout(() => {
			onAnimationComplete();
		}, totalDuration * 1000);

		return () => clearTimeout(timer);
	}, [
		isAnimating,
		sourceRect,
		targetRect,
		isLeft,
		onAnimationComplete,
		batch,
		tilt,
	]);

	function generateMotionPath(startRect, endRect, steps, isLeft, tilt, batch) {
		const path = [];
		const startCenter = {
			x: startRect.left + startRect.width / 2,
			y: startRect.top + startRect.height / 2,
		};

		// Calculate the actual final position where the panel image will be
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const padding = 20; // p-5 = 20px

		// Calculate final image dimensions (maintaining aspect ratio, max-h-screen, max-w-full)
		const maxWidth = viewportWidth - padding * 2;
		const maxHeight = viewportHeight - padding * 2;

		// Use target rect dimensions as they represent the actual rendered size
		const finalWidth = endRect.width;
		const finalHeight = endRect.height;

		// Calculate final position based on left/right justification
		let finalX, finalY;

		if (isLeft) {
			// Left justified: image starts from left edge + padding
			finalX = padding + finalWidth / 2;
		} else {
			// Right justified: image ends at right edge - padding
			finalX = viewportWidth - padding - finalWidth / 2;
		}

		// Vertically centered
		finalY = viewportHeight / 2;

		const endCenter = { x: finalX, y: finalY };

		// Only the third batch gets an arc
		const arcHeight = batch === "third" ? 200 : 0;

		// Generate frames but exclude the very last one
		for (let i = 1; i < steps; i++) {
			const t = i / steps; // Changed to use steps instead of (steps - 1)
			const eased = easeInOut(t);

			// Size interpolation
			const width = lerp(startRect.width, finalWidth, eased);
			const height = lerp(startRect.height, finalHeight, eased);

			// Linear x + arc y
			const x = lerp(startCenter.x, endCenter.x, t);
			const y =
				lerp(startCenter.y, endCenter.y, t) + Math.sin(Math.PI * t) * arcHeight;

			// Optional tilt
			const rotation = tilt ? (i % 2 === 0 ? 5 : -5) : 0;

			path.push({
				id: i,
				left: x - width / 2,
				top: y - height / 2,
				width,
				height,
				rotation,
				delay: i * 0.06,
			});
		}

		return path;
	}

	// Linear interpolation helper
	const lerp = (a, b, t) => a + (b - a) * t;

	// Simple easing function
	const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

	if (!isAnimating || movers.length === 0) return null;

	const clipPaths = getClipPathAnimation(batch);

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
							zIndex: 1500 + mover.id, // High enough to be visible, but still behind panel (z-2000)
							overflow: "hidden",
							rotate: mover.rotation,
						}}
						initial={{
							opacity: 0,
							clipPath: clipPaths.initial,
						}}
						animate={{
							opacity: [0, 0.9, 0.9, 0],
							clipPath: [
								clipPaths.initial,
								clipPaths.animate,
								clipPaths.animate,
								clipPaths.exit,
							],
						}}
						transition={{
							times: [0, 0.2, 0.7, 1],
							duration: 1,
							delay: mover.delay,
							ease: "easeInOut",
						}}>
						<img
							src={imgSrc || "/placeholder.svg"}
							alt={`Animation frame ${mover.id}`}
							className={`w-full h-full object-cover ${
								batch === "fourth" ? "filter contrast-200" : ""
							}`}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

export default AnimationFrames;
