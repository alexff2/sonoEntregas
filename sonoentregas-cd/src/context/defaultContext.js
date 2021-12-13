import React from 'react'
//Proveiders Context
import ShopProvider from './shopContext'
import DateProvider from './dateContext'
import DeliveryProvider from './deliveryContext'
import SaleProvider from './saleContext'
import CarsProvider from './carsContext'
import DriverProvider from './driverContext'
import AssistantProvider from './assistantContext'
import UsersProvider from './usersContext'
import AlertProvider from './alertContext'

export default function DefaultContext({children}){
  return (
    <AlertProvider>
      <DateProvider>
        <ShopProvider>
          <UsersProvider>
            <DeliveryProvider>
              <AssistantProvider>
                <SaleProvider>
                  <CarsProvider>
                    <DriverProvider>
                        {children}
                    </DriverProvider>
                  </CarsProvider>
                </SaleProvider>
              </AssistantProvider>
            </DeliveryProvider>
          </UsersProvider>
        </ShopProvider>
      </DateProvider>
    </AlertProvider>
  )
}