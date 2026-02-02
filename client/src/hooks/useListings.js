import { useDispatch, useSelector } from 'react-redux'
import {
  fetchListingsAsync,
  fetchListingByIdAsync,
  createListingAsync,
  updateListingAsync,
  deleteListingAsync,
  fetchMyListingsAsync,
} from '../redux/slices/listingsSlice'

export const useListings = () => {
  const dispatch = useDispatch()
  const listings = useSelector(state => state.listings)

  const fetchListings = (page, limit, filters) => {
    return dispatch(fetchListingsAsync({ page, limit, filters }))
  }

  const fetchListingById = (id) => {
    return dispatch(fetchListingByIdAsync(id))
  }

  const createListing = (data) => {
    return dispatch(createListingAsync(data))
  }

  const updateListing = (id, data) => {
    return dispatch(updateListingAsync({ id, data }))
  }

  const deleteListing = (id) => {
    return dispatch(deleteListingAsync(id))
  }

  const fetchMyListings = (page, limit) => {
    return dispatch(fetchMyListingsAsync({ page, limit }))
  }

  return {
    items: listings.items,
    selectedListing: listings.selectedListing,
    loading: listings.loading,
    error: listings.error,
    pagination: listings.pagination,
    hasMore: listings.hasMore,
    fetchListings,
    fetchListingById,
    createListing,
    updateListing,
    deleteListing,
    fetchMyListings,
  }
}
