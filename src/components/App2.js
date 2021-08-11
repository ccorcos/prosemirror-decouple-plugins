import { Schema } from "prosemirror-model"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { keymap } from "prosemirror-keymap"
import { toggleMark } from "prosemirror-commands"

// ========================================================
// Schema
// ========================================================

const schema = new Schema({
	nodes: {
		doc: { content: "block+" },
		paragraph: {
			content: "inline*",
			group: "block",
			parseDOM: [{ tag: "p" }],
			toDOM() {
				return ["p", 0]
			},
		},
		text: { group: "inline" },
	},
	marks: {
		bold: {
			parseDOM: [{ tag: "strong" }],
			toDOM() {
				return ["strong", 0]
			},
		},
	},
})

const plugins = [keymap({ "Mod-b": toggleMark(schema.marks.bold) })]

const emptyDoc = schema.nodeFromJSON({
	type: "doc",
	content: [{ type: "paragraph", content: [] }],
})

// ========================================================
// State
// ========================================================

// Suppose we model our entire app with decoupled state and actions, similar to Prosemirror.
const initialAppState = {
	counter: 0,
	editorState: EditorState.create({ doc: emptyDoc, plugins }),
}

function appReducer(state, action) {
	switch (action.type) {
		case "edit-prosemirror": {
			return {
				...state,
				editorState: state.editorState.apply(action.tr),
			}
		}
		case "increment": {
			return {
				...state,
				counter: state.counter + 1,
			}
		}
	}
}

// ========================================================
// Effects
// ========================================================

// We can model effects as their own state machine, similar to Prosemirror plugins.
const prosemirrorEffect = (renderNode) => ({
	init(app) {
		const view = new EditorView(renderNode, {
			state: app.state.editorState,
			dispatchTransaction(tr) {
				app.dispatch({ type: "edit-prosemirror", tr })
			},
		})
		return view
	},
	update(app, view) {
		view.updateState(app.state.editorState)
		return view
	},
	destroy(app, view) {
		view.destroy()
	},
})

const counterEffect = (renderNode) => ({
	init(app) {
		renderNode.innerText = `Count: ${app.state.counter}`
	},
	update(app) {
		renderNode.innerText = `Count: ${app.state.counter}`
	},
	destroy(app) {},
})

// ========================================================
// View
// ========================================================

// Lets boot this thing up.
class AppView {
	constructor(initialState, reducer, effects) {
		this.state = initialState
		this.reducer = reducer
		this.effects = effects.map((effect) => ({
			effect,
			state: effect.init(this),
		}))
	}

	dispatch(action) {
		this.state = appReducer(this.state, action)
		this.effects = this.effects.map(({ effect, state }) => {
			return { effect, state: effect.update(this, state) }
		})
	}

	destroy() {
		this.effects.forEach(({ effect }) => effect.destroy())
	}
}

// How to do this?
// We can add to EditorView handleKeyDown prop to solve this accute problem,
// but what about a plugin that requires app in the view().
const counterPlugin = (app) => {
	return keymap({
		"mod-]": () => app.dispatch({ type: "increment" }),
	})
}

export function startup() {
	const counterDiv = document.createElement("div")
	document.body.appendChild(counterDiv)

	const prosemirrorDiv = document.createElement("div")
	document.body.appendChild(prosemirrorDiv)

	const appView = new AppView(initialAppState, appReducer, [
		prosemirrorEffect(prosemirrorDiv),
		counterEffect(counterDiv),
	])
}
