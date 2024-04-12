"use client"

import AuthInput from '@/components/AuthInput';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Forgot() {
  const [email, setEmail] = React.useState('');
  const router = useRouter();

  async function sendMail(e: React.FormEvent) {
    e.preventDefault();

    const response = await axios.post('/api/sendMail', { email });
    if (response.status === 200) {
      setEmail('');
      router.push("/verify");
    }
  }

  return (
    <div className='text-[#2F2F2F] lg:h-screen lg:w-screen lg:flex lg:justify-center lg:items-center  authBackground'>
      <div className="authContainer lg:w-[45%]">
        <span className='text-center capitalize text-[1.8rem] lg:text-[1.3rem] font-bold'>Forgot your password?</span>
        <form
          className='flex flex-col items-center gap-[1.5rem] lg:gap-[1rem] w-[90%] lg:w-[100%]'
          onSubmit={sendMail}
        >
          <span className='text-center'>That&lsquo;s no fun. Enter your email and we&lsquo;ll send you instructions to reset your password.</span>
          <AuthInput
            type="email"
            placeholder='Email'
            value={email}
            setValue={(e) => setEmail(e)}
            name='email'
          />
          <button className='button' type="submit">
            EMAIL SOME HELP
          </button>
          <span className='text-center'>Remember to check your spam folder if you can&lsquo;t find the message.</span>
        </form>
      </div>
    </div>
  )
}
