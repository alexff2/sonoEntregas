CREATE TABLE PREVISION_PRODUCT (
	idPrevisionSale int NOT NULL FOREIGN KEY REFERENCES PREVISION_SALES(id),
	COD_ORIGINAL [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL
)
