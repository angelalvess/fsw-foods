'use client'

import { SearchIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

import { FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'

export const Search = () => {
  const [search, setSearch] = useState<string>('')
  const router = useRouter()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!search) {
      return
    }

    router.push(`/restaurants?search=${search}`)
  }

  return (
    <form className="flex gap-2" onSubmit={handleSearchSubmit}>
      <Input
        value={search}
        onChange={handleSearch}
        placeholder="Buscar restaurantes"
        className="border-none "
      />

      <Button size="icon" type="submit">
        <SearchIcon size={24} />
      </Button>
    </form>
  )
}
