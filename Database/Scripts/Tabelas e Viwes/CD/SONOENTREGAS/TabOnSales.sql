CREATE TABLE ONSALES(
    id int PRIMARY KEY not null,
    [description] varchar(40) not null,
    dateStart date not null,
    dateFinish date not null,
    idUserCreate float not null foreign key references USERS(ID),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idUserUpdate float not null foreign key references USERS(ID),
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE ONSALES_ITENS(
    idGoal int not null foreign key references ONSALES(id),
    COD_ORIGINAL [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
    valueOnSales float not null
)