import { useState, useEffect } from 'react'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import UploadImage from '../utils/UploadImage'
import Loading from '../components/Loading'

const BannerManagement = () => {
    const [loadingLeft, setLoadingLeft] = useState(false)
    const [loadingRight, setLoadingRight] = useState(false)
    const [leftBanners, setLeftBanners] = useState([])
    const [rightBanner, setRightBanner] = useState(null)
    const [uploadingRight, setUploadingRight] = useState(false)
    const [uploadingLeft, setUploadingLeft] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [newRightImage, setNewRightImage] = useState(null)
    const [newRightImagePreview, setNewRightImagePreview] = useState(null)
    const [newRightUrl, setNewRightUrl] = useState('')
    const [newRightUploading, setNewRightUploading] = useState(false)

    const [newLeftImage, setNewLeftImage] = useState(null)
    const [newLeftImagePreview, setNewLeftImagePreview] = useState(null)
    const [newLeftUrl, setNewLeftUrl] = useState('')
    const [newLeftUploading, setNewLeftUploading] = useState(false)

    useEffect(() => {
        fetchBanner()
    }, [])

    const fetchBanner = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getBanner
            })
            if (response.data.success) {
                const data = response.data.data
                if (data) {
                    setLeftBanners(data.leftBanners || [])
                    setRightBanner(data.rightBanner)
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setFetching(false)
        }
    }

    const handleRightImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setNewRightImagePreview(URL.createObjectURL(file))
        setNewRightUploading(true)

        try {
            const response = await UploadImage(file)
            if (response.data.success) {
                setNewRightImage(response.data.data.url)
            } else {
                AxiosToastError(response)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setNewRightUploading(false)
        }
    }

    const handleSaveRightBanner = async (e) => {
        e.preventDefault()
        if (!newRightImage || !newRightUrl) {
            alert('Please upload an image and enter URL')
            return
        }
        setLoadingRight(true)

        try {
            const formData = new FormData()
            formData.append('rightBanner', JSON.stringify({
                image: newRightImage,
                url: newRightUrl
            }))

            const response = await Axios({
                ...SummaryApi.createBanner,
                data: formData
            })

            if (response.data.success) {
                await fetchBanner()
                setNewRightImage(null)
                setNewRightImagePreview(null)
                setNewRightUrl('')
                alert("Right banner saved successfully")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoadingRight(false)
        }
    }

    const handleDeleteRightBanner = async () => {
        if (!window.confirm("Are you sure you want to delete this image?")) return

        try {
            const response = await Axios({
                ...SummaryApi.deleteRightBanner
            })
            if (response.data.success) {
                await fetchBanner()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleLeftImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setNewLeftImagePreview(URL.createObjectURL(file))
        setNewLeftUploading(true)

        try {
            const response = await UploadImage(file)
            if (response.data.success) {
                setNewLeftImage(response.data.data.url)
            } else {
                AxiosToastError(response)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setNewLeftUploading(false)
        }
    }

    const handleSaveLeftBanner = async (e) => {
        e.preventDefault()
        if (!newLeftImage || !newLeftUrl) {
            alert('Please upload an image and enter URL')
            return
        }
        setLoadingLeft(true)

        try {
            const newBanner = {
                image: newLeftImage,
                url: newLeftUrl
            }
            const updatedBanners = [...leftBanners, newBanner]

            const formData = new FormData()
            formData.append('leftBanners', JSON.stringify(updatedBanners))

            const response = await Axios({
                ...SummaryApi.createBanner,
                data: formData
            })

            if (response.data.success) {
                await fetchBanner()
                setNewLeftImage(null)
                setNewLeftImagePreview(null)
                setNewLeftUrl('')
                alert("Left banner added successfully")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoadingLeft(false)
        }
    }

    const handleDeleteLeftBanner = async (index) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return

        try {
            const response = await Axios({
                ...SummaryApi.deleteLeftBanner(index)
            })
            if (response.data.success) {
                await fetchBanner()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    if (fetching) {
        return <Loading />
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold">Banner Management</h2>
                <p className="text-gray-600">Manage your header banners here</p>
            </div>

            {/* Left Banners Section - Multiple Images */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-3">Left Banners (Advertisement - Multiple)</h3>
                
                {leftBanners.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Banners ({leftBanners.length}):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {leftBanners.map((item, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                                        <img
                                            src={item.image}
                                            alt={`Banner ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <p className="text-xs text-gray-500 truncate" title={item.url}>
                                            {item.url || 'No URL'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteLeftBanner(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Left Banner</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Banner Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLeftImageChange}
                                disabled={uploadingLeft}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                            />
                            {newLeftImagePreview && (
                                <div className="mt-2 w-32 h-20 relative">
                                    <img
                                        src={newLeftImagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            {newLeftUploading && <p className="text-sm text-amber-600 mt-1">Uploading...</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Banner URL
                            </label>
                            <input
                                type="text"
                                value={newLeftUrl}
                                onChange={(e) => setNewLeftUrl(e.target.value)}
                                placeholder="Enter URL (e.g., /category-name-subcategory-id)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveLeftBanner}
                            disabled={loadingLeft || !newLeftImage || !newLeftUrl}
                            className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loadingLeft ? 'Saving...' : 'Add Left Banner'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Banner Section - Single Image */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">Right Banner (Advertisement - Single)</h3>
                
                {rightBanner && rightBanner.image && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Banner:</p>
                        <div className="relative w-40 h-24">
                            <img
                                src={rightBanner.image}
                                alt="Right Banner"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="mt-1">
                                <p className="text-xs text-gray-500 truncate" title={rightBanner.url}>
                                    {rightBanner.url || 'No URL'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDeleteRightBanner}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {(!rightBanner || !rightBanner.image) && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Upload Right Banner</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banner Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleRightImageChange}
                                    disabled={uploadingLeft}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                                />
                                {newRightImagePreview && (
                                    <div className="mt-2 w-40 h-24 relative">
                                        <img
                                            src={newRightImagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {newRightUploading && <p className="text-sm text-amber-600 mt-1">Uploading...</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banner URL
                                </label>
                                <input
                                    type="text"
                                    value={newRightUrl}
                                    onChange={(e) => setNewRightUrl(e.target.value)}
                                    placeholder="Enter URL (e.g., /category-name-subcategory-id)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveRightBanner}
                                disabled={loadingRight || !newRightImage || !newRightUrl}
                                className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loadingRight ? 'Saving...' : 'Save Right Banner'}
                            </button>
                        </div>
                    </div>
                )}

                {rightBanner && rightBanner.image && (
                    <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg mt-3">
                        <p>Right banner already exists. Delete the current banner to upload a new one.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BannerManagement