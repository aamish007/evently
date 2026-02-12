"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { BarLoader } from 'react-spinners'
import { useStoreUser } from '@/hooks/use-store-user'
import { Building, Plus, Ticket } from 'lucide-react'

const Header = () => {
  const { isLoading } = useStoreUser();
  const [mounted, setMounted] = React.useState(false);
  const [showUpgradeModel, setShowUpgradeModel]=useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link href="/" className="flex items-center">
          <Image
            src="/spott.png"
            alt="Spott logo"
            width={500}
            height={500}
            className="h-11 w-auto scale-125"
            priority
          />
        </Link>
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size="sm" onClick={()=>setShowUpgradeModel(true)}>Pricing</Button>
          <Button variant={"ghost"} size="sm" asChild className={"mr-2"}>
            <Link href="explore">Explore</Link>
            </Button>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Button size="sm" asChild className={"flex gap-2 mr-4"}>
            <Link href="/create-event">
            <Plus className='w-4 h-4'/>
            <span className='hidden sm:inline'>Create Event</span>
            </Link>
            </Button>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link label="My Tickets" labelIcon={<Ticket size={16}/>} href='/my-tickets'/>
                <UserButton.Link label="My Events" labelIcon={<Building size={16}/>} href='/my-events'/>
                <UserButton.Action label="manageAccount"/>
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1">
        {mounted && isLoading && (
          <BarLoader width="100%" color="#a855f7" />
        )}
      </div>
    </nav>
  )
}

export default Header
