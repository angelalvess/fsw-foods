import { Category } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

interface CategoryItemProps {
  category: Category
}

const CategoryItem = async ({ category }: CategoryItemProps) => {
  return (
    <div className="flex items-center gap-3 rounded-full px-4 py-3 shadow-md">
      <Image
        src={category.imageUrl}
        alt={category.name}
        height={30}
        width={30}
      />

      <span className="ml-2 text-sm font-semibold">{category.name}</span>
    </div>
  )
}

export default CategoryItem
