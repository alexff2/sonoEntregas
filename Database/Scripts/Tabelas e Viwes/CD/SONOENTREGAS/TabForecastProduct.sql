CREATE TABLE FORECAST_PRODUCT (
	idForecastSale int NOT NULL FOREIGN KEY REFERENCES FORECAST_SALES(id),
	COD_ORIGINAL [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
	quantityForecast int NOT NULL
)
CREATE UNIQUE INDEX idForecastSaleCodOriginal ON FORECAST_PRODUCT (idForecastSale ASC, COD_ORIGINAL ASC)


select * from Forecast
select * from Forecast_SALES
SELECT * from Forecast_PRODUCT

select [STATUS], * from SALES where ID in (8939,8985, 9061)
select [STATUS], * from SALES_PROD where ID_SALE_ID in (8939,8985, 9061)

delete Forecast_PRODUCT
delete Forecast_SALES
delete Forecast

update sales set [STATUS] = 'Aberta' where id in (8939,8985, 9061)
update SALES_PROD set [STATUS] = 'Enviado' where ID_SALE_ID in (8939,8985, 9061)

