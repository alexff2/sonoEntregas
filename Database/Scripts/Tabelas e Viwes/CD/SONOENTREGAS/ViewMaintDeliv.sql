USE [SONOENTREGAS]
GO

/****** Object:  View [dbo].[VIEW_MAINT_DELIV]    Script Date: 05/13/2022 16:55:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[VIEW_MAINT_DELIV] AS
SELECT A.ID, A.ID_MAINT, A.D_MOUNTING, A.D_DELIVING, A.D_DELIVERED, A.DONE, A.REASON_RETURN, 
B.DESCRIPTION AS DRIVER, C.DESCRIPTION AS ASSISTANT, A.ID_DELIV_MAIN
FROM MAINTENANCE_DELIV A
INNER JOIN USERS B ON A.ID_DRIVER = B.ID
INNER JOIN USERS C ON A.ID_ASSISTANT = C.ID

GO


