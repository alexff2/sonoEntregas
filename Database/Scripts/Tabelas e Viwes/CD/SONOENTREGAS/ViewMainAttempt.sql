USE [SONOENTREGAS]
GO

/****** Object:  View [dbo].[VIEW_MAIN_ATTEMPT]    Script Date: 04/03/2022 07:23:26 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE VIEW [dbo].[VIEW_MAIN_ATTEMPT] AS
SELECT A.ID, A.ID_MAIN, A.CHANGE_PRODUCT, A.D_MOUNTING, A.D_PROCESS, A.D_MAINTENANCE, A.DONE, A.REASON_RETURN, 
B.DESCRIPTION AS DRIVER, C.DESCRIPTION AS ASSISTANT, A.ID_DELIV_MAIN
FROM MAINTENANCE_ATTEMPT A
INNER JOIN USERS B ON A.ID_DRIVER = B.ID
INNER JOIN USERS C ON A.ID_ASSISTANT = C.ID



GO

