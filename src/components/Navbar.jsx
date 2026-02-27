import React, { useState } from "react"
import { MdClose, MdMenu } from "react-icons/md"
import SideMenu from "./SideMenu"

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false)

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors lg:hidden"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <MdClose className="text-2xl" />
          ) : (
            <MdMenu className="text-2xl" />
          )}
        </button>
      </div>

      <h2 className="text-2xl font-extrabold tracking-wide 
bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 
bg-clip-text text-transparent 
drop-shadow-sm 
hover:scale-105 transition-all duration-300 cursor-default">
        My Tracker
      </h2>

      {openSideMenu && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="relative z-50 w-72 h-full bg-white shadow-xl">
            <button
              className="absolute top-4 right-4 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
              onClick={() => setOpenSideMenu(false)}
            >
              <MdClose className="text-2xl" />
            </button>

            <div className="pt-16">
              <SideMenu activeMenu={activeMenu} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
