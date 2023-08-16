CREATE TABLE GOALS(
    id int PRIMARY KEY not null,
    idShop int not null foreign key references LOJAS(CODLOJA),
    [monthYear] varchar(7) not null,
    value float not null,
    amountReached float not null DEFAULT 0,
    amountReturns float not null DEFAULT 0,
    idUserCreate float not null foreign key references USERS(ID),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idUserUpdate float not null foreign key references USERS(ID),
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE UNIQUE INDEX IDX_GOALS ON GOALS(idShop DESC, [monthYear] DESC)
