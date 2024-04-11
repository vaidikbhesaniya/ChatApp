import React from 'react'
import email from "@/assets/email.png"
import password from "@/assets/password.png"
import Image from 'next/image';

interface AuthInputProps {
  type: "password" | "email";
  placeholder: string;
  value: string;
  setValue: (prevState: string) => void;
  name: string
}

export default function AuthInput({ type, placeholder, value, setValue, name }: AuthInputProps): React.ReactNode {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function focusInput(): void {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div
      className={`rounded-[10px] inputContainer m-0`}
      onClick={focusInput}
    >
      <label
        htmlFor={name}
        className='flex gap-2 items-center border-[2px] border-[#2F2F2F] rounded-[10px] p-[1rem] bg-[#F2F2F2]'
      >
        <Image
          src={type === "email" ? email : password} alt={type}
          className='h-[1.4rem] w-[1.4rem]'
        />
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required
          className='bg-transparent outline-none text-[1.3rem] authInput'
          id={name}
          name={name}
          autoComplete='off'
        />
      </label>
    </div>
  )
}
