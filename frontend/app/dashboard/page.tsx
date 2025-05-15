'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHome from '@/app/components/DashboardHome'

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