'use client'

import Image from 'next/image'
import { Button } from './ui/button'
import {
  Heart,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ScrollText,
} from 'lucide-react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar'
import { Separator } from './ui/separator'

const Header = () => {
  const { data, status } = useSession()

  const handleSignIn = () => {
    signIn()
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="flex justify-between px-5 pt-6">
      <Link href="/">
        <div className="relative h-[31px] w-[100px]">
          <Image
            src="/logo.png"
            alt="logo FSW Foods"
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <Sheet>
        <SheetTrigger>
          <Button
            size="icon"
            variant="outline"
            className="border-none bg-transparent"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          {status === 'authenticated' ? (
            <>
              <div className="flex justify-between pt-6">
                <div className="flex items-center gap-3 ">
                  <Avatar>
                    <AvatarImage
                      src={data?.user?.image as string | undefined}
                    />
                    <AvatarFallback>
                      {data?.user?.name?.split(' ')[0][0]}
                      {data?.user?.name?.split(' ')[1][0]}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className=" font-semibold">{data?.user?.name}</h3>
                    <span className=" block text-xs text-muted-foreground">
                      {data?.user?.email}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between pt-10">
                <h2 className="font-semibold">Ola, Faça o seu login!</h2>

                <Button onClick={handleSignIn} size="icon">
                  <LogInIcon />
                </Button>
              </div>
            </>
          )}

          <div className="py-6">
            <Separator />
          </div>

          <div className="space-y-2 ">
            <Button className=" w-full justify-start space-x-2 rounded-full">
              <HomeIcon size={16} />
              <span className="block text-sm font-normal">Início</span>
            </Button>
            {status === 'authenticated' && (
              <>
                <Button
                  variant="ghost"
                  className=" w-full justify-start space-x-3 rounded-full "
                  asChild
                >
                  <Link href="/orders">
                    <ScrollText size={16} />
                    <span className="block text-sm font-normal">
                      Meus pedidos
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="  w-full justify-start space-x-3 rounded-full "
                  asChild
                >
                  <Link href="/my-favorite-restaurants">
                    <Heart size={16} />
                    <span className="block text-sm font-normal">
                      Resturantes favoritos
                    </span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="py-6">
            <Separator />
          </div>

          {status === 'authenticated' && (
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="  w-full justify-start space-x-3 rounded-full "
            >
              <LogOutIcon size={16} />
              <span className="block text-sm font-normal">Sair da conta</span>
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Header
