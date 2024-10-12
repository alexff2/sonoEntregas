CREATE TABLE RETURNS_SALES (
  id INT PRIMARY KEY,
  dateSend DATETIME NOT NULL,
  originalReturnId INT NOT NULL,
  shopId INT NOT NULL,
  originalSaleId INT NOT NULL,
  client VARCHAR(60) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
  street VARCHAR(60) NOT NULL,
  houseNumber CHAR(15) NOT NULL,
  district VARCHAR(30) NOT NULL,
  city VARCHAR(25) NOT NULL,
  state VARCHAR(25) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  status VARCHAR(10) NOT NULL,
  deliveryId INT,
)

CREATE UNIQUE INDEX idOriginalReturnIdShopIdOriginalSaleId ON RETURNS_SALES (originalReturnId ASC, shopId ASC, originalSaleId ASC)

CREATE TABLE RETURNS_SALES_PRODUCTS (
  id INT PRIMARY KEY,
  returnsSalesId INT NOT NULL FOREIGN KEY REFERENCES RETURNS_SALES(id),
  alternativeCode [varchar](20) COLLATE SQL_Latin1_General_CP850_CI_AI NOT NULL,
  quantity INT NOT NULL
)

CREATE UNIQUE INDEX idReturnsSalesIdProductId ON RETURNS_SALES_PRODUCTS (returnsSalesId ASC, alternativeCode ASC)
