import { useState, useEffect } from 'react'
import { useListings } from '../../hooks/useListings'
import { useFilters } from '../../hooks/useFilters'
import { useSearch } from '../../hooks/useSearch'
import { formatCurrency, formatAuctionTime } from '../../utils/formatters'
import { Link } from 'react-router-dom'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import Loading from '../../components/Loading'
import { FiSearch, FiFilter } from 'react-icons/fi'

const Listings = () => {
  const { fetchListings, items, loading, pagination } = useListings()
  const { query, setQuery, searchListings, addToRecent } = useSearch()
  const {
    category, setCategory,
    priceRange, setPriceRange,
    sortBy, setSortBy,
  } = useFilters()
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const filters = {
      category: category || undefined,
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined,
      sortBy: sortBy || 'newest',
    }
    fetchListings(currentPage, 12, filters)
  }, [currentPage, category, priceRange, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      addToRecent(query)
      searchListings(query)
      setCurrentPage(1)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container-section">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search auctions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary">
            <FiSearch className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <FiFilter className="w-5 h-5" />
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 shadow-md sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            <div className="space-y-4">
              <Select
                label="Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setCurrentPage(1)
                }}
                options={[
                  { label: 'All Categories', value: '' },
                  { label: 'Electronics', value: 'electronics' },
                  { label: 'Art', value: 'art' },
                  { label: 'Antiques', value: 'antiques' },
                  { label: 'Jewelry', value: 'jewelry' },
                  { label: 'Collectibles', value: 'collectibles' },
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>

              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                options={[
                  { label: 'Newest', value: 'newest' },
                  { label: 'Ending Soon', value: 'ending-soon' },
                  { label: 'Lowest Price', value: 'price-asc' },
                  { label: 'Highest Price', value: 'price-desc' },
                  { label: 'Most Popular', value: 'popular' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loading />
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No auctions found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map(item => (
                  <Link key={item._id} to={`/listings/${item._id}`}>
                    <Card hover>
                      <div className="mb-4 bg-gray-200 rounded-lg h-40 overflow-hidden">
                        <img
                          src={item.images?.[0]?.url || 'https://via.placeholder.com/300x200'}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-truncate mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm text-truncate-2 mb-4">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Current Bid</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(item.currentBid)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Time Left</p>
                          <p className="text-sm font-medium text-orange-600">{formatAuctionTime(item.endDate)}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {pagination.total > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(pagination.total / 12)}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Listings
