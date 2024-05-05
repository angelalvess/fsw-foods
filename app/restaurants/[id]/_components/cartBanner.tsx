"use client";

import Cart from "@/app/_components/cart";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { CartContext } from "@/app/_context/cart";
import { formatCurrency } from "@/app/_helpers/price";
import { Restaurant } from "@prisma/client";
import { useContext, useState } from "react";

interface CartBannerProps {
  restaurant: Pick<Restaurant, "id">;
}

const CartBanner = ({ restaurant }: CartBannerProps) => {
  const { products } = useContext(CartContext);
  const { calculateTotalPrice } = useContext(CartContext);
  const { calculateTotalQuantity } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleIsCartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };

  const restaurantHasProductsOnCart = products.some(
    (product) => product.restaurantId === restaurant.id,
  );

  if (!restaurantHasProductsOnCart) {
    return null;
  }
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-solid border-muted bg-white p-5 pt-3 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-muted-foreground">
            Total sem entrega
          </span>
          <h3 className="font-semibold">
            {formatCurrency(calculateTotalPrice)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              / {calculateTotalQuantity}{" "}
              {calculateTotalQuantity > 1 ? "itens" : "item"}
            </span>
          </h3>
        </div>

        <Button onClick={handleIsCartOpen}>Ver Sacola</Button>

        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetContent className="w-[90vw]">
            <SheetHeader>
              <SheetTitle>Sacola</SheetTitle>
            </SheetHeader>
            <Cart setIsOpen={setIsCartOpen} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CartBanner;
