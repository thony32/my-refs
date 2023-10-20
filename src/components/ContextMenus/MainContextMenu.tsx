import React from "react"
import { MainContextMenuData } from "../../data"
import type { ContextMenuProps } from "../../utils"

const MainContextMenu: React.FC<ContextMenuProps> = ({top, left}) => {

  const containerClasses = `absolute flex flex-col w-[15%] lg:w-[200px] bg-base-300 rounded-sm z-50`
  
  return (
    <div className={containerClasses} style={{top: top, left: left}}>
      {MainContextMenuData.map((menu, index) => {
        return (
          <button className="py-2 px-4 text-xs xl:text-sm hover:bg-base-200 duration-300 rounded-sm flex justify-between" key={index}>
            {menu.label}
            <kbd className="kbd-xs">{menu.key}</kbd>
          </button>
        )
      })}
    </div>
  )
}

export default MainContextMenu