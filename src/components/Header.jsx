import { useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import { TbPackage } from "react-icons/tb";
import { BsCart4 } from "react-icons/bs";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const wishlistItems = useSelector(state => state.wishlist.wishlist)
    const { totalPrice, totalQty, guestCart } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Show cart if user has items OR guest has items
    const hasCartItems = user._id ? cartItem[0] : guestCart.length > 0

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }

        navigate("/user")
    }

    const handleWishlistClick = () => {
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/dashboard/wishlist")
    }

    return (
        <header className='h-auto min-h-[64px] md:h-20 w-full shadow-md fixed top-0 z-40 flex flex-col justify-center bg-gradient-to-r bg-[#F5F5F5] border-b'>
            <div className='container mx-auto flex items-center px-3 md:px-4 justify-between w-full gap-2 md:gap-4 py-2 md:py-0 h-16 md:h-full'>

                {/**Mobile Menu Button - ONLY VISIBLE ON MOBILE */}
                <div className='md:hidden flex items-center justify-start flex-1'>
                    <button onClick={() => setIsMobileMenuOpen(true)} className='p-1 text-[#A5D6A7] hover:text-green-100 transition-colors'>
                        <FaBars size={24} />
                    </button>
                </div>

                {/**logo */}
                <div className='flex justify-center md:justify-start flex-shrink-0'>
                    <Link to={"/"} className='block'>
                        <img
                            src={logo}
                            alt='Ghor2ghor'
                            className='h-28 md:h-32 w-auto max-w-[300px] md:max-w-[400px] object-contain'
                        />
                    </Link>
                </div>

                {/**Search */}
                <div className='hidden md:block flex-1 max-w-lg mx-2 lg:mx-4 border-2 border-[#6BAA4E] rounded-lg'>
                    <Search />
                </div>

                {/**login and my cart */}
                <div className='flex items-center gap-2 md:gap-3 flex-1 md:flex-shrink-0 justify-end relative'>

                    {/**Desktop Icons**/}
                    <div className='hidden md:flex items-center gap-4 xl:gap-6'>
                        <Link to={"/track-order"} className='flex items-center gap-1.5 text-[#3F7D3A] hover:text-black-100 text-sm font-medium'>
                            <TbPackage size={18} />
                            <span className='hidden lg:inline'>Track Order</span>
                        </Link>

                        <button
                            onClick={handleWishlistClick}
                            className='flex items-center gap-1.5 md:gap-2 text-[#3F7D3A] hover:text-red-700 transition-colors text-sm font-medium relative'
                        >
                            <FaHeart size={18} className={`${user._id && wishlistItems.length > 0 ? 'text-red-500 relative z-10' : ''}`} />
                            <span className='hidden lg:inline'>Wishlist</span>
                            {user._id && wishlistItems.length > 0 && (
                                <span className='absolute -top-2 -right-2 bg-red-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
                                    {wishlistItems.length}
                                </span>
                            )}
                        </button>
                        {
                            user?._id ? (
                                <div className='relative'>
                                    <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer'>
                                        <p className='text-white font-medium text-sm'>Account</p>
                                        {
                                            openUserMenu ? (
                                                <GoTriangleUp size={16} />
                                            ) : (
                                                <GoTriangleDown size={16} />
                                            )
                                        }
                                    </div>
                                    {
                                        openUserMenu && (
                                            <div className='absolute right-0 top-10'>
                                                <div className='bg-white rounded-lg p-4 min-w-48 shadow-xl border border-gray-100'>
                                                    <UserMenu close={handleCloseUserMenu} />
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <button onClick={redirectToLoginPage} className='text-sm px-2 py-1.5 text-[#3F7D3A] font-medium hover:text-red-500'>Login</button>
                            )
                        }
                    </div>

                    {/**Cart Button (Always visible) */}
                    <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-1.5 md:gap-2 bg-[#A5D6A7] hover:bg-amber-600 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-white font-semibold shadow-md transition-colors text-sm md:text-base relative w-9 h-9 md:w-auto md:h-auto justify-center'>
                        <div className=''>
                            <BsCart4 size={18} />
                        </div>
                        <div className='hidden md:block text-xs md:text-sm'>
                            {
                                hasCartItems ? (
                                    <div className='leading-tight'>
                                        <span>{totalQty}</span> <span className='hidden md:inline'>Items</span>
                                    </div>
                                ) : (
                                    <span>Cart</span>
                                )
                            }
                        </div>
                        {hasCartItems && (
                            <div className='hidden lg:block text-xs'>
                                {DisplayPriceInRupees(totalPrice)}
                            </div>
                        )}

                        {/**Mobile Cart Item Count Badge */}
                        {hasCartItems && (
                            <div className='md:hidden absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold'>
                                {totalQty}
                            </div>
                        )}
                    </button>
                </div>
            </div>



            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }

            {/* Mobile Sidebar Left Drawer */}
            <div className={`fixed inset-0 z-50 transition-opacity bg-black md:hidden ${isMobileMenuOpen ? 'opacity-50 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='p-4 bg-green-500 text-white flex justify-between items-center shadow-sm'>
                    <h2 className='text-base font-semibold tracking-wide'>
                        {user?._id ? `Hello, ${user.name || "User"}` : "Hello there! Please sign in"}
                    </h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className='p-1 hover:text-green-200 transition-colors'>
                        <FaTimes size={22} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col gap-5'>
                    {user?._id ? (
                        <>
                            {/* Embedded User Menu directly into the Sidebar */}
                            <UserMenu close={() => setIsMobileMenuOpen(false)} />
                        </>
                    ) : (
                        <div className='flex flex-col gap-4'>
                            <button onClick={() => { redirectToLoginPage(); setIsMobileMenuOpen(false); }} className='w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-2.5 rounded-lg shadow-sm font-semibold'>
                                Login to continue
                            </button>
                        </div>
                    )}

                    <div className='border-t border-gray-100 my-1'></div>

                    {/* Quick Links inside mobile drawer */}
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-sm text-gray-500 font-medium px-2'>Quick Links</h3>

                        <button onClick={() => { navigate('/track-order'); setIsMobileMenuOpen(false); }} className='flex items-center gap-3 text-gray-700 hover:text-green-600 hover:bg-green-50 px-2 py-2 rounded-lg transition-colors'>
                            <TbPackage size={20} /> <span className='font-medium'>Track Order</span>
                        </button>

                        <button onClick={() => { handleWishlistClick(); setIsMobileMenuOpen(false); }} className='flex items-center justify-between text-gray-700 hover:text-red-500 hover:bg-red-50 px-2 py-2 rounded-lg transition-colors w-full'>
                            <div className='flex items-center gap-3 font-medium'>
                                <FaHeart size={20} className={`${user._id && wishlistItems.length > 0 ? 'text-red-500' : ''}`} />
                                Wishlist
                            </div>
                            {user._id && wishlistItems.length > 0 && (
                                <span className='bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full'>
                                    {wishlistItems.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
