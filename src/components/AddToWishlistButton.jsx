import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice'

const AddToWishlistButton = ({ productData, className = "" }) => {
    const productId = productData?._id || productData;
    const user = useSelector(state => state.user)
    const wishlist = useSelector(state => state.wishlist.wishlist)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user._id && wishlist.length > 0) {
            const exists = wishlist.some(item => {
                const itemProductId = typeof item.productId === 'object' ? item.productId?._id : item.productId;
                return itemProductId === productId;
            })
            setIsInWishlist(exists)
        } else {
            setIsInWishlist(false)
        }
    }, [wishlist, productId, user._id])

    const handleWishlistToggle = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user._id) {
            navigate('/login')
            return
        }

        if (loading) return

        setLoading(true)

        try {
            if (isInWishlist) {
                // Remove from wishlist
                const response = await Axios({
                    ...SummaryApi.removeFromWishlist,
                    data: { productId }
                })

                if (response.data.success) {
                    dispatch(removeFromWishlist(productId))
                    toast.success('Removed from wishlist')
                }
            } else {
                // Add to wishlist
                const response = await Axios({
                    ...SummaryApi.addToWishlist,
                    data: { productId }
                })

                if (response.data.success) {
                    const dispatchedItem = {
                        ...response.data.data,
                        productId: productData
                    };
                    dispatch(addToWishlist(dispatchedItem))
                    toast.success('Added to wishlist')
                } else if (response.data.error) {
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleWishlistToggle}
            disabled={loading}
            className={`
                p-2 rounded-full transition-all duration-200 hover:scale-110
                ${isInWishlist
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isInWishlist ? (
                <FaHeart size={16} className="drop-shadow-sm" />
            ) : (
                <FaRegHeart size={16} />
            )}
        </button>
    )
}

AddToWishlistButton.propTypes = {
    productData: PropTypes.any.isRequired,
    className: PropTypes.string
}

export default AddToWishlistButton
