import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaBox, FaShippingFast, FaCheckCircle, FaClock, FaTimes, FaSearch, FaHome } from 'react-icons/fa'

const TrackOrder = () => {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = searchParams.get('orderId')
    if (id) {
      setOrderId(id)
      fetchOrder(id)
    }
  }, [searchParams])

  const fetchOrder = async (id) => {
    if (!id || !id.trim()) return
    
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const response = await Axios({
        ...SummaryApi.trackOrder,
        url: `${SummaryApi.trackOrder.url}?orderId=${id.trim()}`
      })
      if (response.data.success) {
        setOrder(response.data.data)
      } else {
        setError('Order not found. Please check your order ID.')
      }
    } catch (err) {
      setError('Order not found. Please check your order ID.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchOrder(orderId)
  }

  const formatDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="text-green-600" />
      case 'Shipped':
        return <FaShippingFast className="text-blue-600" />
      case 'Processing':
        return <FaClock className="text-orange-600" />
      case 'Cancelled':
        return <FaTimes className="text-red-600" />
      default:
        return <FaBox className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700'
      case 'Shipped':
        return 'bg-blue-100 text-blue-700'
      case 'Processing':
        return 'bg-orange-100 text-orange-700'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressSteps = (status) => {
    const steps = ['Processing', 'Shipped', 'Delivered']
    const currentIndex = steps.indexOf(status)
    
    return steps.map((step, index) => ({
      label: step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }))
  }

  return (
    <div className='p-4 max-w-2xl mx-auto'>
      <div className='bg-white shadow-md p-3 font-semibold mb-4'>
        <h1 className='text-xl'>Track Order</h1>
        <p className='text-sm text-gray-500'>Enter your order ID to track your order</p>
      </div>

      <div className='bg-white shadow-md p-4 mb-4'>
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <input
            type='text'
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder='Enter Order ID (e.g., ORD-abc123...)'
            className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-200'
          />
          <button 
            type='submit'
            disabled={loading}
            className='px-4 py-2 bg-primary-200 hover:bg-primary-300 text-white rounded-lg font-medium flex items-center gap-2'
          >
            <FaSearch size={16} />
            Track
          </button>
        </form>
      </div>

      {loading && (
        <div className='text-center p-8'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary-200 mx-auto'></div>
          <p className='mt-2 text-gray-500'>Searching for your order...</p>
        </div>
      )}

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg'>
          <p>{error}</p>
        </div>
      )}

      {order && (
        <div className='bg-white rounded-lg shadow-md border overflow-hidden'>
          <div className='p-4 border-b bg-gray-50'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-bold text-lg'>Order No : {order.orderId}</p>
                <p className='text-sm text-gray-500'>
                  Ordered on: {formatDate(order.createdAt)}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(order.order_status || 'Pending')}`}>
                {getStatusIcon(order.order_status || 'Pending')}
                <span className='font-semibold text-sm'>{order.order_status || 'Pending'}</span>
              </div>
            </div>
          </div>

          <div className='p-4 border-b'>
            <h3 className='font-semibold mb-3'>Order Progress</h3>
            <div className='flex items-center justify-between relative'>
              <div className='absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10'></div>
              {getProgressSteps(order.order_status || 'Pending').map((step, index) => (
                <div key={index} className='flex flex-col items-center bg-white px-2'>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? (
                      step.current ? getStatusIcon(step.label === 'Delivered' ? 'Delivered' : step.label === 'Shipped' ? 'Shipped' : 'Processing') : 
                      <FaCheckCircle size={14} />
                    ) : (
                      <span className='text-xs'>{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${step.completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='flex gap-4 items-center p-4 border-b'>
            {order.productId?.image?.[0] ? (
              <img
                src={order.productId.image[0]}
                alt={order.productId.name}
                className='w-20 h-20 object-cover rounded'
              />
            ) : (
              <div className='w-20 h-20 bg-gray-200 rounded flex items-center justify-center'>
                <FaBox className='text-gray-400' size={24} />
              </div>
            )}
            <div className='flex-1'>
              <p className='font-medium'>{order.productId?.name || 'Product'}</p>
              <p className='font-bold text-lg mt-1'>tk{order.totalAmt?.toLocaleString()}</p>
            </div>
          </div>

          <div className='p-4 border-b'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-gray-500'>Payment Status</p>
                <p className='font-semibold'>{order.payment_status || 'N/A'}</p>
              </div>
              <div>
                <p className='text-gray-500'>Expected Delivery</p>
                <p className='font-semibold'>{formatDate(order.delivery_date)}</p>
              </div>
            </div>
          </div>

          {order.delivery_address && (
            <div className='p-4 text-sm'>
              <p className='text-gray-500 mb-1'>Delivery Address</p>
              <p className='font-medium'>
                {order.delivery_address.address_line}, {order.delivery_address.city}, 
                {order.delivery_address.state} - {order.delivery_address.pincode}
              </p>
            </div>
          )}

          <div className='p-4 bg-gray-50'>
            <Link to={'/'} className='flex items-center justify-center gap-2 text-primary-200 hover:text-primary-300 font-medium'>
              <FaHome size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackOrder
