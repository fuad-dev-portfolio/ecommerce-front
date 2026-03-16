import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder, guestCart, loadGuestCart } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState("0")
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  // Use guest cart if user is not logged in
  const displayCart = user._id ? cartItemsList : guestCart

  const [isGuestMode, setIsGuestMode] = useState(!user._id)
  const [guestInfo, setGuestInfo] = useState({
    guestName: '',
    mobile: '',
    address_line: '',
    city: '',
    state: '',
    country: 'Bangladesh',
    pincode: ''
  })

  const handleGuestInputChange = (e) => {
    const { name, value } = e.target
    setGuestInfo(prev => ({ ...prev, [name]: value }))
  }

  const isGuestFormValid = () => {
    return guestInfo.guestName && 
           guestInfo.mobile && 
           guestInfo.address_line && 
           guestInfo.city && 
           guestInfo.state && 
           guestInfo.pincode
  }

  const handleGuestCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.guestCheckout,
        data: {
          guestName: guestInfo.guestName,
          mobile: guestInfo.mobile,
          address_line: guestInfo.address_line,
          city: guestInfo.city,
          state: guestInfo.state,
          country: guestInfo.country,
          pincode: guestInfo.pincode,
          list_items: displayCart,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
          paymentMethod: 'cod'
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        // Clear guest cart after successful order
        if (!user._id) {
          localStorage.removeItem('guestCart')
          loadGuestCart()
        }
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order",
            isGuest: true,
            orderId: responseData.data?.orderId
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleCashOnDelivery = async () => {
      try {
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : displayCart,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success', {
                state : {
                  text : "Order"
                }
              })
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {user._id && !isGuestMode ? (
            <>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Choose your address</h3>
                <button 
                  onClick={() => setIsGuestMode(true)} 
                  className='text-sm text-blue-600 hover:underline'
                >
                  Or checkout as guest
                </button>
              </div>
              <div className='bg-white p-2 grid gap-4'>
                {
                  addressList.map((address, index) => {
                    return (
                      <label htmlFor={"address" + index} className={!address.status && "hidden"}>
                        <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                          <div>
                            <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectAddress(e.target.value)} name='address' />
                          </div>
                          <div>
                            <p>{address.address_line}</p>
                            <p>{address.city}</p>
                            <p>{address.state}</p>
                            <p>{address.country} - {address.pincode}</p>
                            <p>{address.mobile}</p>
                          </div>
                        </div>
                      </label>
                    )
                  })
                }
                <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                  Add address
                </div>
              </div>
            </>
          ) : (
            <div className='bg-white p-4 rounded'>
              <h3 className='text-lg font-semibold mb-4'>Delivery Information</h3>
              <div className='grid gap-4'>
                <div>
                  <label className='text-sm font-medium'>Full Name *</label>
                  <input
                    type='text'
                    name='guestName'
                    value={guestInfo.guestName}
                    onChange={handleGuestInputChange}
                    placeholder='Enter your full name'
                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Mobile Number *</label>
                  <input
                    type='text'
                    name='mobile'
                    value={guestInfo.mobile}
                    onChange={handleGuestInputChange}
                    placeholder='Enter your mobile number'
                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Mobile number is your main identity</p>
                </div>
                <div>
                  <label className='text-sm font-medium'>Address *</label>
                  <textarea
                    name='address_line'
                    value={guestInfo.address_line}
                    onChange={handleGuestInputChange}
                    placeholder='Enter your full address'
                    rows={2}
                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium'>City *</label>
                    <input
                      type='text'
                      name='city'
                      value={guestInfo.city}
                      onChange={handleGuestInputChange}
                      placeholder='City'
                      className='w-full p-2 border rounded outline-none focus:border-primary-200'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>State/Division *</label>
                    <input
                      type='text'
                      name='state'
                      value={guestInfo.state}
                      onChange={handleGuestInputChange}
                      placeholder='State/Division'
                      className='w-full p-2 border rounded outline-none focus:border-primary-200'
                    />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium'>Country *</label>
                    <input
                      type='text'
                      name='country'
                      value={guestInfo.country}
                      onChange={handleGuestInputChange}
                      className='w-full p-2 border rounded outline-none focus:border-primary-200'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Pincode/Zip *</label>
                    <input
                      type='text'
                      name='pincode'
                      value={guestInfo.pincode}
                      onChange={handleGuestInputChange}
                      placeholder='Pincode'
                      className='w-full p-2 border rounded outline-none focus:border-primary-200'
                    />
                  </div>
                </div>
                {isGuestMode && (
                  <button 
                    onClick={() => setIsGuestMode(false)}
                    className='text-sm text-blue-600 hover:underline'
                  >
                    I have an account, login first
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>
          <h3 className='text-lg font-semibold'>Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quantity total</p>
              <p className='flex items-center gap-2'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p className='flex items-center gap-2'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p >Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            {user._id && !isGuestMode ? (
              <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>Cash on Delivery</button>
            ) : (
              <>
                <button 
                  disabled={!isGuestFormValid()}
                  className={`py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed`} 
                  onClick={handleGuestCashOnDelivery}
                >
                  Cash on Delivery
                </button>
                {!user._id && (
                  <div className='text-center text-sm text-gray-500'>
                    <p>Or</p>
                    <button 
                      onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                      className='text-blue-600 hover:underline'
                    >
                      Login to your account
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>


      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
