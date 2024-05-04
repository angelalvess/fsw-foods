import { useContext } from 'react'
import { CartContext } from '../_context/cart'
import CartItem from './cartItem'
import { Card, CardContent } from './ui/card'
import { formatCurrency } from '../_helpers/price'
import { Separator } from './ui/separator'
import { Button } from './ui/button'

const Cart = () => {
  const {
    products,
    calculateSubtotalPrice,
    calculateTotalDiscounts,
    calculateTotalPrice,
  } = useContext(CartContext)

  return (
    <div className="flex h-full flex-col py-5">
      {products.length > 0 ? (
        <>
          <div className="flex-auto space-y-4">
            {products.map((product) => (
              <CartItem key={product.id} cartProduct={product} />
            ))}
          </div>
          <div className="mt-6">
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between text-xs">
                  <span className=" text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(calculateSubtotalPrice)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <span className=" text-muted-foreground">Entrega</span>

                  {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                    <span className="uppercase text-primary"> Grátis</span>
                  ) : (
                    formatCurrency(Number(products?.[0].restaurant.deliveryFee))
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <span className=" text-muted-foreground">Descontos</span>
                  <span> - {formatCurrency(calculateTotalDiscounts)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button className="mt-6 w-full">Finalizar Pedido</Button>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="font-medium">Seu sacola está vazia</p>
        </div>
      )}
    </div>
  )
}

export default Cart
