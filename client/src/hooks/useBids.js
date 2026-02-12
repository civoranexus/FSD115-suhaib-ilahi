import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBidsAsync,
  fetchListingBidsAsync,
  fetchMyBidsAsync,
  placeBidAsync,
  withdrawBidAsync,
} from '../redux/slices/bidsSlice'

export const useBids = () => {
  const dispatch = useDispatch()
  const bids = useSelector(state => state.bids)

  const fetchBids = (page, limit) => {
    return dispatch(fetchBidsAsync({ page, limit }))
  }

  const fetchListingBids = (listingId) => {
    return dispatch(fetchListingBidsAsync(listingId))
  }

  const fetchMyBids = (page, limit) => {
    return dispatch(fetchMyBidsAsync({ page, limit }))
  }

  const placeBid = (listingId, amount) => {
    return dispatch(placeBidAsync({ listingId, amount }))
  }

  const withdrawBid = (bidId) => {
    return dispatch(withdrawBidAsync(bidId))
  }

  return {
    items: bids.items,
    listingBids: bids.listingBids,
    myBids: bids.myBids,
    loading: bids.loading,
    error: bids.error,
    pagination: bids.pagination,
    fetchBids,
    fetchListingBids,
    fetchMyBids,
    placeBid,
    withdrawBid,
  }
}
