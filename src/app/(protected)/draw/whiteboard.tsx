"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
	Tldraw,
	useEditor,
	type TLRecord,
	type TLShape,
} from "tldraw";
import "tldraw/tldraw.css";

interface TextShapeData {
	id: string;
	type: string;
	text: string;
	position: {
		x: number;
		y: number;
	};
}

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
	const [shapes, setShapes] = React.useState<TextShapeData[]>([]);

	useEffect(() => {
		if (!editor) return;

		const handleChange = () => {
			const allShapes = editor.store
				.allRecords()
				.filter((record: TLRecord) => record.typeName === "shape") as TLShape[];

			const shapesWithText = allShapes
				.filter(
					(shape: any) =>
						shape.props?.richText?.content?.filter(
							(c: any) => c?.content?.length > 0,
						).length > 0,
				)
				?.map((shape: any) => {
					const text = shape.props.richText.content
						.map((c: any) => c.content.map((c: any) => c.text).join(""))
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

			setShapes(shapesWithText);
		};

		const unsubscribe = editor.store.listen(handleChange);

		return () => unsubscribe();
	}, [editor]);

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
