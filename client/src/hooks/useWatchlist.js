import { useDispatch, useSelector } from 'react-redux'
import {
  fetchWatchlistAsync,
  addToWatchlistAsync,
  removeFromWatchlistAsync,
} from '../redux/slices/watchlistSlice'

export const useWatchlist = () => {
  const dispatch = useDispatch()
  const watchlist = useSelector(state => state.watchlist)

  const fetchWatchlist = () => {
    return dispatch(fetchWatchlistAsync())
  }

  const addToWatchlist = (listingId) => {
    return dispatch(addToWatchlistAsync(listingId))
  }

  const removeFromWatchlist = (listingId) => {
    return dispatch(removeFromWatchlistAsync(listingId))
  }

  const isInWatchlist = (listingId) => {
    return watchlist.items.some(item => item._id === listingId)
  }

  return {
    items: watchlist.items,
    loading: watchlist.loading,
    error: watchlist.error,
    total: watchlist.total,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  }
}
