"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Verify() {
  const [inputOtp, setInputOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const refs: React.RefObject<HTMLInputElement>[] = Array.from({ length: 6 }).map(() => React.createRef());
  const router = useRouter()

  function handleOtpInputChange(e: React.ChangeEvent<HTMLInputElement>, index: number): void {
    const newOtp: string[] = inputOtp.split('');
    newOtp[index] = e.target.value;
    setInputOtp(newOtp.join(''));

    if (e.target.value && index < 5) {
      refs[index + 1].current?.focus();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>, index: number): void {
    if (event.key === 'Backspace' && !inputOtp[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  useEffect(() => {
    const intervalId: NodeJS.Timeout = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  async function handleVerify() {
    const response = await axios.post('/api/verifyMail', { otp: inputOtp })
    console.log(response);

    if (response.data.status === 200) {
      router.push('/')
    }
  }

  return (
    <div className='text-[#2F2F2F] lg:h-screen lg:w-screen lg:flex lg:justify-center lg:items-center authBackground'>
      <div className="authContainer lg:w-[45%]">
        <span className='text-center text-[#fab005] uppercase text-[1.5rem] lg:text-[0.8rem] tracking-[3px] font-semibold'>OTP VERIFICATION</span>
        <span className='w-[90%] lg:w-full text-center text-[1.3rem] lg:text-[1.2rem] font-semibold'>One Time Password (OTP) has been sent via mail to you email</span>
        <div className='grid grid-cols-6 gap-2'>
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              className="w-[3rem] h-[3rem] lg:w-[4rem] lg:h-[4rem] bg-transparent border-[1px] border-[#BBB] text-center rounded-[10px] outline-[1px] outline-[#2F2F2F] text-[1.4rem] lg:text-[1.7rem]"
              type="text"
              maxLength={1}
              value={inputOtp[index] || ''}
              onChange={(e) => handleOtpInputChange(e, index)}
              ref={refs[index]}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoFocus={index === 0}
              required
            />
          ))}
        </div>
        <div className="self-end">
          {timer > 0 ? (
            <span>Resend OTP in {timer} seconds</span>
          ) : (
            <span className='text-[#287ac3] hover:text-[#2aa3ff] cursor-pointer'>Resend OTP</span>
          )}
        </div>
        <button className='button' onClick={handleVerify}>Verify</button>
      </div>
    </div>
  )
}
