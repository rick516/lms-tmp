"use client";

import {
	EditorState,
	SelectionState,
	convertFromRaw,
	convertToRaw,
} from "draft-js";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

interface EditorProps {
	value: string;
	onChange: (value: string) => void;
}

// Draft.jsのEditorコンポーネントを動的にインポートし、サーバーサイドレンダリングを無効にする
const DraftEditor = dynamic(
	() => import("draft-js").then((mod) => ({ default: mod.Editor })),
	{ ssr: false },
);

export const RichEditor = ({ value, onChange }: EditorProps) => {
	// EditorStateをuseStateで管理
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty(),
	);

	// 選択状態を追跡
	const selectionRef = useRef<SelectionState | null>(null);

	useEffect(() => {
		// valueが空の場合は何もしない
		if (!value) return;

		try {
			const rawContent = JSON.parse(value);
			const contentState = convertFromRaw(rawContent);
			let newEditorState = EditorState.createWithContent(contentState);

			// 選択状態があれば、それを新しいEditorStateに適用する
			if (selectionRef.current) {
				newEditorState = EditorState.forceSelection(newEditorState, selectionRef.current);
			}

			setEditorState(newEditorState);
		} catch (error) {
			console.error("Error parsing JSON value:", error);
			// 不正なJSONの場合、エディタを空の状態で初期化
			setEditorState(EditorState.createEmpty());
		}
	}, [value]);

	const handleEditorChange = (state: EditorState) => {
		const currentContent = state.getCurrentContent();
		// 現在のContentStateが前回のvalueと異なる場合のみ更新
		if (JSON.stringify(currentContent) !== value) {
			selectionRef.current = state.getSelection();
			setEditorState(state);
			onChange(JSON.stringify(convertToRaw(currentContent)));
		}
	};

	return (
		<div className="bg-white w-auto h-64 overflow-auto">
			<DraftEditor editorState={editorState} onChange={handleEditorChange} />
		</div>
	);
};