import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadCartFromStorage } from '../store/slices/cartSlice';
import { loadWishlistFromStorage } from '../store/slices/wishlistSlice';

export const useLoadUserData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load cart from localStorage
    dispatch(loadCartFromStorage());
    
    // Load wishlist from localStorage
    dispatch(loadWishlistFromStorage());
  }, [dispatch]);
};