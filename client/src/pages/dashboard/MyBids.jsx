import { useEffect, useState } from 'react'
import { useBids } from '../../hooks/useBids'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import Loading from '../../components/Loading'
import { Link } from 'react-router-dom'

const MyBids = () => {
  const { myBids, loading, fetchMyBids } = useBids()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchMyBids(currentPage, 10)
  }, [currentPage])

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Bids</h1>

      {myBids.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't placed any bids yet</p>
          <Link to="/listings" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse auctions and place your first bid
          </Link>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {myBids.map(bid => (
              <Card key={bid._id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{bid.listing?.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600 mb-2">
                      <span>Your Bid: <strong className="text-blue-600">{formatCurrency(bid.amount)}</strong></span>
                      <span>Placed: {formatDateTime(bid.createdAt)}</span>
                    </div>
                  </div>
                  <Badge variant={bid.isHighest ? 'success' : 'warning'}>
                    {bid.isHighest ? 'Winning' : 'Outbid'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(myBids.length / 10)}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default MyBids
