CREATE TABLE NVENDI2_STATUS (
	CODIGOVENDA FLOAT NOT NULL,
	CODPRODUTO FLOAT NOT NULL,
	STATUS VARCHAR(15) NOT NULL,
	GIFT BIT NOT NULL
)

INSERT NVENDI2_STATUS 
SELECT A.NUMVENDA, A.ITEM, A.STATUS, A.GIFT
FROM NVENDI2 A LEFT JOIN NVENDI2_STATUS B ON A.NUMVENDA = B.CODIGOVENDA AND A.CODPRODUTO = B.CODPRODUTO
WHERE A.STATUS IS NOT NULL

ALTER TABLE NVENDI2 DROP COLUMN STATUS

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF__NVENDI2__GIFT__4D8B3151]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].NVENDI2 DROP CONSTRAINT DF__NVENDI2__GIFT__4D8B3151
END

ALTER TABLE NVENDI2 DROP COLUMN GIFT
------------- 

ALTER VIEW [dbo].[VIEW_NVENDI2]
AS
SELECT A.NUMVENDA, A.CODPRODUTO, B.ALTERNATI, B.NOME DESCRICAO, A.QUANTIDADE, A.UNITARIO1, A.NPDESC, C.STATUS, C.GIFT, A.NVTOTAL
FROM NVENDI2 A
INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
LEFT JOIN NVENDI2_STATUS C ON C.CODIGOVENDA = A.NUMVENDA AND C.CODPRODUTO = A.CODPRODUTO
GO

