"use client";
import { useCallback, useEffect, useState } from "react";
import {
	getSnapshot,
	type Editor,
	type StoreSnapshot,
	Tldraw,
	type TLRecord,
	type TLStore,
	type TLEditorSnapshot,
} from "tldraw";
import "tldraw/tldraw.css";

export const Whiteboard = () => {
	const [editor, setEditor] = useState<Editor | null>(null);
	const [drawingData, setDrawingData] = useState<TLEditorSnapshot | null>(null);

	const handleMount = useCallback((editor: Editor) => {
		setEditor(editor);

		const snapshot = getSnapshot(editor.store);
		setDrawingData(snapshot);

		console.log(editor);
	}, []);

	useEffect(() => {
		console.log(drawingData);
	}, [drawingData]);

	return (
		<div className="w-full h-full">
			<Tldraw
				inferDarkMode
				persistenceKey="tldraw-whiteboard"
				onMount={handleMount}
			/>
		</div>
	);
};
