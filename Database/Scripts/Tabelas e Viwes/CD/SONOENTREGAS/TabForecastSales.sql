CREATE TABLE FORECAST_SALES (
	id int PRIMARY KEY,
	idForecast int NOT NULL FOREIGN KEY REFERENCES FORECAST(id),
	idSale float NOT NULL FOREIGN KEY REFERENCES SALES(ID),
	idUserCreate float NOT NULL FOREIGN KEY REFERENCES USERS(ID),
	idUserUpdate float NULL FOREIGN KEY REFERENCES USERS(ID),
	contact varchar(30),
	validationStatus bit,
	dateValidation datetime,
	obs varchar(255) NULL,
	requestInvalidate bit  NOT NULL DEFAULT 0,
	invalidationObs varchar(255),
	canRemove bit NOT NULL DEFAULT 1,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	[idDelivery] [varchar](20) NULL,
	[isMaintenance] [bit] NULL,
)

CREATE UNIQUE INDEX idForecastIdSale ON FORECAST_SALES (idForecast ASC, idSale ASC)

-- Excluir ID_SALES DA TABELA SALES COMO PRIMARY KEY E TRANSFERIR PARA ID, DEPOIS CRIAR O INDEX UNICO
CREATE UNIQUE INDEX codVendaCodLoja ON SALES (ID_SALES ASC, CODLOJA ASC)

