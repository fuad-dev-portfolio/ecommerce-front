import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { setWishlist, removeFromWishlist } from '../store/wishlistSlice'

const Wishlist = () => {
  const user = useSelector(state => state.user)
  const wishlist = useSelector(state => state.wishlist.wishlist)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user._id) {
      navigate('/login')
      return
    }
    fetchWishlist()
  }, [user._id])

  const fetchWishlist = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getWishlist
      })
      if (response.data.success) {
        dispatch(setWishlist(response.data.data))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await Axios({
        ...SummaryApi.removeFromWishlist,
        data: { productId }
      })
      if (response.data.success) {
        toast.success('Removed from wishlist')
        dispatch(removeFromWishlist(productId))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='p-4'>
      <div className='bg-white shadow-md p-3 font-semibold mb-4'>
        <h1 className='text-xl'>My Wishlist</h1>
        <p className='text-sm text-gray-500'>Welcome, {user.name}</p>
      </div>

      {loading ? (
        <div className='text-center p-4'>Loading...</div>
      ) : !wishlist.length ? (
        <NoData />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {wishlist.map((item, index) => (
            <div key={item._id + index} className='bg-white rounded-lg shadow-md border overflow-hidden'>
              <Link to={`/product/${item.productId?._id}`} className='block'>
                {item.productId?.image?.[0] ? (
                  <img
                    src={item.productId.image[0]}
                    alt={item.productId.name}
                    className='w-full h-48 object-cover'
                  />
                ) : (
                  <div className='w-full h-48 bg-gray-200 flex items-center justify-center'>
                    <span className='text-gray-400'>No Image</span>
                  </div>
                )}
              </Link>
              
              <div className='p-3'>
                <Link to={`/product/${item.productId?._id}`} className='block'>
                  <p className='font-medium text-sm line-clamp-2 hover:text-primary-200'>
                    {item.productId?.name || 'Product'}
                  </p>
                </Link>
                
                <div className='flex items-center gap-2 mt-2'>
                  <span className='font-bold text-lg'>
                    {DisplayPriceInRupees(pricewithDiscount(
                      item.productId?.price,
                      item.productId?.discount
                    ))}
                  </span>
                  {item.productId?.discount > 0 && (
                    <span className='text-sm text-gray-500 line-through'>
                      {DisplayPriceInRupees(item.productId?.price)}
                    </span>
                  )}
                </div>

                {item.productId?.discount > 0 && (
                  <span className='text-xs text-green-600 font-medium'>
                    {item.productId.discount}% OFF
                  </span>
                )}

                <button 
                  onClick={() => handleRemoveFromWishlist(item.productId?._id)}
                  className='w-full mt-3 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded text-sm font-medium'
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
