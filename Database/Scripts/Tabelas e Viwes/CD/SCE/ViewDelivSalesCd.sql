USE [SONO]
GO

/****** Object:  View [dbo].[VIEW_DELI_SALES]    Script Date: 06/08/2021 09:44:01 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[VIEW_DELI_SALES]
AS
SELECT * FROM SONOENTREGAS..View_Deliv_Sales
GO


