CREATE TABLE FORECAST (
	id int PRIMARY KEY,
	[date] date NOT NULL,
	[status] bit,
	idUserCreated float NOT NULL FOREIGN KEY REFERENCES USERS(ID),
	idUserFinished float NULL FOREIGN KEY REFERENCES USERS(ID),
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
ALTER TABLE FORECAST ADD description VARCHAR(15)
