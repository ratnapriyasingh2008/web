CREATE DATABASE myapp;

USE myapp;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100)
);

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);