import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className='w-full h-[100vh] flex'>
      <div className='w-[15%] 2xl:w-[10%] h-full bg-gray-200'>
        <Sidebar />
      </div>
      <div className='w-[85%] 2xl:w-[90%] h-[100vh]'>
        <Outlet />
      </div>
    </div>
  )
}