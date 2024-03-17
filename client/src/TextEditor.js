import React, { useCallback, useEffect, useRef } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"

const TOOLBAR_COMMANDS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

export default function TextEditor() {
    const stop_many_toolbars = useCallback((wrapper) => {
        if (wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        new Quill(editor, {theme: "snow", modules: { toolbar: TOOLBAR_COMMANDS}})
    }, [])

    return (
    <div className="paper" ref={stop_many_toolbars}></div>
  )
}
