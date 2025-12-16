import type { Metadata } from "next"
import { Geist, Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

// Khai báo font Geist
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

// Khai báo font Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Instagram Lite",
  description: "Mạng xã hội chia sẻ ảnh",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      {/* Gán cả 2 font vào body */}
      <body className={`${geist.variable} ${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
