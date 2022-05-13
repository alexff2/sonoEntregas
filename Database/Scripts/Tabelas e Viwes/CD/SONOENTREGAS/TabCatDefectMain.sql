USE [SONOENTREGAS]
GO

/****** Object:  Table [dbo].[CAT_DEFECT_MAIN]    Script Date: 04/04/2022 16:20:52 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[CAT_DEFECT_MAIN](
	[ID] [float] NOT NULL,
	[DESCRIPTION] [varchar](30) NOT NULL,
 CONSTRAINT [PK_CAT_DEFECT_MAIN] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


INSERT CAT_DEFECT_MAIN
VALUES (1,'Espuma deformada'),
(2,'Tecido manchado/mofado'),
(3,'Tecido rasgado/esgar�ado'),
(4,'Fetim descosturado/solto'),
(5,'Estrutura de maideira quebrada'),
(6,'Estrutura de molas deformadas'),
(7,'Espiral solto'),
(8,'Fora de medida'),
(9,'P�s/Rod�zio quebrados'),
(10,'Falhas de bordas'),
(11,'Aro amassado'),
(12,'Tampo descolado'),
(13,'Molas sem aro'),
(14, 'OUTROS')