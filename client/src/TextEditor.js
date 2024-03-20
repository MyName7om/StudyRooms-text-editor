import React, { useCallback, useEffect, useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

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
  const {id: documentId} = useParams()
  const [socket, setSocket] = useState()
  const [ quill, setQuill] = useState()
  console.log(documentId)

 useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])


  useEffect(() => {
    if (socket == null || quill == null) return 

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit("get-document", documentId)
  }, [socket, quill, documentId])

 

  useEffect(() => {
    const handler =  (delta) => {
      quill.updateContents(delta)
    }
    if (socket == null || quill == null) return 
    socket.on('receive-changes', handler)

    return () => {
      quill.off('receive-changes', handler)
    }
  }, [socket, quill]) 

  useEffect(() => {
    if (socket == null || quill == null) return 

    const handler =  (delta, oldDelta, source) => {
      if (source !== 'user') return 
      socket.emit("send-changes", delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill]) 

  const stop_many_toolbars = useCallback((wrapper) => {
    if (wrapper == null) return
    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {theme: "snow", modules: { toolbar: TOOLBAR_COMMANDS}})
    q.disable()
    q.setText('Loading...')
    setQuill(q)
  }, [])
  
    return <div className="paper" ref={stop_many_toolbars}></div>
}
