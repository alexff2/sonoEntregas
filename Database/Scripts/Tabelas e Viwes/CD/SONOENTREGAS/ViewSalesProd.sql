SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VIEW_SALES_PROD] AS
SELECT A.CODPRODUTO, A.COD_ORIGINAL, A.CODLOJA, A.DESCONTO, A.DESCRICAO, A.DOWN_EST, A.ID_SALES, A.NVTOTAL, A.QUANTIDADE, A.[STATUS], A.UNITARIO1 ,
CASE WHEN B.QTD_MOUNTING IS NULL THEN 0 ELSE B.QTD_MOUNTING END QTD_DELIV,
CASE WHEN B.QTD_DELIVERING IS NULL THEN 0 ELSE B.QTD_DELIVERING END QTD_DELIVERING,
CASE WHEN B.QTD_DELIVERED IS NULL THEN 0 ELSE B.QTD_DELIVERED END QTD_DELIVERED
FROM SALES_PROD A 
LEFT JOIN VIEW_DELIV_PROD_QTD_DELIVERING B ON A.CODLOJA = B.CODLOJA AND A.ID_SALES = B.ID_SALE AND A.COD_ORIGINAL = B.COD_ORIGINAL
GO
