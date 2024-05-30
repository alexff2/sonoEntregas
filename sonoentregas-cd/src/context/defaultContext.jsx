import React from 'react'
//Providers Context
import AuthProvider from './authContext'
import ShopProvider from './shopContext'
import DateProvider from './dateContext'
import DeliveryProvider from './deliveryContext'
import ForecastsProvider from './forecastsContext'
import DeliveryFinishProvider from './deliveryFinishContext'
import SaleProvider from './saleContext'
import CarsProvider from './carsContext'
import DriverProvider from './driverContext'
import AssistantProvider from './assistantContext'
import UsersProvider from './usersContext'
import AlertProvider from './alertContext'
import AlertSnackbarProvider from './alertSnackbarContext'
import BackdropProvider from './backdropContext'
import AddressProvider from './addressContext'
import MaintenanceProvider from './maintenanceContext'

export default function DefaultContext({children}){
  return (
    <AlertProvider>
      <AlertSnackbarProvider>
        <BackdropProvider>
          <AuthProvider>
            <DateProvider>
              <ShopProvider>
                <UsersProvider>
                  <DeliveryProvider>
                    <DeliveryFinishProvider>
                      <ForecastsProvider>
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
                      </ForecastsProvider>
                    </DeliveryFinishProvider>
                  </DeliveryProvider>
                </UsersProvider>
              </ShopProvider>
            </DateProvider>
          </AuthProvider>
        </BackdropProvider>
      </AlertSnackbarProvider>
    </AlertProvider>
  )
}