import Sidebar from '@/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className="flex h-screen ">
      <div className='w-full flex gap-x-4 p-10'>
        <Sidebar />
        <div className="flex-1 p-6 bg-gray rounded-xl">
          <h1 className="text-2xl font-bold mb-4"> Main Page</h1>
        </div>
      </div>
    </div>
  )
}



export default page