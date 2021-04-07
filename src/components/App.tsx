import React, { useLayoutEffect, useRef } from "react"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
	nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
	marks: schema.spec.marks,
})

export function App() {
	const ref = useRef<HTMLDivElement | null>(null)
	useLayoutEffect(() => {
		const view = new EditorView(ref.current!, {
			state: EditorState.create({
				doc: mySchema.nodeFromJSON({
					type: "doc",
					content: [{ type: "paragraph", content: [] }],
				}),
				plugins: exampleSetup({ schema: mySchema }),
			}),
		})
	}, [])
	return (
		<div id="editor" ref={ref}>
			hello
		</div>
	)
}
