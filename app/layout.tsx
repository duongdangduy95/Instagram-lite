import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

// Phiên bản dùng fallback font
const geist = { variable: "--font-geist-sans" }
const inter = { variable: "--font-inter" }

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
      {/* Gán cả 2 font vào body, dùng font hệ thống */}
      <body
        className={`${geist.variable} ${inter.variable} antialiased`}
        style={{
          fontFamily: "var(--font-geist-sans), var(--font-inter), system-ui, -apple-system, sans-serif",
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
