import React, { createContext, useState, useContext } from 'react'

const ForecastsContext = createContext()

export default function ForecastsProvider({ children }){
  const [forecasts, setForecasts] = useState([])

  return (
    <ForecastsContext.Provider
      value={{forecasts, setForecasts}}
    >
      {children}
    </ForecastsContext.Provider>
  )
}

export function useForecasts(){
  const {forecasts, setForecasts} = useContext(ForecastsContext)
  return {forecasts, setForecasts}
}