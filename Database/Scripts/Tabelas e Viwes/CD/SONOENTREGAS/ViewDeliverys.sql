USE [SONOENTREGAS]
GO

/****** Object:  View [dbo].[VIEW_DELIVERYS]    Script Date: 12/21/2021 19:26:19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




ALTER VIEW [dbo].[VIEW_DELIVERYS] AS
SELECT A.ID, A.DESCRIPTION, D.DESCRIPTION CAR, D.PLATE, C.DESCRIPTION ASSISTANT, B.DESCRIPTION DRIVER, A.STATUS, E.D_DELIVERED
FROM DELIVERYS A
INNER JOIN USERS B ON A.ID_DRIVER = B.ID
INNER JOIN USERS C ON A.ID_ASSISTANT = C.ID
INNER JOIN CARS D ON A.ID_CAR = D.ID
LEFT JOIN VIEW_D_DELV_ROUTES E ON E.ID_DELIVERY = A.ID




GO


