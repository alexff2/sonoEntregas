USE [SONOENTREGAS]
GO

/****** Object:  View [dbo].[VIEW_SALES_PROD]    Script Date: 08/30/2021 09:26:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW [dbo].[VIEW_SALES_PROD] AS
SELECT A.*, CASE WHEN B.QTD_DELIV IS NULL THEN 0 ELSE B.QTD_DELIV END QTD_DELIV
FROM SALES_PROD A
LEFT JOIN (	SELECT ID_SALE, COD_ORIGINAL, SUM(QTD_DELIV) QTD_DELIV 
			FROM DELIVERYS_PROD 
			WHERE DELIVERED = 0
			GROUP BY ID_SALE, COD_ORIGINAL ) B 
ON A.ID_SALES = B.ID_SALE AND A.COD_ORIGINAL = B.COD_ORIGINAL
GO

