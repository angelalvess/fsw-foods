import { Category } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

interface CategoryItemProps {
  category: Category
}

const CategoryItem = async ({ category }: CategoryItemProps) => {
  return (
    <Link
      className="flex items-center justify-center gap-3 rounded-full px-4 py-3 shadow-md"
      href={`/categories/${category.id}/products`}
    >
      <Image
        src={category.imageUrl}
        alt={category.name}
        height={30}
        width={30}
      />

      <span className="ml-2 text-sm font-semibold">{category.name}</span>
    </Link>
  )
}

export default CategoryItem
