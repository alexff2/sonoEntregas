USE [SONOENTREGAS]
GO

CREATE TABLE [dbo].[DELIVERYS_PROD](
	[ID_DELIVERY] [float] NOT NULL,
	[ID_SALE] [float] NOT NULL,
	[CODLOJA] [float] NOT NULL,
	[QTD_DELIV] [float] NOT NULL,
	[COD_ORIGINAL] [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
	[DELIVERED] [bit] NOT NULL,
	[REASON_RETURN] [varchar](250) NULL
)
