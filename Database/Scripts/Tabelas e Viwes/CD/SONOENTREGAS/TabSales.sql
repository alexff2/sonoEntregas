USE [SONOENTREGAS]
GO

/****** Object:  Table [dbo].[SALES]    Script Date: 20/01/2022 16:20:22 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[SALES](
	[ID] [float] NOT NULL,
	[ID_SALES] [float] NOT NULL,
	[CODLOJA] [float] NOT NULL,
	[ID_CLIENT] [float] NOT NULL,
	[NOMECLI] [varchar](60) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
	[TOTAL_PROD] [float] NOT NULL,
	[DESCONTO] [float] NULL,
	[TOTAL] [float] NOT NULL,
	[EMISSAO] [datetime] NOT NULL,
	[STATUS] [varchar](15) NOT NULL,
	[ENDERECO] [varchar](60) NULL,
	[NUMERO] [varchar](50) NULL,
	[BAIRRO] [varchar](40) NULL,
	[CIDADE] [varchar](25) NULL,
	[ESTADO] [char](2) NULL,
	[PONTOREF] [varchar](250) NULL,
	[OBS] [varchar](250) NULL,
	[D_ENTREGA2] [datetime] NULL,
	[USER_ID] [float] NOT NULL,
	[D_ENTREGA1] [datetime] NOT NULL,
	[D_ENVIO] [datetime] NOT NULL,
	[VENDEDOR] [varchar](30) NOT NULL,
	[FONE] [varchar](15) NULL,
	[CGC_CPF] [varchar](19) NULL,
	[INS_RG] [varchar](18) NULL,
	[FAX] [varchar](15) NULL,
	[O_V] [char](1) NULL,
	[OBS2] [varchar](250) NULL,
	[HAVE_OBS2] [bit] NULL,
	[SCHEDULED] [bit] NOT NULL DEFAULT ((0)),
	[OBS_SCHEDULED] [varchar](250) NULL,
 CONSTRAINT [PK_SALES] PRIMARY KEY CLUSTERED 
(
	[CODLOJA] ASC,
	[ID_SALES] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


