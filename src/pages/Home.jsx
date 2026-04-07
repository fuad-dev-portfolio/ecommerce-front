import banner1 from '../assets/banner1.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { useState, useEffect } from 'react'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const [banner, setBanner] = useState(null)
  const [loadingBanner, setLoadingBanner] = useState(true)
  const [currentLeftIndex, setCurrentLeftIndex] = useState(0)

  useEffect(() => {
    fetchBanner()
  }, [])

  useEffect(() => {
    if (banner?.leftBanners?.length > 1) {
      const interval = setInterval(() => {
        setCurrentLeftIndex(prev => (prev + 1) % banner.leftBanners.length)
      }, 10000)
      return () => clearInterval(interval)
    } else if (banner?.leftBanners?.length === 1) {
      setCurrentLeftIndex(0)
    }
  }, [banner?.leftBanners?.length])

  const fetchBanner = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getBanner
      })
      if (response.data.success) {
        setBanner(response.data.data)
      }
      setLoadingBanner(false)
    } catch (error) {
      AxiosToastError(error)
      setLoadingBanner(false)
    }
  }

  const handleBannerClick = (url) => {
    if (url) {
      navigate(url)
    }
  }

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })

    if (subcategory) {
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
      navigate(url)
    }
  }

  return (
    <section className='bg-gray-50 min-h-screen'>
      {/* Banner Section */}
      <div className='w-full px-2 md:px-4 py-2 md:py-3'>
        {loadingBanner ? (
          <div className="w-full rounded-lg overflow-hidden bg-gray-200 animate-pulse h-56 md:h-80 lg:h-96"></div>
        ) : banner && (banner.leftBanners?.length > 0 || banner.rightBanner) ? (
          <div className="w-full">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {/* Left Side - Multiple Images Slider with Bullet Points */}
              <div className={`${banner.rightBanner ? 'md:w-2/3' : 'w-full'} relative h-56 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-md w-full`}>
                {banner.leftBanners?.length > 0 ? (
                  <>
                    <div className="absolute inset-0 w-full h-full">
                      {banner.leftBanners.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out transform ${index === currentLeftIndex
                              ? 'opacity-100 translate-x-0'
                              : 'opacity-0 translate-x-full'
                              }`}
                            onClick={() => handleBannerClick(item.url)}
                          >
                            <img
                              src={item.image}
                              className='w-full h-full cursor-pointer'
                              alt={item.name || `Banner ${index + 1}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                    {/* Bullet Points */}
                    {banner.leftBanners.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {banner.leftBanners.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentLeftIndex 
                                ? 'bg-white scale-125' 
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={banner1}
                    className='w-full h-full'
                    alt='banner'
                  />
                )}
              </div>

              {/* Right Side - Single Advertisement Image (Hidden on Mobile) */}
              {banner.rightBanner && (
                <div 
                  className="hidden md:block md:w-1/3 w-full h-56 md:h-80 lg:h-96 cursor-pointer"
                  onClick={() => handleBannerClick(banner.rightBanner.url)}
                >
                  <img
                    src={banner.rightBanner.image}
                    className='w-full h-full rounded-lg shadow-md'
                    alt='Advertisement'
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='w-full rounded-lg overflow-hidden'>
            <img
              src={banner1}
              className='w-full hidden md:block'
              alt='banner'
            />

            <img
              src={bannerMobile}
              className='w-full md:hidden'
              alt='banner'
            />
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className='container mx-auto px-3 py-6'>
        <div className='bg-white rounded-xl shadow-sm p-4 mb-6'>
          <h2 className='text-lg md:text-xl font-bold text-gray-800 mb-4'>Shop by Category</h2>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3 md:gap-4'>
            {loadingCategory ? (
              new Array(10).fill(null).map((c, index) => {
                return (
                  <div key={index + "loadingcategory"} className='bg-gray-100 rounded-lg p-3 grid gap-2 shadow animate-pulse'>
                    <div className='bg-gray-200 h-16 md:h-20 rounded-lg'></div>
                    <div className='bg-gray-200 h-4 w-3/4 rounded mx-auto'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat) => {
                return (
                  <div
                    key={cat._id + "displayCategory"}
                    className='group cursor-pointer'
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md hover:border-amber-200 transition-all duration-200'>
                      <div className='aspect-square mb-2 overflow-hidden rounded-lg'>
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-200'
                        />
                      </div>
                      <p className='text-xs md:text-sm font-medium text-gray-700 text-center truncate'>{cat.name}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Display Category Products */}
      {categoryData?.map((c) => {
        return (
          <CategoryWiseProductDisplay
            key={c?._id + "CategorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        )
      })}

      {/* Empty State */}
      {!loadingCategory && categoryData.length === 0 && (
        <div className='container mx-auto px-4 py-12'>
          <div className='text-center'>
            <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>No Categories Yet</h3>
            <p className='text-gray-500'>Categories will appear here once added by the admin.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Home