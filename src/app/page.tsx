import Link from "next/link";

export default async function Page() {
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
