"use client";
import { useEffect, useState } from "react";
import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { Button } from "@/components/ui/button";
import { useUserSelection } from "@/hooks/use-changes";

function CustomContextMenu() {
	const editor = useEditor();
	const [selectedShapesText, setSelectedShapesText] = useState<string>("");
	const { setUserSelection } = useUserSelection();

	useEffect(() => {
		if (!editor) return;

		const checkSelection = () => {
			const selectedShapes = editor.getSelectedShapes();
			if (selectedShapes.length === 0) return null;

			const shapeContents = selectedShapes.map((shape) => {
				let textContent = "";

				if (shape.type === "text" || shape.type === "geo") {
					const richTextContent = (shape.props as any)?.richText?.content;
					if (richTextContent) {
						textContent = richTextContent
							.map(
								(c: any) => c?.content?.map((c: any) => c.text).join("") || "",
							)
							.join(" ");
					}
				} else if (shape.type === "note") {
					textContent = (shape.props as any)?.text || "";
				}

				return {
					id: shape.id,
					type: shape.type,
					text: textContent,
				};
			});

			const shapesWithText = shapeContents.filter(
				(shape) => shape.text.trim() !== "",
			);

			if (shapesWithText.length > 0) {
				setSelectedShapesText(
					shapesWithText.map((shape) => shape.text).join(" "),
				);
			} else {
				const shapeTypes = selectedShapes.map((s) => s.type).join(", ");
				setSelectedShapesText(
					`Selected ${selectedShapes.length} shape(s) of type(s): ${shapeTypes}. None contain text.`,
				);
			}
		};

		checkSelection();

		const unsubscribe = editor.store.listen(() => {
			checkSelection();
		});

		return () => {
			unsubscribe();
		};
	}, [editor]);

	const selectedShapes = editor?.getSelectedShapes() || [];
	if (selectedShapes.length === 0) return null;

	const selectionBounds = editor?.getSelectionRotatedPageBounds();
	if (!selectionBounds) return null;

	const viewportPoint = editor.pageToViewport(selectionBounds.point);

	const handlePassToAI = () => {
		setUserSelection({
			content: selectedShapesText,
			needsAI: true,
		});
	};

	return (
		<div
			style={{
				position: "absolute",
				pointerEvents: "all",
				top: viewportPoint.y - 42,
				left: viewportPoint.x,
				width: selectionBounds.width * editor.getZoomLevel(),
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 1000,
			}}
			onPointerDown={(e) => e.stopPropagation()}
		>
			<div
				style={{
					borderRadius: 8,
					display: "flex",
					boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)",
					background: "var(--color-panel)",
					padding: "4px",
					gap: "4px",
					alignItems: "center",
				}}
			>
				<Button
					type="button"
					className="cursor-pointer"
					variant={"ghost"}
					onClick={handlePassToAI}
				>
					Answer to AI
				</Button>
			</div>
		</div>
	);
}

export const Whiteboard = ({ bookingId }: { bookingId: string }) => {
	return (
		<div className="w-full h-full">
			<Tldraw
				inferDarkMode
				components={{
					MenuPanel: null,
					InFrontOfTheCanvas: CustomContextMenu,
					ZoomMenu: null,
				}}
				persistenceKey={`tldraw-whiteboard-${bookingId}`}
			/>
		</div>
	);
};
