CREATE TABLE FORECAST_PRODUCT (
	idForecastSale int NOT NULL FOREIGN KEY REFERENCES FORECAST_SALES(id),
	COD_ORIGINAL [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
	quantityForecast int NOT NULL,
	[ID_MAINTENANCE] [float] NULL FOREIGN KEY REFERENCES MAINTENANCE(ID)
)
CREATE UNIQUE INDEX idForecastSaleCodOriginal ON FORECAST_PRODUCT (idForecastSale ASC, COD_ORIGINAL ASC)
