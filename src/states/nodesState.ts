/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "recoil"

export interface NodeData {
  id: string
  type: string
  data: {
    label: HTMLElement
  }
  position: {
    x: number
    y: number
  }
  selectable: boolean
  selected: boolean
}

export const nodesState = atom<NodeData[]>({
  key: "nodesState",
  default: [],
})
