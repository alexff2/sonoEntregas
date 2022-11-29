CREATE TABLE PREVISION_SALES (
	id int IDENTITY(1,1) PRIMARY KEY,
	idPrevision int NOT NULL FOREIGN KEY REFERENCES PREVISION(id),
	idSale float NOT NULL FOREIGN KEY REFERENCES SALES(ID),
	idUserUpdate int,
	contact varchar(30),
	validationStatus bit,
	dateValidation date,
	obs varchar(255) NULL
)
-- Excluir ID_SALES DA TABELA SALES COMO PRIMARY KEY E TRANSFERIR PARA ID, DEPOIS CRIAR O INDEX UNICO
CREATE UNIQUE INDEX codVendaCodLoja ON SALES (ID_SALES ASC, CODLOJA ASC)

