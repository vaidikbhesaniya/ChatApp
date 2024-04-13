import { getUser } from "@/actions/user";
import logo from "@/app/favicon.ico";
import profile from "@/assets/profile.png";
import Chat from "@/components/Chat";
import ChatUser from "@/components/ChatUser";
import FontStore from "@/store/fontStore";
import Image from "next/image";

export default async function Page() {
  const user = await getUser();

  return (
    <div className="w-[100%] h-screen text-[#F2F2F2] flex">
      <div className="w-[100%] lg:w-[30%] lg:h-screen border-[#CCC] border-b-[1px] lg:border-b-[0] lg:border-r-[1px]">
        <div className="w-full flex gap-2 items-center justify-between px-[10px] py-[15px] bg-gray-600">
          <div className="flex items-center gap-[1rem]">
            <Image src={logo} alt="logo" className="w-[3rem] h-[3rem] rounded-full" />
            <span className={`text-[1rem] ${FontStore.getState().creamCake} text-[1.6rem] leading-[1.7rem]`}>gather.io</span>
          </div>
          <Image src={profile} alt="profile" className="w-[3rem] h-[3rem] rounded-full" />
        </div>
        <div className="w-full flex">
          <ChatUser
            email="patel@gmail.com"
            lastMessage="Hey, how are you?"
            lastMessageTime="12:00"
          />
        </div>
      </div>
      <Chat/>
    </div>
  )
}
