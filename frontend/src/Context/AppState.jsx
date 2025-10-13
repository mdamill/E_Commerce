import React from 'react'
import AppContext from './AppContext'

function AppState(props) {

  // console.log(props);
  const d = 10;
  const c = 50;
  

  return (
    <AppContext.Provider
      value={{
        d,
        c
      }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppState
