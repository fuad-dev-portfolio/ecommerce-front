import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlist: []
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: initialState,
    reducers: {
        setWishlist: (state, action) => {
            state.wishlist = [...action.payload]
        },
        addToWishlist: (state, action) => {
            const incomingId = typeof action.payload.productId === 'object' ? action.payload.productId?._id : action.payload.productId;
            const existingItem = state.wishlist.find(item => {
                const itemId = typeof item.productId === 'object' ? item.productId?._id : item.productId;
                return itemId === incomingId;
            })
            if (!existingItem) {
                state.wishlist.push(action.payload)
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter(item => {
                const itemId = typeof item.productId === 'object' ? item.productId?._id : item.productId;
                return itemId !== action.payload;
            })
        },
        clearWishlist: (state) => {
            state.wishlist = []
        }
    }
})

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer