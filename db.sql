CREATE TABLE `users` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT 'photo.jpg',
  `role` enum('admin','user') DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  `passwordConfirm` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `passwordChangedAt` datetime DEFAULT NULL,
  `passwordResetToken` varchar(255) DEFAULT NULL,
  `passwordResetExpires` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) 

CREATE TABLE `books` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `isbn` varchar(255) NOT NULL,
  `available_quantity` smallint unsigned DEFAULT '1',
  `shelf_location` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
) 

 CREATE TABLE `BorrowedBooks` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `book_id` smallint unsigned NOT NULL,
  `borrower_id` smallint unsigned NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `isReturn` tinyint(1) DEFAULT '0',
  `due_date` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `borrower_id` (`borrower_id`),
  CONSTRAINT `BorrowedBooks_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BorrowedBooks_ibfk_2` FOREIGN KEY (`borrower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) 


-- Add Indexes 
ALTER TABLE books ADD INDEX title (title);
ALTER TABLE books ADD INDEX author (author);
ALTER TABLE books ADD INDEX isbn (isbn);
