USE [SONOENTREGAS]
GO

/****** Object:  Table [dbo].[DELIVERYS_SALES]    Script Date: 06/06/2021 15:39:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DELIVERYS_SALES](
	[ID_DELIVERY] [float] NOT NULL,
	[CODLOJA] [float] NOT NULL,
	[ID_SALE] [float] NOT NULL,
	[POSITION] [float] NULL,
 CONSTRAINT [PK_DELIVERY_SALES] PRIMARY KEY CLUSTERED 
(
	[ID_DELIVERY] ASC,
	[ID_SALE] ASC,
	[CODLOJA] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


