# TODO

## For Books:

- [] Add a book with details like title, author, ISBN, available quantity, and shelf location.
- [] Update a book's details.
- [] Delete a book.
- [] List all books.
- [] Search for a book by title, author, or ISBN.

## For Borrowers:

- [] Register a borrower with details like name, email, and registered date (keep user details simple).
- [] Update borrower's details.
- [] Delete a borrower.
- [] List all borrowers.

## Borrowing Process:

- [] A borrower can check out a book. The system should keep track of which books are checked out and by whom.
- [] A borrower can return a book.
- [] A borrower can check the books they currently have.
- [] The system should keep track of due dates for the books and list books that are overdue.

> Ensure that user inputs are validated to prevent SQL injection or other potential security threats.

## Bonus Features (Ordered descending by value):

- [] Analytical reports of the borrowing process in a specific period and export the data in CSV or Xlsx sheet formats.
- [] Export all overdue borrows of the last month.
- [] Export all borrowing processes of the last month.
- [] Implement rate limiting for the API to prevent abuse (choose two endpoints for rate limiting).
- [] Dockerize the application using docker-compose.
- [] Implement basic authentication for the API.
- [] Add unit tests (for at least one module).

> Error Handling: Gracefully handle errors and provide meaningful feedback.
