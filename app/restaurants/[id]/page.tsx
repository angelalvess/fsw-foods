import React from 'react'

interface RestaurantPageProps {
  params: {
    id: string
  }
}

const RestaurantPage = ({ params: { id } }: RestaurantPageProps) => {
  return <div>{id}</div>
}

export default RestaurantPage
