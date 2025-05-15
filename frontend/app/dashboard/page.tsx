'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardHome from '@/components/DashboardHome'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn: boolean = true
    if (!isLoggedIn) {
      router.replace('/login')
    }
  }, [])

  return (
    <DashboardHome />
  )
}