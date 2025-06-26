import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';
// Create the context

axios.defaults.baseURL = import.meta.env.VITE_VITE_BACKEND_URL;


export const AppContext = createContext();


// Provider component
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();              // For navigation
  const [user, setUser] = useState(null);      // Store user info
  const [isSeller, setIsSeller] = useState(false); // Check if user is a seller
  const [showUserLogin, setShowUserLogin] = useState(false); // Check if user is a seller
  const [products,setProducts] = useState([])

  const [cartItems,setCartItems] = useState({})
  const [searchQuery,setSearchQuery] = useState({})


  //fetch  User Auth Status , User data and cart items 
  const fetchUser  = async()=>{
    try {
      const {data} = await axios.get('/api/user/is-auth');

      if(data.success){
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }
    } catch (error) {
      console.log(error)
      setUser(null)
    }
  }



  //fetch seller status 
  const fetchSeller = async () => {
  try {
    const { data } = await axios.get('/api/seller/is-auth', {
      withCredentials: true,   // <== This enables sending cookies with the request
    });
    if (data.success) {
      setIsSeller(true);
    } else {
      setIsSeller(false);
    }
  } catch (error) {
    console.log(error.message);
    setIsSeller(false);
  }
};

  



  //fetch  all products 
  const fetchProducts = async()=>{
    try {
      const { data} = await axios.get('/api/product/list')
      if(data.success){
        setProducts(data.products)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  //add product to cart 
  const addToCart = (itemId) =>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
      cartData[itemId] += 1;
    }else{
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    toast.success('Added to Cart')
    
  }
  //update card Item quantity 
  const updateCartItem = (itemId,quantity) =>{
    let cartData = structuredClone(cartItems);
     cartData[itemId] = quantity;
     setCartItems(cartData);
     toast.success('Cart Updated')

 }
 //remove product from cart 
 const removeFromCart = (itemId) =>{
  let cartData = structuredClone(cartItems);
  if(cartData[itemId]){
    cartData[itemId] -= 1;
    if(cartData[itemId] === 0){
      delete cartData[itemId];
    }
  }
  toast.success("Removed from cart ")
  setCartItems(cartData) 
 }

 //get cart item count 
 const getCartCount = ()=>{
  let totalCount = 0;
  for (const item in cartItems){
    totalCount += cartItems[item]
  }
  return totalCount;
 }

 //Get Crt total amount 
 const getCartAmount = () =>{
  let totalAmount = 0;
  for (const items in cartItems){
    let itemInfo = products.find((product)=>product._id === items);
    if(cartItems[items] > 0 ){
      totalAmount += itemInfo.price * cartItems[items]
    }
  }
  return Math.floor(totalAmount * 100 )/100;
 }

  useEffect(()=>{
    fetchUser()
    fetchSeller()
    fetchProducts()

  },[])

  //update database cart item

  useEffect(() => {
  const updateCart = async () => {
    try {
      const { data } = await axios.post('/api/cart/update', {
        userId: user?._id,        // ✅ Add this line
        cartItems
      });
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (user) {
    updateCart();
  }
}, [cartItems]);



  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    setCartItems,
    axios,
    fetchProducts
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      
    </AppContext.Provider>
  );
};

// Custom hook to access context easily
export const useAppContext = () => {
  return useContext(AppContext);
};
