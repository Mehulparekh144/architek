"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Tldraw, useEditor, type TLRecord, type TLShape } from "tldraw";
import "tldraw/tldraw.css";
import { useWhiteboard } from "@/hooks/use-whiteboard";
import { diffWordsWithSpace } from "diff";

export const Whiteboard = () => {
	return (
		<div className="w-full h-full">
			<Tldraw
				inferDarkMode
				components={{
					MenuPanel: null,
					ZoomMenu: null,
				}}
				persistenceKey="tldraw-whiteboard"
			>
				<TLDrawContext />
			</Tldraw>
		</div>
	);
};

const TLDrawContext = () => {
	const editor = useEditor();
	const { shapes, setShapes } = useWhiteboard();
	const previousTextRef = useRef<string>("");
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!editor) return;

		const handleChange = () => {
			// Clear the previous timeout if it exists
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			// Set a new timeout
			debounceTimeoutRef.current = setTimeout(() => {
				const allShapes = editor.store
					.allRecords()
					.filter(
						(record: TLRecord) => record.typeName === "shape",
					) as TLShape[];

				const shapesWithText = allShapes
					.filter(
						(shape: any) =>
							shape.props?.richText?.content?.filter(
								(c: any) => c?.content?.length > 0,
							).length > 0,
					)
					?.map((shape: any) => {
						const text = shape.props.richText.content
							.map((c: any) => c?.content?.map((c: any) => c.text).join(""))
							.join(" ");

						return {
							id: shape.id,
							type: shape.type,
							text,
							position: {
								x: shape.x,
								y: shape.y,
							},
						};
					});

				const currentText = shapesWithText.map((shape) => shape.text).join(" ");
				const previousText = previousTextRef.current;

				const changes = getDiff(currentText, previousText);
				if (changes) {
					console.log("changes", changes);
				}

				previousTextRef.current = currentText;
				setShapes(shapesWithText);
			}, 700);
		};

		const unsubscribe = editor.store.listen(handleChange);

		return () => {
			unsubscribe();
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, [editor, setShapes]); // Add setShapes to dependency array if it's stable

	return (
		<Button
			className="absolute h-fit w-fit z-10 bottom-4 left-4"
			onClick={() => {
				console.log("Current Content State:", shapes);
			}}
		>
			Get Shapes & Content
		</Button>
	);
};

const getDiff = (currentText: string, previousText: string) => {
	console.log("currentText:", currentText);
	console.log("previousText:", previousText);

	const diffResult = diffWordsWithSpace(previousText, currentText, {
		ignoreCase: true,
		ignoreWhitespace: false,
	});

	const changes = diffResult
		.filter((part) => part.added || part.removed)
		.map((part) => {
			const prefix = part.added ? "Added: " : part.removed ? "Removed: " : "";
			return prefix + part.value.trim();
		})
		.join("\n");

	return changes;
};
