"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Verify() {
  const [otp, setOtp] = React.useState('')
  const router = useRouter()

  async function handleVerify() {
    const response = await axios.post('/api/verifyMail', { otp })
    console.log(response);

    if (response.data.status === 200) {
      router.push('/')
    }

  }

  return (
    <div>
      <input
        type="number"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder='Enter OTP'
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  )
}
