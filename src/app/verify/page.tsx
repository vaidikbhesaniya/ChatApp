"use client"

// import { cookies } from 'next/headers';
import { verifyEmail } from '@/actions/auth';
import React, { useState } from 'react';

export default function Verify(): React.ReactNode {
  const [otp, setOtp] = useState<string>("");
  // const token = cookies().get("userDoc")?.value;

  async function verify() {
    console.log(await verifyEmail(otp));
  }

  return (
    <div>
      <input
        type="text"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder='Enter OTP'
      />
      <button type="submit" onClick={verify}>Submit</button>
    </div>
  )
}
