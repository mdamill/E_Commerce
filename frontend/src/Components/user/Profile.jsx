import React, { useContext } from 'react'
import AppContext from '../../Context/AppContext'

function Profile() {

  const {user} = useContext(AppContext);
  // console.log(user);
  

  return (
    <>
    <div className="container text-center my-3">
      <h1>Welcome, {user?.username}</h1>
      <h2>{user?.email}</h2>
    </div>
    </>
  )
}

export default Profile
