"use client"

import AuthInput from '@/components/AuthInput';
import axios from 'axios'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import profile from "@/assets/profile.png"

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
    <div className='text-[#2F2F2F] lg:h-screen lg:w-screen lg:flex lg:justify-center lg:items-center authBackground'>
      <div className="authContainer">
        <span className='text-center text-[#fab005] uppercase text-[1.5rem] lg:text-[0.8rem] tracking-[3px] font-semibold'>Register</span>
        <span className='text-center capitalize text-[1.8rem] lg:text-[1.3rem] font-bold'>Create Your Account</span>
        <form className='flex flex-col items-center gap-[1.5rem] lg:gap-[1rem] w-[90%] lg:w-[100%]' onSubmit={registerUser}>
          <Image
            src={profile}
            alt='profile'
            className='h-[6rem] w-[6rem] rounded-full bg-[#2f2f2f]'
            />
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
            className='button'
          >Register
          </button>
        </form>
        <span>Already have an Account? <Link href="/login" className='text-[#287ac3] hover:text-[#2aa3ff]'>Login Now</Link></span>
      </div>
    </div>
  )
}
