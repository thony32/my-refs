/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react"
import ReactFlow, { Controls, Background, MiniMap, applyNodeChanges, OnNodesChange, Node, NodeTypes } from "reactflow"
import "../../App.css"
import { handleDragOver, ResizableNodeSelected } from "../../utils"
import { useVideoFunctions } from "../../hooks"
import { ContextMenu, Gifs } from "../../components"

const nodeTypes: NodeTypes = {
  ResizableNodeSelected,
}

// Define the Canvas component
const Canvas: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  const { videoRef, fastForward, fastBackward } = useVideoFunctions()
  const [show, setShow] = useState(false)
  const [points, setPoints] = useState({ x: 0, y: 0 })

  useEffect(() => {
    window.addEventListener("click", () => {
      setShow(false)
    })
    return () =>
      window.removeEventListener("click", () => {
        setShow(false)
      })
  }, [])

  // NOTE: Handle Context Menu event listener
  const showContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setShow(true)
    console.log(event.pageX, event.pageY)
    setPoints({ x: event.pageX, y: event.pageY })
  }

  // TODO: Handle Copy Nodes

  // TODO: Handle Paste Nodes

  // ? Function to handle drop of media files into React Flow
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = event.dataTransfer.files

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (file.type.startsWith("image/")) {
        // NOTE: Handle image file as a new node
        const imageUrl = URL.createObjectURL(file)
        const newNode = {
          id: `IMG-${Date.now()}`,
          type: "ResizableNodeSelected",
          data: { label: <img src={imageUrl} /> },
          position: { x: event.clientX - 100, y: event.clientY - 100 },
        }
        setNodes((prevNodes: any) => [...prevNodes, newNode])
      } else if (file.type.startsWith("video/")) {
        // FIXME: Handle video file as a new node
        const videoUrl = URL.createObjectURL(file)
        const newNode = {
          id: `VIDEO-${Date.now()}`,
          type: "ResizableNodeSelected",
          data: {
            label: (
              <div className="flex justify-center items-center">
                <video ref={videoRef} controls autoPlay loop className="w-full h-full">
                  <source src={videoUrl} type={file.type} />
                </video>
                <button className="btn btn-primary btn-sm" onClick={fastBackward}>
                  -10
                </button>
                <button className="btn btn-primary btn-sm" onClick={fastForward}>
                  +10
                </button>
              </div>
            ),
          },
          position: { x: event.clientX - 100, y: event.clientY - 100 },
        }
        setNodes((prevNodes: any) => [...prevNodes, newNode])
      } else if (file.type === "image/gif") {
        // NOTE: Handle gif file as a new node
        const gifUrl = URL.createObjectURL(file)
        const newNode = {
          id: `GIF-${Date.now()}`,
          type: "ResizableNodeSelected",
          data: { label: <Gifs src={gifUrl} /> },
          position: { x: event.clientX - 100, y: event.clientY - 100 },
        }
        setNodes((prevNodes: any) => [...prevNodes, newNode])
      }
    }
  }

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [])

  return (
    <div className="h-full col-span-12">
      <div className="h-full flex flex-col justify-center items-center" onDrop={handleDrop} onDragOver={handleDragOver} onContextMenu={showContextMenu}>
        {/* React Flow component */}
        <ReactFlow nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onConnect={() => {}} fitView /* snapToGrid={true} snapGrid={[5, 5]}*/>
          <Background color="hsl(var(--b1))" />
          <Controls className="bg-gray-300" />
          <MiniMap className="scale-[.65] lg:scale-[.80] 2xl:scale-100 bg-neutral-content" pannable={true} />
        </ReactFlow>
        {show && <ContextMenu top={points.y} left={points.x} />}
      </div>
    </div>
  )
}

export default Canvas
