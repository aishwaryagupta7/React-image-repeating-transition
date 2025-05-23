import "./App.css";
import Card from "./components/Card";
import data from "./data/data.json";
import ImagePanel from "./components/ImagePanel";
import AnimationFrames from "./components/AnimationFrames";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function App() {
	const [selectedCard, setSelectedCard] = useState(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [sourceRect, setSourceRect] = useState(null);
	const [targetRect, setTargetRect] = useState(null);
	const panelRef = useRef(null);
	const firstBatch = data.slice(0, 16);
	const secondBatch = data.slice(16, 32);
	const thirdBatch = data.slice(0, 16);
	const fourthBatch = data.slice(16, 32);

	const handleCardClick = (idx, cardElement, batch) => {
		if (isAnimating) return;

		if (cardElement) {
			const imageElement = cardElement.querySelector("img");
			const rect = imageElement
				? imageElement.getBoundingClientRect()
				: cardElement.getBoundingClientRect();
			setSourceRect(rect);
		}

		setIsAnimating(true);
		setSelectedCard({ index: idx, batch });
	};

	const closePanel = () => {
		setSelectedCard(null);
		setIsAnimating(false);
		setSourceRect(null);
		setTargetRect(null);
	};

	const handleAnimationComplete = () => {
		setIsAnimating(false);
	};

	useEffect(() => {
		if (selectedCard && panelRef.current) {
			const imageElement = panelRef.current.querySelector("img");
			const rect = imageElement
				? imageElement.getBoundingClientRect()
				: panelRef.current.getBoundingClientRect();

			if (rect.width > 0 && rect.height > 0) {
				setTargetRect(rect);
			}
		}
	}, [selectedCard]);

	const isLeftSide = selectedCard ? selectedCard.index % 8 >= 4 : false;
	const currentData = selectedCard
		? selectedCard.batch === "first"
			? firstBatch[selectedCard.index]
			: selectedCard.batch === "second"
			? secondBatch[selectedCard.index]
			: selectedCard.batch === "third"
			? thirdBatch[selectedCard.index]
			: fourthBatch[selectedCard.index]
		: null;
	const tilt = selectedCard?.batch === "second" ? true : false;
	return (
		<div className="min-h-screen bg-white text-black p-5">
			<AnimatePresence>
				{!selectedCard && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}>
						<header className="flex justify-between items-center mb-20">
							<h1>Repeating Image Transition</h1>
							<nav>
								<a href="https://tympanus.net/codrops/?p=92571">More info,</a>
								<a href="https://github.com/codrops/RepeatingImageTransition/">
									Code,
								</a>
								<a href="https://tympanus.net/codrops/demos/">All demos</a>
							</nav>
							<nav>
								<a href="https://tympanus.net/codrops/demos/?tag=page-transition">
									Page-transition,
								</a>
								<a href="https://tympanus.net/codrops/demos/?tag=repetition">
									Repetition,
								</a>
								<a href="https://tympanus.net/codrops/demos/?tag=grid">Grid</a>
							</nav>
						</header>
						<div className="flex flex-row justify-between">
							<h2 className="text-7xl font-bold mb-5">SHANE WEBER</h2>
							<p className="flex items-end mb-4 text-xs">
								effect 01: straight linear paths, smooth easing, clean timing,
								minimal rotation.
							</p>
						</div>

						<div className="grid grid-cols-8 gap-2 mb-10">
							{firstBatch.map((item, idx) => (
								<Card
									key={item.id}
									imgSrc={item.imgSrc}
									title={item.title}
									id={item.id}
									index={idx}
									onClick={(idx, el) => handleCardClick(idx, el, "first")}
								/>
							))}
						</div>

						<div className="flex flex-row justify-between">
							<h2 className="text-7xl font-bold mb-5">MANIKA JORGE</h2>
							<p className="flex items-end mb-4 text-xs">
								effect 02: Adjusts mover count, rotation, timing, and animation
								feel.
							</p>
						</div>

						<div className="grid grid-cols-8 gap-2 mb-10">
							{secondBatch.map((item, idx) => (
								<Card
									key={item.id}
									imgSrc={item.imgSrc}
									title={item.title}
									id={item.id}
									index={idx}
									onClick={(idx, el) => handleCardClick(idx, el, "second")}
								/>
							))}
						</div>

						<div className="flex flex-row justify-between">
							<h2 className="text-7xl font-bold mb-5">ANGELA WONG</h2>
							<p className="flex items-end mb-4 text-xs">
								effect 03: Big arcs, smooth start, powerful snap, slow reveal.
							</p>
						</div>

						<div className="grid grid-cols-8 gap-2 mb-10">
							{thirdBatch.map((item, idx) => (
								<Card
									key={item.id}
									imgSrc={item.imgSrc}
									title={item.title}
									id={item.id}
									index={idx}
									onClick={(i, el) => handleCardClick(i, el, "third")}
								/>
							))}
						</div>

						<div className="flex flex-row justify-between">
							<h2 className="text-7xl font-bold mb-5">KAITO NAKAMO</h2>
							<p className="flex items-end mb-4 text-xs">
								effect 04: Quick upward motion with bold blending and smooth
								slow reveal.
							</p>
						</div>
						<div className="grid grid-cols-8 gap-2">
							{fourthBatch.map((item, idx) => (
								<Card
									key={item.id}
									imgSrc={item.imgSrc}
									title={item.title}
									id={item.id}
									index={idx}
									onClick={(idx, el) => handleCardClick(idx, el, "fourth")}
								/>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{selectedCard && (
					<div ref={panelRef}>
						<ImagePanel
							imgSrc={currentData.imgSrc}
							isLeft={isLeftSide}
							title={currentData.title}
							id={currentData.id}
							onClose={closePanel}
							batch={selectedCard?.batch}
						/>
					</div>
				)}
			</AnimatePresence>

			<AnimationFrames
				key={selectedCard?.batch}
				isAnimating={isAnimating}
				sourceRect={sourceRect}
				targetRect={targetRect}
				imgSrc={selectedCard ? currentData.imgSrc : ""}
				onAnimationComplete={handleAnimationComplete}
				isLeft={isLeftSide}
				tilt={selectedCard?.batch === "second"}
				batch={selectedCard?.batch}
			/>
		</div>
	);
}

export default App;
