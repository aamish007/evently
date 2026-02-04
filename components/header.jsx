"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Authenticated, Unauthenticated } from 'convex/react'
import { BarLoader } from 'react-spinners'
import { useStoreUser } from '@/hooks/use-store-user'

const Header = () => {
  const {isLoading}=useStoreUser();
  return (
    <>
                <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href={"/"} className='flex items-center'/>
                <Image
              src="/spott.png"
              alt="Spott logo"
              width={500}
              height={500}
              className="w-full h-11"
              priority
            />
            <div className='flex items-center'>
              <SignedOut>
              <SignInButton mode='modal'>
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            </div>
            </div>
            {/* Mobile Section */}
            {isLoading && (<div className='absolute bottom-0 left-0 w-full'>
              <BarLoader width={"100%"} color='#a855f7'/>
            </div>)}
        </nav>
    </>
  )
}

export default Header