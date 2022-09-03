import React from 'react'
//Proveiders Context
import AuthProvider from './authContext'
import ShopProvider from './shopContext'
import DateProvider from './dateContext'
import DeliveryProvider from './deliveryContext'
import DeliveryFinishProvider from './deliveryFinishContext'
import SaleProvider from './saleContext'
import CarsProvider from './carsContext'
import DriverProvider from './driverContext'
import AssistantProvider from './assistantContext'
import UsersProvider from './usersContext'
import AlertProvider from './alertContext'
import AddressProvider from './addressContext'
import MaintenanceProvider from './maintenanceContext'

export default function DefaultContext({children}){
  return (
    <AlertProvider>
      <AuthProvider>
        <DateProvider>
          <ShopProvider>
            <UsersProvider>
              <DeliveryProvider>
                <DeliveryFinishProvider>
                  <AssistantProvider>
                    <SaleProvider>
                      <AddressProvider>
                        <CarsProvider>
                          <DriverProvider>
                            <MaintenanceProvider>
                              {children}
                            </MaintenanceProvider>
                          </DriverProvider>
                        </CarsProvider>
                      </AddressProvider>
                    </SaleProvider>
                  </AssistantProvider>
                </DeliveryFinishProvider>
              </DeliveryProvider>
            </UsersProvider>
          </ShopProvider>
        </DateProvider>
      </AuthProvider>
    </AlertProvider>
  )
}