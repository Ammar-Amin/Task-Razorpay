import React, { useState } from 'react'
import { GetRazorKey, OrderPage, VerifyOtp } from './components'

const App = () => {
  const [token, setToken] = useState(null);
  const [razorKey, setRazorKey] = useState(null);
  const [payStatus, setPayStatus] = useState(false)

  return (
    <main className='w-full max-w-7xl mx-auto min-h-screen px-3 py-5 md:py-8'>
      <h1 className='text-3xl md:text-5xl text-center py-3 mb-5 md:mb-8'>Razor Payment Gateway</h1>
      {
        !token
          ? (<VerifyOtp setToken={setToken} />)
          : !razorKey
            ? (<GetRazorKey token={token} setRazorKey={setRazorKey} />)
            : !payStatus
              ? (<OrderPage token={token} razorKey={razorKey} setPayStatus={setPayStatus} />)
              : <h1 className='text-green-500 text-center my-20 text-3xl md:text-5xl'>Your Payment has Successfully Completed.</h1>
      }
    </main>
  )
}

export default App
