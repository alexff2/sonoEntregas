USE [SONOENTREGAS]
GO

/****** Object:  View [dbo].[VIEW_DELIVERYS]    Script Date: 02/04/2022 18:33:05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW [dbo].[VIEW_DELIVERYS]
AS
SELECT A.ID, A.DESCRIPTION, D.DESCRIPTION AS CAR, D.PLATE, C.DESCRIPTION AS ASSISTANT, B.DESCRIPTION AS DRIVER, A.STATUS, 
E.D_DELIVERED, A.ID_CAR, A.ID_ASSISTANT, A.ID_DRIVER
FROM dbo.DELIVERYS AS A 
LEFT OUTER JOIN USERS AS B ON A.ID_DRIVER = B.ID
LEFT OUTER JOIN USERS AS C ON A.ID_ASSISTANT = C.ID
LEFT OUTER JOIN CARS AS D ON A.ID_CAR = D.ID
LEFT OUTER JOIN VIEW_D_DELV_ROUTES2 AS E ON E.ID_DELIVERY = A.ID


GO


