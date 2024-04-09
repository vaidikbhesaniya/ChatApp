"use client"

import { registerUser, sendMail } from "@/actions/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  async function sendVerificationMail() {
    const user = {
      email: "priyansh361@gmail.com",
      password: "priyansh361"
    }

    await registerUser(user.email, user.password);
    await axios.post("/api/setCookie", user);
    const response = await sendMail(user.email);
    console.log(response.status);

    if (response.status === 200) {
      router.push("/verify");
      return;
    }
  }

  return (
    <div>
      <button onClick={sendVerificationMail}>Click</button>
    </div>
  )
}
