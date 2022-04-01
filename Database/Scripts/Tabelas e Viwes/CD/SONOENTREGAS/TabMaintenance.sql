USE [SONOENTREGAS]
GO

/****** Object:  Table [dbo].[MAINTENANCE]    Script Date: 03/08/2022 15:32:31 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[MAINTENANCE](
	[ID] [float] NOT NULL,
	[ID_DELIVERY] [float] NOT NULL,
	[CODLOJA] [float] NOT NULL,
	[ID_SALE] [float] NOT NULL,
	[COD_ORIGINAL] [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
	[QUANTIDADE][float] NOT NULL,
	[STATUS] [varchar](15) NOT NULL,
	[OBS] [varchar](250) NOT NULL,
	[D_ENVIO] [datetime] NOT NULL,
	[D_PREV] [datetime] NOT NULL,
	[D_MOUNTING] [datetime] NULL,
	[D_PROCESS] [datetime] NULL,
	[D_MAINTENANCE] [datetime] NULL,
	[DONE][BIT] NULL
 CONSTRAINT [PK_MAINTENANCE] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


