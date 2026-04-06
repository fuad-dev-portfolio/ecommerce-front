import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import { getGuestCart, clearGuestCart } from "../utils/guestCart";
import { setWishlist, clearWishlist } from "../store/wishlistSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
     const dispatch = useDispatch()
     const [totalPrice,setTotalPrice] = useState(0)
     const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
    const [totalQty,setTotalQty] = useState(0)
    const [guestCart, setGuestCart] = useState([])
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state?.user)

    const fetchCartItem = async()=>{
        try {
          const response = await Axios({
            ...SummaryApi.getCartItem
          })
          const { data : responseData } = response
  
          if(responseData.success){
            dispatch(handleAddItemCart(responseData.data))
          }
  
        } catch (error) {
          console.log(error)
        }
    }

    // Load guest cart from localStorage
    const loadGuestCart = () => {
        const cart = getGuestCart()
        setGuestCart(cart)
    }

    const updateCartItem = async(id,qty)=>{
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              fetchCartItem()
              return responseData
          }
      } catch (error) {
        AxiosToastError(error)
        return error
      }
    }
    const deleteCartItem = async(cartId)=>{
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
      }
    }

    useEffect(()=>{
      if (!user._id) {
        // Guest user - load from localStorage
        loadGuestCart()
      }
    }, [user._id])

    // Listen for guest cart updates
    useEffect(() => {
        const handleGuestCartUpdate = () => {
            loadGuestCart()
        }
        window.addEventListener('guestCartUpdated', handleGuestCartUpdate)
        return () => window.removeEventListener('guestCartUpdated', handleGuestCartUpdate)
    }, [])

    useEffect(()=>{
      // Calculate cart total - combine user cart and guest cart
      const userCartTotal = cartItem.reduce((preve,curr)=>{
          return preve + curr.quantity
      },0)
      
      const guestCartTotal = guestCart.reduce((preve,curr)=>{
          return preve + (curr.quantity || 1)
      },0)

      setTotalQty(userCartTotal + guestCartTotal)
      
      const tPrice = cartItem.reduce((preve,curr)=>{
          const priceAfterDiscount = pricewithDiscount(curr?.productId?.price,curr?.productId?.discount)
          return preve + (priceAfterDiscount * curr.quantity)
      },0)

      const guestCartPrice = guestCart.reduce((preve,curr)=>{
          const price = curr.productId?.price || 0
          const discount = curr.productId?.discount || 0
          const priceAfterDiscount = price - (price * discount / 100)
          return preve + (priceAfterDiscount * (curr.quantity || 1))
      },0)

      setTotalPrice(tPrice + guestCartPrice)

      const notDiscountPrice = cartItem.reduce((preve,curr)=>{
        return preve + (curr?.productId?.price * curr.quantity)
      },0)

      const guestNotDiscountPrice = guestCart.reduce((preve,curr)=>{
          return preve + ((curr.productId?.price || 0) * (curr.quantity || 1))
      },0)

      setNotDiscountTotalPrice(notDiscountPrice + guestNotDiscountPrice)
  },[cartItem, guestCart])

    const handleLogoutOut = ()=>{
        localStorage.clear()
        dispatch(handleAddItemCart([]))
        dispatch(clearWishlist())
        setGuestCart([])
    }

    const fetchAddress = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          // AxiosToastError(error)
      }
    }
    const fetchOrder = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getOrderItems,
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }

    const fetchWishlist = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getWishlist
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(setWishlist(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      if(user._id){
        fetchCartItem()
        fetchAddress()
        fetchOrder()
        fetchWishlist()
      } else {
        handleLogoutOut()
      }
    },[user])
    
    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder,
            fetchWishlist,
            guestCart,
            loadGuestCart
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
