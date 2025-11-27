import { useEffect, useState } from 'react'
import AppContext from './AppContext'
import axios from 'axios'
import { toast, Bounce } from 'react-toastify';

function AppState(props) {

  const url = import.meta.env.VITE_URL;
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(""); // Default to empty string
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filteredData, setFilteredData] = useState([])
  const [user, setUser] = useState(null); // Default to null
  const [cart, setCart] = useState([])
  const [reload, setReload] = useState(false);
  const [userAddress, setUserAddress] = useState("")

  // Helper function to get auth headers with token from localStorage
  const getAuthHeaders = () => {
    const tokenFromStorage = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: tokenFromStorage, // Use the fresh token
    };
  };

  // Runs ONCE on App Load
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      setIsAuthenticated(true); // This might trigger the next useEffect
    } else {
        setIsAuthenticated(false); // Ensure it's false if no token
    }
    const fetchProducts = async () => {
      try {
        const api = await axios.get(`${url}/product/all`, {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true, 
        });
        
        setProducts(Array.isArray(api.data.allProducts) ? api.data.allProducts : []);
        setFilteredData(Array.isArray(api.data.allProducts) ? api.data.allProducts : []);
      } catch (error) {
        console.error("[AppState] Error fetching products on initial load:", error.response?.data || error.message);
        setProducts([]); 
        setFilteredData([]);
      }
    };
    fetchProducts();
  }, []); // Empty array ensures this runs only once on mount

  // Runs ONLY when user logs in/out OR when 'reload' is triggered
  useEffect(() => {
    // Fetch user-specific data only if authenticated
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          // Fetch products again if reload was triggered
          // This ensures product list updates after add/edit/delete
          if (reload) {
              const productApi = await axios.get(`${url}/product/all`, {
                  headers: { "Content-Type": "Application/json" },
                  withCredentials: true,
              });
              setProducts(Array.isArray(productApi.data.allProducts) ? productApi.data.allProducts : []);
              setFilteredData(Array.isArray(productApi.data.allProducts) ? productApi.data.allProducts : []);
          }
          // Fetch profile, address, cart
          await userProfile();
          await getAddress();
          await userCart();
        } catch (error) {
          console.error("[AppState] Error fetching user data after auth/reload:", error);
        } finally {
            // Reset reload flag if it was true
            if (reload) setReload(false);
        }
      };
      fetchUserData();
    } else {
      // Clear user-specific data on logout or if not authenticated initially
      setUser(null);
      setCart([]);
      setUserAddress("");
       // Reset reload flag if necessary
      if (reload) setReload(false);
    }
    // Dependency array: runs when isAuthenticated or reload changes
  }, [isAuthenticated, reload]);


  // register user
  const register = async ({ username, email, password }) => {
    try {
      const { data } = await axios.post(`${url}/user/register`, { username, email, password }, {
        headers: { "Content-Type": "Application/json" },
        withCredentials: true
      });
      toast.success(data.message, { theme: "dark", transition: Bounce });
      return data;
    } catch (error) {
       const message = error.response?.data?.message || "Registration failed";
       toast.error(message, { theme: "dark", transition: Bounce });
       console.error("[AppState] Registration Error:", error.response?.data || error.message);
       return { success: false, message };
    }
  };

  // login user
  const login = async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${url}/user/login`, { email, password }, {
        headers: { "Content-Type": "Application/json" },
        withCredentials: true
      });

      if (data.success) {
        toast.success(data.message, { theme: "dark", transition: Bounce });
        const tokenFromApi = data.token;
        setToken(tokenFromApi); // Keep this to potentially reflect logged-in state if needed elsewhere
        localStorage.setItem('token', tokenFromApi);
        setIsAuthenticated(true); // This will trigger the useEffect to fetch user data
      } else {
        toast.error(data.message || "Login failed", { theme: "dark", transition: Bounce });
      }
      return data;
    } catch (error) {
       const message = error.response?.data?.message || "Login failed";
       toast.error(message, { theme: "dark", transition: Bounce });
       console.error("[AppState] Login Error:", error.response?.data || error.message);
       return { success: false, message };
    }
  };

  // logout user
  const logout = () => {
    setIsAuthenticated(false); // Triggers useEffect to clear user data
    setToken("");
    localStorage.removeItem('token');
    toast.info("Logout Successfully...!", { theme: "dark", transition: Bounce });
  }

  // user's profile
  const userProfile = async () => {
    // Need to check token *before* making the call
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return; // Don't attempt if no token

    try {
      const { data } = await axios.get(`${url}/user/profile`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      setUser(data.user);
    } catch (error) {
      console.error("[AppState] Error fetching user profile:", error.response?.status, error.response?.data || error.message);
       if (error.response?.status === 401 || error.response?.status === 403) {
         // Token might be invalid/expired, log out
         console.warn("[AppState] Invalid token detected during profile fetch. Logging out.");
         logout();
       }
    }
  };

  // add to cart
  const addToCart = async (productId, title, price, qty, imgSrc) => {
    try {
      const { data } = await axios.post(
        `${url}/cart/add`,
        { productId, title, price, qty, imgSrc },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      toast.success(data.message, { theme: "dark", transition: Bounce });
      if (data.cart) {
        setCart(data.cart);
      } else {
        userCart(); // Refetch
      }
      return { success: true, ...data }; // Assuming success if no error
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add item to cart";
      toast.error(message, { theme: "dark", transition: Bounce });
      console.error("[AppState] AddToCart Error:", error.response?.data || error.message);
      return { success: false, message };
    }
  };

  // user cart
  const userCart = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return; // Don't attempt if no token

    try {
      const { data } = await axios.get(`${url}/cart/user`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setCart(data.cart || []); // Set empty array if no cart
    } catch (error) {
       if (error.response?.status !== 404) { // Ignore 404 (no cart yet)
         console.error("[AppState] Error fetching cart:", error.response?.status, error.response?.data || error.message);
       }
        setCart([]); // Ensure cart is empty on error/404
    }
  };

  // decrease product's quantity
  const decreaseQty = async (productId, qty) => {
    try {
      const { data } = await axios.post(
        `${url}/cart/--qty`,
        { productId, qty },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      // Don't setReload here, let userCart handle update if needed based on response
      userCart(); // Refetch cart to get updated quantities/totals
      toast.info(data.message, { theme: "dark", transition: Bounce });
      return { success: true, ...data };
    } catch (error) {
       const message = error.response?.data?.message || "Failed to decrease quantity";
       toast.error(message, { theme: "dark", transition: Bounce });
       console.error("[AppState] DecreaseQty Error:", error.response?.data || error.message);
       return { success: false, message };
    }
  }

  //  remove Item from cart
  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(`${url}/cart/remove/${productId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      userCart(); // Refetch cart
      // Use success toast if successful, error if not? Backend response dictates.
      // Assuming message indicates success here based on original code.
      toast.success(data.message, { theme: "dark", transition: Bounce });
      return { success: true, ...data };
    } catch (error) {
       const message = error.response?.data?.message || "Failed to remove item";
       toast.error(message, { theme: "dark", transition: Bounce });
       console.error("[AppState] RemoveFromCart Error:", error.response?.data || error.message);
       return { success: false, message };
    }
  };

  //  clear Cart
  const clearCart = async () => {
    try {
      const { data } = await axios.delete(`${url}/cart/clear`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      userCart(); // Refetch cart (will be empty)
      toast.success(data.message, { theme: "dark", transition: Bounce });
      return { success: true, ...data };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to clear cart";
        toast.error(message, { theme: "dark", transition: Bounce });
        console.error("[AppState] ClearCart Error:", error.response?.data || error.message);
        return { success: false, message };
    }
  };

  // add shipping address
  const shippingAddress = async (addressData) => {
    try {
      const { data } = await axios.post(
        `${url}/address/add`,
        addressData,
        { headers: getAuthHeaders(), withCredentials: true }
      )
      getAddress(); // Refetch address
      toast.info(data.message, { theme: "dark", transition: Bounce });
      return { success: true, ...data }; // Assuming success
    } catch (error) {
       const message = error.response?.data?.message || "Failed to save address";
       toast.error(message, { theme: "dark", transition: Bounce });
       console.error("[AppState] ShippingAddress Error:", error.response?.data || error.message);
       return { success: false, message };
    }
  }

  // get latest address
  const getAddress = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return; // Don't attempt if no token

    try {
      const { data } = await axios.get(
        `${url}/address/get`,
        { headers: getAuthHeaders(), withCredentials: true }
      )
      setUserAddress(data.userAddress || ""); // Set empty string if none
    } catch (error) {
       if (error.response?.status !== 404) { // Ignore 404 (no address saved)
         console.error("[AppState] Error fetching address:", error.response?.status, error.response?.data || error.message);
       }
       setUserAddress(""); // Ensure address is empty on error/404
    }
  }

  // confirm order
// confirm order
  const confirmOrder = async (currentCart, currentAddress, currentUser) => {
    try {
      if (!currentCart?.items?.length) {
        toast.error("Your cart is empty!", { theme: "dark", transition: Bounce }); return null;
      }
      if (!currentAddress) {
        toast.error("Please provide a shipping address.", { theme: "dark", transition: Bounce }); return null;
      }
      if (!currentUser?._id) {
        toast.error("User information is missing.", { theme: "dark", transition: Bounce }); return null;
      }

      // --- CALCULATE TOTALS HERE ---
      const totalQty = currentCart.items.reduce((acc, item) => acc + item.qty, 0);
      // Ensure price calculation considers quantity for each item
      const totalPrice = currentCart.items.reduce((acc, item) => acc + (item.price * item.qty), 0);


      const orderData = {
        userId: currentUser._id,
        items: currentCart.items.map(item => ({
          productId: item.productId,
          name: item.title, // Make sure 'title' exists on cart items
          qty: item.qty,
          price: item.price, // Price per item
        })),
        address: currentAddress,
        totalQty: totalQty,    // <-- SEND totalQty
        totalPrice: totalPrice,  // <-- SEND totalPrice
      };

      // --- Log the data being sent ---
      // console.log("[AppState] confirmOrder - Sending orderData:", JSON.stringify(orderData, null, 2));


      const { data } = await axios.post(`${url}/order`, orderData, { // Ensure this URL matches your backend route (e.g., /api/order)
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      toast.success("Order Confirmed Successfully!", { theme: "dark", transition: Bounce });
      userCart(); // Fetch the now empty cart
      return data.order; // Return the saved order from backend response

    } catch (error) {
      const message = error.response?.data?.message || "Failed to confirm order";
      toast.error(message, { theme: "dark", transition: Bounce });
      // Log the detailed error from the backend response if available
      console.error("[AppState] ConfirmOrder Error:", error.response?.status, error.response?.data || error.message);
      return null;
    }
  };

  // ==========================================================
  // --- ADMIN FUNCTIONS ---
  // ==========================================================

  // Admin: Get all orders
  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(`${url}/admin/orders`, {
        headers: getAuthHeaders(), withCredentials: true,
      });
       // console.log("[AppState] getAllOrders - Backend Response:", data);
       return { success: true, ...data }; // Add success flag
    } catch (error) {
      const message = error.response?.data?.message || 'Server error fetching orders';
      toast.error(message, { theme: "dark", transition: Bounce });
      console.error("[AppState] getAllOrders Error:", error.response?.status, error.response?.data || error.message);
      return { success: false, message };
    }
  };

  // Admin: Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(`${url}/admin/order/${orderId}/status`,
        { status }, { headers: getAuthHeaders(), withCredentials: true }
      );
       // console.log("[AppState] updateOrderStatus - Backend Response:", data);
       return { success: true, ...data }; // Add success flag
    } catch (error) {
      const message = error.response?.data?.message || 'Server error updating order status';
      toast.error(message, { theme: "dark", transition: Bounce });
      console.error("[AppState] updateOrderStatus Error:", error.response?.status, error.response?.data || error.message);
      return { success: false, message };
    }
  };

  // Admin: Get all users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${url}/admin/users`, {
        headers: getAuthHeaders(), withCredentials: true,
      });
       // console.log("[AppState] getAllUsers - Backend Response:", data);
       return { success: true, ...data }; // Add success flag
    } catch (error) {
      const message = error.response?.data?.message || 'Server error fetching users';
      toast.error(message, { theme: "dark", transition: Bounce });
      console.error("[AppState] getAllUsers Error:", error.response?.status, error.response?.data || error.message);
      return { success: false, message };
    }
  };

  // Admin: Update user role
  const adminUpdateUserRole = async (userId, role) => {
    try {
      const { data } = await axios.put(`${url}/admin/user/${userId}/role`,
        { role }, { headers: getAuthHeaders(), withCredentials: true }
      );
      // console.log("[AppState] adminUpdateUserRole - Backend Response:", data);
      return { success: true, ...data }; // Add success flag
    } catch (error) {
      const message = error.response?.data?.message || 'Server error updating user role';
      toast.error(message, { theme: "dark", transition: Bounce });
      console.error("[AppState] adminUpdateUserRole Error:", error.response?.status, error.response?.data || error.message);
      return { success: false, message };
    }
  };

  // Admin: Add product
  const adminAddProduct = async (productData) => {
    // Ensure productData includes 'qty' as required by backend model
    const dataToSend = { ...productData, qty: productData.qty ?? 0 }; // Default qty to 0 if missing
    //  console.log("[AppState] adminAddProduct - Sending data:", dataToSend);
    try {
      const { data } = await axios.post(`${url}/admin/product/add`,
        dataToSend, // Use data with 'qty'
        { headers: getAuthHeaders(), withCredentials: true }
      );
      // console.log("[AppState] adminAddProduct - Backend Response:", data);
      setReload(true); // Trigger reload to fetch updated products
      return { success: true, ...data }; // Add success flag
    } catch (error) {
      const message = error.response?.data?.message || 'Server error adding product';
      // More specific error for validation issues
       const validationError = error.response?.data?.error;
       const displayMessage = validationError ? `Validation Error: ${validationError}` : message;

      toast.error(displayMessage, { theme: "dark", transition: Bounce });
      console.error("[AppState] adminAddProduct Error:", error.response?.status, error.response?.data || error.message);
      return { success: false, message: displayMessage };
    }
  };

  // Admin: Update product
  const adminUpdateProduct = async (productId, productData) => {
     // Ensure productData includes 'qty' as required by backend model
    const dataToSend = { ...productData, qty: productData.qty ?? 0 }; // Default qty to 0 if missing
    // console.log("[AppState] adminUpdateProduct - Sending data for ID", productId, ":", dataToSend);
    try {
      const { data } = await axios.put(`${url}/admin/product/${productId}`,
        dataToSend, // Use data with 'qty'
        { headers: getAuthHeaders(), withCredentials: true }
      );
      //  console.log("[AppState] adminUpdateProduct - Backend Response:", data);
      setReload(true); // Trigger reload to fetch updated products
      return { success: true, ...data }; // Add success flag
    } catch (error) {
      const message = error.response?.data?.message || 'Server error updating product';
       const validationError = error.response?.data?.error;
       const displayMessage = validationError ? `Validation Error: ${validationError}` : message;

      toast.error(displayMessage, { theme: "dark", transition: Bounce });
      console.error("[AppState] adminUpdateProduct Error:", error.response?.status, error.response?.data || error.message);
      return { success: false, message: displayMessage };
    }
  };

  // Admin: Delete product
  const adminDeleteProduct = async (productId) => {
    // console.log("[AppState] adminDeleteProduct - Deleting ID:", productId);
    try {
      const { data } = await axios.delete(`${url}/admin/product/${productId}`, {
        headers: getAuthHeaders(), withCredentials: true,
      });
      //  console.log("[AppState] adminDeleteProduct - Backend Response:", data);
      setReload(true); // Trigger reload to fetch updated products
      // Add success flag based on expected message
      const success = data.message === "Product deleted successfully";
      return { success, ...data };
    } catch (error) {
      const message = error.response?.data?.message || 'Server error deleting product';
      toast.error(message, { theme: "dark", transition: Bounce });
      console.error("[AppState] adminDeleteProduct Error:", error.response?.status, error.response?.data || error.message);
      return { success: false, message };
    }
  };


  return (
    <AppContext.Provider
      value={{
        // Original values
        products,
        isAuthenticated,
        setIsAuthenticated,
        filteredData,
        setFilteredData,
        register,
        login,
        logout,
        user,
        addToCart,
        cart,
        decreaseQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        userAddress,
        confirmOrder,

        // New Admin values
        getAllOrders,
        updateOrderStatus,
        getAllUsers,
        adminUpdateUserRole,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
      }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppState

