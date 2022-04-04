USE [SONOENTREGAS]
GO

/****** Object:  View [dbo].[VIEW_MAINTENANCE]    Script Date: 04/03/2022 07:27:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO








-- RETORNA AS ASSISTENCAS CONCRETIZADAS OU N�O INICIADAS

CREATE VIEW [dbo].[VIEW_MAINTENANCE] AS
SELECT B.ID_DELIV_MAIN, B.ID AS ID_MAIN_ATTEMP, A.*, D.UNITARIO1, C.NOMECLI, D.DESCRICAO AS PRODUTO, B.CHANGE_PRODUCT,
B.D_MOUNTING, B.D_PROCESS, B.D_MAINTENANCE, (C.ENDERECO+ ', ' + C.BAIRRO+ ', ' + C.CIDADE + '/' + C.ESTADO) AS ENDE,
E.DESCRIPTION CAT_DEFECT
FROM MAINTENANCE A
LEFT JOIN (
	SELECT *
	FROM MAINTENANCE_ATTEMPT
	WHERE DONE = 1
) B ON A.ID = B.ID_MAIN
INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALE = C.ID_SALES
INNER JOIN SALES_PROD D ON A.CODLOJA = D.CODLOJA AND A.ID_SALE = D.ID_SALES AND A.COD_ORIGINAL = D.COD_ORIGINAL
INNER JOIN CAT_DEFECT_MAIN E ON A.ID_CAT_DEF = E.ID











GO

