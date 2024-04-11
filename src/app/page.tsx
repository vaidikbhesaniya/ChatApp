import Link from "next/link";
import React from "react"

export default function Page(): React.ReactNode {
  return (
    <div>
      <Link href="/register">
        Register
      </Link>
      <Link href="/login">
        Login
      </Link>
    </div>
  )
}
