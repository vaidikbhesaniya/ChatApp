import './globals.css'
import FontStore from '@/store/fontStore'
import siteConfig from "@/config/site-config"
import { Metadata } from 'next'

export const metadata: Metadata = siteConfig

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${FontStore.getState().poppins} bg-[#181818]`}>{children}</body>
    </html>
  )
}
