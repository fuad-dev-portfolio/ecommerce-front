import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-gray-300 mt-auto'>
            <div className='container mx-auto px-4 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    <div>
                        <h3 className='text-white text-lg font-semibold mb-4'>Ghor2ghor</h3>
                        <p className='text-sm text-gray-400 mb-4'>Your trusted online grocery delivery service. Fresh products delivered to your doorstep.</p>
                        <div className='flex gap-3'>
                            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all'>
                                <FaFacebook />
                            </a>
                            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all'>
                                <FaInstagram />
                            </a>
                            <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all'>
                                <FaLinkedin />
                            </a>
                            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all'>
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className='text-white text-lg font-semibold mb-4'>Quick Links</h3>
                        <ul className='space-y-2'>
                            <li><Link to="/" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Home</Link></li>
                            <li><Link to="/search" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Products</Link></li>
                            <li><Link to="/cart" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Cart</Link></li>
                            <li><Link to="/login" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Login</Link></li>
                            <li><Link to="/register" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Register</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-white text-lg font-semibold mb-4'>Categories</h3>
                        <ul className='space-y-2'>
                            <li><Link to="/category/Atta, Rice & Dal" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Atta, Rice & Dal</Link></li>
                            <li><Link to="/category/Dairy, Bread & Eggs" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Dairy, Bread & Eggs</Link></li>
                            <li><Link to="/category/Tea, Coffe & Health Drink" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Tea & Coffee</Link></li>
                            <li><Link to="/category/Snacks & Munchies" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Snacks & Munchies</Link></li>
                            <li><Link to="/category/Cold Drinks & Juices" className='text-sm text-gray-400 hover:text-green-400 transition-colors'>Cold Drinks</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-white text-lg font-semibold mb-4'>Contact Us</h3>
                        <ul className='space-y-3'>
                            <li className='flex items-center gap-2 text-sm text-gray-400'>
                                <FaMapMarkerAlt className='text-green-500' />
                                <span>14/D,Kaderabad Housing, Mohammadpur,Dhaka</span>
                            </li>
                            <li className='flex items-center gap-2 text-sm text-gray-400'>
                                <FaPhoneAlt className='text-green-500' />
                                <span>+8801521545813</span>
                            </li>
                            <li className='flex items-center gap-2 text-sm text-gray-400'>
                                <FaEnvelope className='text-green-500' />
                                <span>gram2ghor00@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4'>
                    <p className='text-sm text-gray-500'>© 2026 Ghor2ghor. All Rights Reserved.</p>
                    <p className='text-sm text-gray-500'>Developed by <span className='text-green-500 font-medium'>Abdullah Al Fuad</span></p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
