CREATE TABLE PROMOTIONS(
    id int PRIMARY KEY not null,
    [description] varchar(40) not null,
    dateStart date not null,
    dateFinish date not null,
    idUserCreate float not null foreign key references USERS(ID),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idUserUpdate float not null foreign key references USERS(ID),
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE PRODUCTS_PROMOTIONS(
    idPromotion int not null foreign key references PROMOTIONS(id),
    idProduct [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
    pricePromotion float not null
)
CREATE UNIQUE INDEX IDX_PRODUCTS_PROMOTIONS ON PRODUCTS_PROMOTIONS(idPromotion DESC, idProduct DESC)

CREATE TABLE SELLER (
    id int not null PRIMARY KEY,
    description varchar(40) not null
)

CREATE TABLE PRODUCTS_SOLD (
    idShop int not null foreign key references LOJAS(CODLOJA),
    idSale INT NOT NULL,
    idSeller  int not null foreign key references SELLER(id),
    item INT NOT NULL,
    idProduct  varchar(20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
    issuance DATE NOT NULL,
    quantify  INT NOT NULL,
    unitPrice1  FLOAT NOT NULL,
    unitPrice2  FLOAT NOT NULL,
    amount  FLOAT NOT NULL,
    discount  FLOAT NOT NULL,
    increase  FLOAT NOT NULL,
    purchasePrice  FLOAT NOT NULL,
    purchaseCost  FLOAT NOT NULL,
    netPrice  FLOAT NOT NULL,
    salePrice  FLOAT NOT NULL,
    deliveryStatus VARCHAR(15)
)
CREATE UNIQUE INDEX IDX_PRODUCTS_SOLD ON PRODUCTS_SOLD(idShop DESC, idSale DESC, idSeller DESC, item DESC)
