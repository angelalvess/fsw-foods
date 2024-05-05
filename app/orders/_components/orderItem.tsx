'use client'

import { Card, CardContent } from '@/app/_components/ui/card'
import { OrderStatus, Prisma } from '@prisma/client'
import React, { useContext } from 'react'
import Link from 'next/link'

import { Button } from '@/app/_components/ui/button'
import { ChevronRightIcon } from 'lucide-react'
import { Avatar, AvatarImage } from '@/app/_components/ui/avatar'
import { Separator } from '@/app/_components/ui/separator'
import { formatCurrency } from '@/app/_helpers/price'
import { useRouter } from 'next/navigation'
import { CartContext } from '@/app/_context/cart'

interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      restaurant: true
      products: {
        include: {
          product: true
        }
      }
    }
  }>
}

const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pendente'
    case OrderStatus.CONFIRMED:
      return 'Confirmado'
    case OrderStatus.CANCELED:
      return 'Cancelado'
    case OrderStatus.DELIVERING:
      return 'A caminho'
    case OrderStatus.DELIVERED:
      return 'Entregue'
    case OrderStatus.FINISHED:
      return 'Finalizado'
    default:
      return ''
  }
}

const OrderItem = ({ order }: OrderItemProps) => {
  const { addProductToCart } = useContext(CartContext)

  const router = useRouter()

  const handleRedoOrderClick = () => {
    for (const orderProduct of order.products) {
      addProductToCart({
        product: {
          ...orderProduct.product,
          restaurant: order.restaurant,
        },
        quantity: orderProduct.quantity,
      })
    }

    router.push(`/restaurants/${order.restaurantId}`)
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div
          className={`w-fit rounded-full bg-[#EEEEEE] px-2 py-1 text-muted-foreground ${order.status !== OrderStatus.DELIVERED && 'bg-green-600 text-white'}`}
        >
          <span className="block text-xs font-semibold">
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 ">
              <AvatarImage
                src={order.restaurant.imageUrl}
                alt={order.restaurant.name}
              />
            </Avatar>

            <span className=" text-sm font-semibold">
              {order.restaurant.name}
            </span>
          </div>

          <Button
            variant="link"
            size="icon"
            className="h-5 w-5 text-black"
            asChild
          >
            <Link href={`/restaurants/${order.restaurantId}`}>
              <ChevronRightIcon />
            </Link>
          </Button>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        <div className="space-y-2">
          {order.products.map((product) => (
            <div key={product.id} className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground">
                <span className="block text-xs text-white">
                  {product.quantity}
                </span>
              </div>
              <span className="block text-xs text-muted-foreground">
                {product.product.name}
              </span>
            </div>
          ))}
        </div>

        <div className="py-3">
          <Separator />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm">{formatCurrency(Number(order.totalPrice))}</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary"
            disabled={order.status !== OrderStatus.DELIVERED}
            onClick={handleRedoOrderClick}
          >
            Refazer pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderItem
