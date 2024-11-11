// app/auth/layout.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar/navbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
//   const router = useRouter()

//   useEffect(() => {
//     // Check if user is authenticated
//     const token = localStorage.getItem("authToken")
//     if (!token) {
//       router.push("/")
//     }
//   }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-custom-gray to-custom-blue ">
      {/* Navbar will appear on all auth pages */}
      <Navbar />
      
      {/* Main content area */}
      <main className="max-w-[1600]  mx-auto py-12">
        {children}
      </main>
      
  
    </div>
  )
}