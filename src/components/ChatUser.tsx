import profile from '@/assets/profile.png'
import Image from 'next/image'
import React from 'react'

interface ChatProps {
  profileUrl?: string;
  email: string;
  lastMessage: string;
  lastMessageTime: string;
}

export default function Chat({ profileUrl, email, lastMessage, lastMessageTime }: ChatProps): React.JSX.Element {
  return (
    <div className='w-full py-[15px] px-[10px] flex items-center  gap-[1rem] border-b-[1px] border-[#888] hover:bg-gray-800 cursor-pointer'>
      <Image src={profileUrl ? profileUrl : profile} alt='profile' className='w-[3rem] h-[3rem] rounded-full' />
      <div className='w-full flex flex-col'>
        <span>{email}</span>
        <div className="flex w-full justify-between text-[0.9rem] text-[#CCC]">
          <span>{lastMessage}</span>
          <span>{lastMessageTime}</span>
        </div>
      </div>
    </div>
  )
}
