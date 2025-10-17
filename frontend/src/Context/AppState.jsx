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
  const [user, setUser] = useState()

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
    fetchProducts()
  }, [token])

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

  // user's profile
  const userProfile = async () => {
    const api = await axios.get(`${url}/user/profile`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization : token
      },
      withCredentials: true
    });

    // console.log("user profile ",api.data.user);
    setUser(api.data.user);
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
        user
      }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppState
