export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : '/api/user/verify-forgot-password-otp',
        method : 'put'
    },
    verifyEmail : {
        url : '/api/user/verify-email',
        method : 'post'
    },
    resendVerifyOtp : {
        url : '/api/user/resend-verify-otp',
        method : 'post'
    },
    resetPassword : {
        url : "/api/user/reset-password",
        method : 'put'
    },
    refreshToken : {
        url : '/api/user/refresh-token',
        method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details',
        method : "get"
    },
    logout : {
        url : "/api/user/logout",
        method : 'get'
    },
    uploadAvatar : {
        url : "/api/user/upload-avatar",
        method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url : '/api/category/get',
        method : 'get'
    },
    updateCategory : {
        url : '/api/category/update',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createSubCategory : {
        url : '/api/subcategory/create',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get',
        method : 'post'
    },
    updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    },
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-pruduct-by-category-and-subcategory',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addTocart : {
        url : "/api/cart/create",
        method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    CashOnDeliveryOrder : {
        url : "/api/order/cash-on-delivery",
        method : 'post'
    },
    payment_url : {
        url : "/api/order/checkout",
        method : 'post'
    },
    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    //Admin Report APIs
    getAllOrders : {
        url : '/api/order/all-orders',
        method : 'get'
    },
    getAllProductsStock : {
        url : '/api/order/all-products-stock',
        method : 'get'
    },
    updateOrder : {
        url : '/api/order/update-order',
        method : 'put'
    },
    //Super Admin APIs
    getAllUsers : {
        url : '/api/user/get-all-users',
        method : 'post'
    },
    getUserById : {
        url : '/api/user/get-user-by-id',
        method : 'post'
    },
    updateUserRole : {
        url : '/api/user/update-user-role',
        method : 'put'
    },
    deleteUser : {
        url : '/api/user/delete-user',
        method : 'delete'
    },
    createAdmin : {
        url : '/api/user/create-admin',
        method : 'post'
    },
    guestCheckout : {
        url : '/api/order/guest-checkout',
        method : 'post'
    },
    //Wishlist APIs
    addToWishlist : {
        url : '/api/wishlist/add',
        method : 'post'
    },
    removeFromWishlist : {
        url : '/api/wishlist/remove',
        method : 'post'
    },
    getWishlist : {
        url : '/api/wishlist/get',
        method : 'get'
    },
    checkWishlist : {
        url : '/api/wishlist/check',
        method : 'get'
    },
    //Track Order API
    trackOrder : {
        url : '/api/order/track',
        method : 'get'
    }
}

export default SummaryApi