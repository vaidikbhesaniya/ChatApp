import profile from "@/assets/profile.png";
import send from "@/assets/send.png";
import settings from "@/assets/settings.png";
import Image from 'next/image';
import React from 'react';

interface chat {
  message: string;
  time: string;
  isUserSender: boolean;
}

export default function Chat(): React.ReactNode {
  return (
    <div className="hidden lg:flex h-screen w-[70%] flex-col justify-between">
      <div className="w-full flex justify-between items-center border-b-[1px] border-[#CCC] px-[10px] py-[15px]">
        <div className="flex gap-2 items-center">
          <Image src={profile} alt="profile" className="w-[3rem] h-[3rem] rounded-full" />
          <span>patel@gmail.com</span>
        </div>
        <Image src={settings} alt="settings" className="w-[2rem] h-[2rem] rounded-full cursor-pointer" />
      </div>
      <div className="w-full h-full flex flex-col-reverse p-[1rem] overflow-y-auto scrollbar">
        <div className={`w-full text-[#F2F2F2] flex flex-col gap-2`}>
          <span className={`self-end bg-slate-600 p-[10px] rounded-[5px] flex justify-between items-center gap-[0.5rem]`}>
            <span>Hello</span>
            <span className="text-[0.7rem] mt-[1rem] text-[#DDD]">12:01</span>
          </span>
          <span className={`self-start bg-blue-700 p-[10px] rounded-[5px] flex justify-between items-center gap-[0.5rem]`}>
            <span>Woohoo</span>
            <span className="text-[0.7rem] mt-[1rem] text-[#DDD]">12:01</span>
          </span>
        </div>
      </div>
      <div className="px-[10px] flex bg-gray-600 items-center cursor-pointer">
        <input
          type="text"
          className="w-full px-[10px] py-[15px] bg-transparent outline-none border-none"
          placeholder="Type a message"
        />
        <Image src={send} alt="send" className="w-[1.5rem] h-[1.5rem]" />
      </div>
    </div>
  )
}
