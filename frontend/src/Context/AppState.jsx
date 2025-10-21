import React, { useEffect, useState } from 'react'
import AppContext from './AppContext'
import axios from 'axios'
import { toast, Bounce } from 'react-toastify';

function AppState(props) {

  const url = import.meta.env.VITE_URL;
  const [products, setProducts] = useState([])
  const [token, setToken] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filteredData, setFilteredData] = useState([])
  const [user, setUser] = useState();
  const [cart, setCart] = useState([])
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {

      const api = await axios.get(`${url}/product/all`, {
        headers: {
          "Content-Type": "Application/json",
        },
        withCredentials: true,
      });

      // console.log(api.data.allProducts);
      setProducts(api.data.allProducts);
      setFilteredData(api.data.allProducts);
      userProfile();
    }
    fetchProducts();
    userCart();
  }, [token, reload])

  // for user profile
  useEffect(() => {
    let lstoken = localStorage.getItem("token");
    // console.log("ls token ",lstoken)
    if (lstoken) {
      setToken(lstoken);
      setIsAuthenticated(true);
    }

    // setToken(localStorage.getItem('token'))
  }, []);

  // register user
  const register = async ({ username, email, password }) => {
    const api = await axios.post(`${url}/user/register`, { username, email, password }, {
      headers: {
        "Content-Type": "Application/json"
      },
      withCredentials: true
    });

    // toast styling
    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

    return api.data;
  };

  // login user
  const login = async ({ email, password }) => {

    const api = await axios.post(`${url}/user/login`, { email, password }, {
      headers: {
        "Content-Type": "Application/json"
      },
      withCredentials: true
    });

    
    if (api.data.success) {

      // toast styling
      toast.success(api.data.message, {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      // token handling
      const tokenFromApi = api.data.token;
      setToken(tokenFromApi)
      localStorage.setItem('token', tokenFromApi);

      setIsAuthenticated(true)

    } else {
      toast.error(api.data.message, {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      
    }

    return api.data;
  };

  // logout user
  const logout = () => {

    setIsAuthenticated(false);
    setToken("");
    localStorage.removeItem('token');

    // toastify for UI
    toast.info("Logout Successfully...!", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }

  // user's profile
  const userProfile = async () => {
    const api = await axios.get(`${url}/user/profile`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: token
      },
      withCredentials: true
    });

    // console.log("user profile ",api.data.user);
    setUser(api.data.user);
  };

  // add to cart
  const addToCart = async (productId, title, price, qty, imgSrc) => {
    try {
      const res = await axios.post(
        `${url}/cart/add`,
        { productId, title, price, qty, imgSrc },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      // ✅ Update the cart in real time
      if (res.data.cart) {
        setCart(res.data.cart);
      } else {
        // fallback — refetch cart if backend didn’t return it
        userCart();
      }

    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart", {
        position: "top-right",
        autoClose: 1500,
        theme: "dark",
      });
    }
  };

  // user cart
  const userCart = async () => {
    try {
      const api = await axios.get(`${url}/cart/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        withCredentials: true,
      });

      if (api.data.cart) {
        setCart(api.data.cart);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // decrease product's quantity
  const decreaseQty = async (productId, qty) => {

    const api = await axios.post(
      `${url}/cart/--qty`,
      { productId, qty },
      {
        headers: {
          "Content-Type": "Application/json",
          Authorization: token,
        },
        withCredentials: true,
      }
    );
    setReload(!reload);

    toast.info(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

  }

  //  remove Item from cart
  const removeFromCart = async (productId) => {
    const api = await axios.delete(`${url}/cart/remove/${productId}`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: token,
      },
      withCredentials: true,
    });
    setReload(!reload);
    // console.log("remove item from cart ",api);
    toast.error(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    //  setCart(api.data.cart);
    //  setUser("user cart ",api);
  };

  //  clear Cart
  const clearCart = async () => {

    const api = await axios.delete(`${url}/cart/clear`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: token,
      },
      withCredentials: true,
    });
    setReload(!reload);
    // console.log("remove item from cart ",api);
    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    //  setCart(api.data.cart);
    //  setUser("user cart ",api);
  };


  return (
    <AppContext.Provider
      value={{
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
      }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppState
