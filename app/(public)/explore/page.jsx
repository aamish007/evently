"use client"
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const ExplorePage = () => {
    const data=useQuery(api.events.g)
  return (
    <div>ExplorePage</div>
  )
}

export default ExplorePage