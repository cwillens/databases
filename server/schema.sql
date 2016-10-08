DROP DATABASE chat;

CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  /* Describe your table here.*/
  id int NOT NULL AUTO_INCREMENT,
  message varchar(255) NOT NULL,
  userId int NOT NULL,
  roomId int NOT NULL,
  createdAt datetime NOT NULL,
  PRIMARY KEY(id)
);

/* Create other tables and define schemas for them here! */
CREATE TABLE users (
  /* Describe your table here.*/
  id int NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE rooms (
  /* Describe your table here.*/
  id int NOT NULL AUTO_INCREMENT,
  roomname varchar(255) NOT NULL,
  PRIMARY KEY(id)
);


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

