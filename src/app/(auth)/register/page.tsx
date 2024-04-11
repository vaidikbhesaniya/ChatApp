"use client"

import AuthInput from '@/components/AuthInput';
import axios from 'axios'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Register(): React.ReactNode {
  const [user, setUser] = React.useState({
    email: '',
    password: ''
  })
  const router = useRouter();

  async function registerUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const reponse = await axios.post('/api/sendMail', user);
      console.log(reponse);

      if (reponse.status === 200) {
        setUser({
          email: '',
          password: ''
        })
        router.push('/verify');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='authBackground h-screen w-full flex items-center justify-center text-[#2F2F2F]'>
      <div className="bg-[#F2F2F2] h-screen flex flex-col w-full items-center justify-center lg:h-auto gap-[1rem]">
        <span className='text-center text-[#fab005] uppercase text-[1.5rem] tracking-[3px] font-semibold'>Register</span>
        <span className='text-center capitalize text-[2rem] font-bold'>Create Your Account</span>
        <form className='flex flex-col gap-[1.5rem]' onSubmit={registerUser}>
          <AuthInput
            type="email"
            placeholder='Email'
            value={user.email}
            setValue={(e) => setUser({ ...user, email: e })}
            name='email'
          />
          <AuthInput
            value={user.password}
            setValue={(e) => setUser({ ...user, password: e })}
            type="password"
            placeholder='Password'
            name='password'
          />
          <button
            type="submit"
            className='bg-[#ffd438] p-[0.5rem] rounded-[10px] text-[#2F2F2F] uppercase font-semibold tracking-[3px] text-[1.5rem] border-[2px] border-[#2F2F2F] shadow-[0_5px_0_0_#2F2F2F] hover:bg-[#fab005] outline-none mb-[10px]'
          >Register
          </button>
        </form>
        <span>Don&lsquo;t have an account? <Link href="/login" className='text-[#287ac3] hover:text-[#2aa3ff]'>Register Now</Link></span>
      </div>
    </div>
  )
}
