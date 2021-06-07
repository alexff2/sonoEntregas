USE [SONO]
GO

/****** Object:  View [dbo].[VIEW_PROD_EST_RESERVA]    Script Date: 05/31/2021 15:28:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





CREATE VIEW [dbo].[VIEW_PROD_EST_RESERVA]  AS
SELECT A.ALTERNATI COD_ORIGINAL, A.NOME NOME, B.EST_ATUAL EST_ATUAL, B.EST_LOJA EST_LOJA, 
CASE WHEN (C.QTD IS NULL) THEN 0 ELSE C.QTD END EST_RESERVA, 
(B.EST_ATUAL - (CASE WHEN (C.QTD IS NULL) THEN 0 ELSE C.QTD END)) EST_DISPONIVEL
FROM PRODUTOS A
INNER JOIN PRODLOJAS B ON A.CODIGO = B.CODIGO
LEFT JOIN ( SELECT A.COD_ORIGINAL, SUM(A.QUANTIDADE) QTD FROM SONOENTREGAS..SALES_PROD A
			INNER JOIN SONOENTREGAS..SALES B ON A.ID_SALES = B.ID_SALES
			WHERE B.STATUS <> 'Finalizada'
			GROUP BY A.COD_ORIGINAL) C ON C.COD_ORIGINAL = A.ALTERNATI
WHERE B.CODLOJA = 1
AND A.ATIVO <> 'N'



GO


