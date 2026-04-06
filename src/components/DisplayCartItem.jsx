import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'

const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice, totalQty, guestCart, loadGuestCart } = useGlobalContext()
    const cartItem  = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    // Get cart items - either logged in user cart or guest cart
    const displayCart = user._id ? cartItem : guestCart

    const redirectToCheckoutPage = ()=>{
        navigate("/checkout")
        if(close){
            close()
        }
    }

    // Render cart item
    const renderCartItems = () => {
        if (!displayCart || displayCart.length === 0) return null
        
        return displayCart.map((item, index) => {
            const product = item.productId
            return (
                <div key={item?._id || product?._id || index + "cartItemDisplay"} className='flex w-full gap-4'>
                    <div className='w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded'>
                        <img
                            src={product?.image?.[0] || product?.image}
                            className='object-scale-down'
                            alt={product?.name}
                        />
                    </div>
                    <div className='w-full max-w-sm text-xs'>
                        <p className='text-xs text-ellipsis line-clamp-2'>{product?.name}</p>
                        <p className='text-neutral-400'>{product?.unit}</p>
                        <p className='font-semibold'>
                            {DisplayPriceInRupees(pricewithDiscount(product?.price, product?.discount))}
                        </p>
                    </div>
                    <div>
                        <AddToCartButton data={product}/>
                    </div>
                </div>
            )
        })
    }

  return (
    <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
        <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
            <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
                <h2 className='font-semibold'>Cart</h2>
                <button onClick={close}>
                    <IoClose size={25}/>
                </button>
            </div>

            <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
                {/***display items */}
                {
                    displayCart && displayCart.length > 0 ? (
                        <>
                            <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                                    <p>Your total savings</p>
                                    <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice )}</p>
                            </div>
                            <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                                    {renderCartItems()}
                            </div>
                            <div className='bg-white p-4'>
                                <h3 className='font-semibold'>Bill details</h3>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p>Items total</p>
                                    <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                                </div>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p>Quntity total</p>
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
                        </>
                    ) : (
                        <div className='bg-white flex flex-col justify-center items-center'>
                            <img
                                src={imageEmpty}
                                className='w-full h-full object-scale-down' 
                            />
                            <Link onClick={close} to={"/"} className='block bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-white rounded-lg font-semibold mt-4 transition-colors'>Shop Now</Link>
                        </div>
                    )
                }
                
            </div>

            {
                displayCart && displayCart.length > 0 && (
                    <div className='p-2'>
                        <div className='bg-amber-500 text-white px-4 font-bold text-base py-4 static bottom-3 rounded flex items-center gap-4 justify-between'>
                            <div>
                                {DisplayPriceInRupees(totalPrice)}
                            </div>
                            <button onClick={redirectToCheckoutPage} className='flex items-center gap-1'>
                                Proceed
                                <span><FaCaretRight/></span>
                            </button>
                        </div>
                    </div>
                )
            }
            
        </div>
    </section>
  )
}

export default DisplayCartItem
