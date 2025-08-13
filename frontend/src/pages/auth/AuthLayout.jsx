

import { Outlet } from 'react-router-dom'


export const AuthLayout = () => {
  return (
    <div className="flex justify-center h-[100vh]">
        <div className="sm:w-[448px] w-[100%] px-10 pt-20">
            <Outlet />
            <div className="text-center text-gray-500 mt-5">
                Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
            </div>
        </div>
    </div>
  )
}
