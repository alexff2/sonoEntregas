USE [SONOENTREGAS]
GO

CREATE TABLE [dbo].[DELIVERYS](
	[ID] [int] NOT NULL PRIMARY KEY,
	[DESCRIPTION] [varchar](30) NOT NULL,
	[ID_CAR] [int] NOT NULL,
	[ID_ASSISTANT] [int] NOT NULL,
	[ID_DRIVER] [int] NOT NULL,
	[STATUS] [varchar](15) NOT NULL,
	[OBS] [varchar](255),
	[ID_USER_MOUNT] [int] NOT NULL,
	[dateCreated] [dateTime] NOT NULL,
	[D_MOUNTING] [date] NOT NULL,
	[ID_USER_DELIVERING] [int],
	[dateUpdateDelivering] [datetime],
	[D_DELIVERING] [date],
	[ID_USER_DELIVERED] [int],
	[dateUpdateDelivered] [datetime],
	[D_DELIVERED] [date]
)
