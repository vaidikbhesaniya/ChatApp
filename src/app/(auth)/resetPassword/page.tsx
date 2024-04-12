"use client"

import AuthInput from '@/components/AuthInput';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ResetPassword(): React.ReactNode {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const router = useRouter();

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    const response = await axios.post('/api/resetPassword', { password: newPassword });
    console.log(response);


    if (response.status === 200) {
      setNewPassword('');
      setConfirmPassword('');
      router.push("/login");
    }

  }

  return (
    <div className='text-[#2F2F2F] lg:h-screen lg:w-screen lg:flex lg:justify-center lg:items-center authBackground'>
      <div className="authContainer">
        <span className='text-center text-[#fab005] uppercase text-[1.5rem] lg:text-[0.8rem] tracking-[3px] font-semibold'>reset password</span>
        <form className='flex flex-col items-center gap-[1.5rem] lg:gap-[1rem] w-[90%] lg:w-[100%]' onSubmit={resetPassword}>
          <AuthInput
            type="password"
            placeholder='New Password'
            value={newPassword}
            setValue={(e) => setNewPassword(e)}
            name='newPassword'
          />
          <AuthInput
            type="password"
            placeholder='Confirm Password'
            value={confirmPassword}
            setValue={(e) => setConfirmPassword(e)}
            name='confirmPassword'
          />
          <button className="button" type='submit'>
            Reset password
          </button>
        </form>
      </div>
    </div>
  )
}
