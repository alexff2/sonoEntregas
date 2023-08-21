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

CREATE TABLE ONSALES_PRODUCTS(
    idOnSale int not null foreign key references ONSALES(id),
    COD_ORIGINAL [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
    valueOnSales float not null
)

CREATE UNIQUE INDEX IDX_ONSALES_PRODUCTS ON ONSALES_PRODUCTS(idOnSale DESC, [COD_ORIGINAL] DESC)

CREATE TABLE ONSALES_PRODUCTS_SOLD(
    idOnSale int not null foreign key references ONSALES(id),
    idEmployee float not null foreign key references EMPLOYEES(id),
    COD_ORIGINAL [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
    quantify int not null,
    returnedQuantify int not null
)