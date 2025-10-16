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

  useEffect(() => {
    const fetchProducts = async () => {

      const response = await axios.get(`${url}/product/all`, {
        headers: {
          "Content-Type": "Application/json",
        },
        withCredentials: true,
      });

      // console.log(response.data.allProducts);
      setProducts(response.data.allProducts);
      setFilteredData(response.data.allProducts);

    }
    fetchProducts()
  }, [token])

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
      }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppState
