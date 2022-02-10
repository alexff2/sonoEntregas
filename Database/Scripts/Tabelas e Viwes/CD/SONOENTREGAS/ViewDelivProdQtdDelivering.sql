USE [SONOENTREGAS]
GO

/****** Object:  View [dbo].[VIEW_DELIV_PROD_QTD_DELIVERING]    Script Date: 02/07/2022 14:42:03 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[VIEW_DELIV_PROD_QTD_DELIVERING] AS
SELECT ID_SALE, COD_ORIGINAL, CODLOJA, SUM(QTD_DELIV) QTD_MOUNTING, 
SUM( CASE WHEN D_DELIVERING IS NULL THEN 0 ELSE QTD_DELIV END) QTD_DELIVERING,
SUM( CASE WHEN D_DELIVERED IS NULL THEN 0 ELSE QTD_DELIV END) QTD_DELIVERED
FROM DELIVERYS_PROD A
WHERE DELIVERED = 0
GROUP BY ID_SALE, COD_ORIGINAL, CODLOJA



GO


