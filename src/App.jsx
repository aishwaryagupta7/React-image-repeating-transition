import "./App.css";
import Card from "./components/Card";
import data from "./data/data.json";
import ImagePanel from "./components/ImagePanel";
import AnimationFrames from "./components/AnimationFrames";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function App() {
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [sourceRect, setSourceRect] = useState(null);
	const [targetRect, setTargetRect] = useState(null);
	const panelRef = useRef(null);

	const handleCardClick = (idx, cardElement) => {
		if (isAnimating) return;

		if (cardElement) {
			const imageElement = cardElement.querySelector("img");
			const rect = imageElement
				? imageElement.getBoundingClientRect()
				: cardElement.getBoundingClientRect();
			setSourceRect(rect);
		}

		setIsAnimating(true);
		setSelectedIndex(idx);
	};

	const closePanel = () => {
		setSelectedIndex(null);
		setIsAnimating(false);
		setSourceRect(null);
		setTargetRect(null);
	};

	const handleAnimationComplete = () => {
		setIsAnimating(false);
	};

	useEffect(() => {
		if (selectedIndex !== null && panelRef.current) {
			const imageElement = panelRef.current.querySelector("img");
			const rect = imageElement
				? imageElement.getBoundingClientRect()
				: panelRef.current.getBoundingClientRect();

			if (rect.width > 0 && rect.height > 0) {
				setTargetRect(rect);
			}
		}
	}, [selectedIndex, panelRef.current]);

	const isLeftSide = selectedIndex !== null && selectedIndex % 8 >= 4;

	return (
		<div className="min-h-screen bg-white text-black p-5">
			<h2 className="text-3xl font-bold mb-10">SHANE WEBER</h2>

			<AnimatePresence>
				{selectedIndex === null && (
					<motion.div
						className="grid grid-cols-8 gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}>
						{data.map((item, idx) => (
							<Card
								key={item.id}
								imgSrc={item.imgSrc}
								title={item.title}
								id={item.id}
								index={idx}
								onClick={handleCardClick}
							/>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{selectedIndex !== null && (
					<div ref={panelRef}>
						<ImagePanel
							imgSrc={data[selectedIndex].imgSrc}
							isLeft={isLeftSide}
							title={data[selectedIndex].title}
							id={data[selectedIndex].id}
							onClose={closePanel}
						/>
					</div>
				)}
			</AnimatePresence>

			<AnimationFrames
				isAnimating={isAnimating}
				sourceRect={sourceRect}
				targetRect={targetRect}
				imgSrc={selectedIndex !== null ? data[selectedIndex].imgSrc : ""}
				onAnimationComplete={handleAnimationComplete}
				isLeft={isLeftSide}
			/>
		</div>
	);
}

export default App;
