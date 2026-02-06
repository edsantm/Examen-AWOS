-- Eliminamos tablas si existen
DROP TABLE IF EXISTS fines;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS copies;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS members;

-- Tabla de socios de la biblioteca
CREATE TABLE members (
    id SERIAL PRIMARY KEY,          
    name TEXT NOT NULL,          
    email TEXT UNIQUE NOT NULL,     
    member_type TEXT NOT NULL,      
    joined_at DATE NOT NULL        
);

-- Tabla de libros 
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,           
    author TEXT NOT NULL,          
    category TEXT NOT NULL,         
    isbn TEXT UNIQUE NOT NULL       
);

-- Copias físicas de los libros
CREATE TABLE copies (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id), 
    barcode TEXT UNIQUE NOT NULL,             
    status TEXT NOT NULL                       
);

-- Préstamos de libros
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    copy_id INT NOT NULL REFERENCES copies(id),   
    member_id INT NOT NULL REFERENCES members(id),
    loaned_at DATE NOT NULL,                      
    due_at DATE NOT NULL,                        
    returned_at DATE                       
);

-- Multas asociadas a un préstamo
CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    loan_id INT NOT NULL REFERENCES loans(id),
    amount NUMERIC(10,2) NOT NULL,              
    paid_at DATE                                
);

