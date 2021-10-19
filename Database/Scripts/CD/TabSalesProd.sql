USE [SONOENTREGAS]
GO

/****** Object:  Table [dbo].[SALES_PROD]    Script Date: 04/10/2021 10:15:38 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[SALES_PROD](
	[ID_SALES] [float] NOT NULL,
	[CODLOJA] [float] NOT NULL,
	[CODPRODUTO] [float] NOT NULL,
	[COD_ORIGINAL] [varchar](20) NOT NULL,
	[DESCRICAO] [varchar](50) NOT NULL,
	[QUANTIDADE] [float] NOT NULL,
	[UNITARIO1] [float] NOT NULL,
	[DESCONTO] [float] NOT NULL,
	[NVTOTAL] [float] NOT NULL,
	[STATUS] [varchar](15) NOT NULL DEFAULT ('Enviado'),
	[DOWN_EST] [bit] NULL,
 CONSTRAINT [PK_SALES_PROD] PRIMARY KEY CLUSTERED 
(
	[COD_ORIGINAL] ASC,
	[ID_SALES] ASC,
	[CODLOJA] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


