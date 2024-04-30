import React from 'react'
import { db } from '../_lib/prisma'

const CategoryList = async () => {
  const categories = await db.category.findMany({})

  return (
    <>
      {categories.map((category) => (
        <div key={category.id}>
          <h1>{category.name}</h1>
        </div>
      ))}
    </>
  )
}

export default CategoryList
