import { createSlice } from '@reduxjs/toolkit';

const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const calculateTotals = (cartItems) => {
  const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = itemsPrice * 0.08; // 8% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 15; // Free shipping over $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return {
    itemsPrice: Math.round(itemsPrice * 100) / 100,
    taxPrice: Math.round(taxPrice * 100) / 100,
    shippingPrice,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
};

const initialState = {
  cartItems: getCartFromStorage(),
  ...calculateTotals(getCartFromStorage()),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existItem = state.cartItems.find(item => item.product === product._id);

      if (existItem) {
        state.cartItems = state.cartItems.map(item =>
          item.product === existItem.product
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        state.cartItems.push({
          product: product._id,
          name: product.name,
          image: product.images[0]?.url || '',
          price: product.discountPrice || product.price,
          stock: product.stock,
          quantity: 1,
        });
      }

      const totals = calculateTotals(state.cartItems);
      Object.assign(state, totals);
      saveCartToStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.product !== productId);

      const totals = calculateTotals(state.cartItems);
      Object.assign(state, totals);
      saveCartToStorage(state.cartItems);
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.cartItems = state.cartItems.filter(item => item.product !== productId);
      } else {
        state.cartItems = state.cartItems.map(item =>
          item.product === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        );
      }

      const totals = calculateTotals(state.cartItems);
      Object.assign(state, totals);
      saveCartToStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.taxPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },

    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find(item => item.product === productId);
      
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        const totals = calculateTotals(state.cartItems);
        Object.assign(state, totals);
        saveCartToStorage(state.cartItems);
      }
    },

    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find(item => item.product === productId);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(item => item.product !== productId);
        }
        
        const totals = calculateTotals(state.cartItems);
        Object.assign(state, totals);
        saveCartToStorage(state.cartItems);
      }
    },

    loadCartFromStorage: (state) => {
      const cartItems = getCartFromStorage();
      state.cartItems = cartItems;
      const totals = calculateTotals(cartItems);
      Object.assign(state, totals);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;