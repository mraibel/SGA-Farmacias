// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn: boolean = false
    if (isLoggedIn) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [])

  return <p>Redirigiendo...</p>
}