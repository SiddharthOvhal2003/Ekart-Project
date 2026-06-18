import { ChartColumnBig, FolderPlus, LayoutDashboard, PackagePlus, PackageSearch, SquareUser, Users } from 'lucide-react'
import { LiaCommentSolid } from "react-icons/lia";
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaEdit, FaRegEdit } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className='hidden  fixed md:block border-r dark:bg-gray-800 bg-pink-50 border-pink-200 z-10 w-[300px] p-10 space-y-2 h-screen '>
      <div className='text-center pt-10 px-3 space-y-2'>
        <NavLink to='/dashboard/sales' className={({ isActive }) => `text-xl  ${isActive ? "bg-pink-600 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-ful`}>
          <LayoutDashboard/>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to='/dashboard/add-product' className={({ isActive }) => `text-xl  ${isActive ? "bg-pink-600 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-ful`}>
          <PackagePlus/>
          <span>Add Product</span>
        </NavLink>
        <NavLink to='/dashboard/product' className={({ isActive }) => `text-xl  ${isActive ? "bg-pink-600 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-ful`}>
          <PackageSearch/>
          <span>Products</span>
        </NavLink>
        <NavLink to='/dashboard/users' className={({ isActive }) => `text-xl  ${isActive ? "bg-pink-600 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-ful`}>
          <Users/>
          <span>Users</span>
        </NavLink>
        <NavLink to='/dashboard/orders' className={({ isActive }) => `text-xl  ${isActive ? "bg-pink-600 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-ful`}>
          <FaRegEdit/>
          <span>Orders</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar