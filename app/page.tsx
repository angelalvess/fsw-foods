import CategoryList from './_components/categoryList'
import Header from './_components/header'
import { Search } from './_components/search'

const Home = () => {
  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>

      <CategoryList />
    </>
  )
}

export default Home
