## Project Title: IMS (Inventory Management System)

### Description:
IMS (Inventory Management System) is a backend application built for managing inventory-related tasks. It provides various functionalities such as user management, authentication, CRUD operations on inventory items, and more.

### Setup Instructions:
1. Clone the code from the GitHub repository.
2. Create a `.env` file in the root directory of the project.
3. Add the following environment variables to the `.env` file:
    ```
    PORT=4500
    MONGO=mongodb+srv://enterct35i:Ya20161913@cluster0.sx2cj4u.mongodb.net/IMS?retryWrites=true&w=majority
    JWT_SECRET=shdakhjksdkahdsjka@@33ttu
    JWT_LIFETIME=1d
    EMAIL_USER=enterct35i@gmail.com
    EMAIL_PASS=eivj sueg qdqg zmsl
    ```
4. Install package dependencies using `npm install`.
5. Start the server using the command `npm start`.

### Authentication and Authorization:
In order to access the full functionality of the IMS, you need to log in with the admin credentials:

- Email: `chap@gmail.com`
- Password: `Ya20161913@`

Once logged in, you will be able to access all of the endpoints.

### Swagger Documentation:
You can access the Swagger documentation for all API endpoints by clicking [here](http://localhost:4500/api-docs/#/).

### Additional Resources:
- Postman Collection: [IMS API Postman Collection](https://documenter.getpostman.com/view/23870514/2sA35EZi62)
  - You can use this collection to execute various APIs and test different functionalities of the IMS application.

### Contributors:
- Yeabsira Ashenafi
- enterct35i@gmail.com
- +251930795682


### Explanation of the Code:

#### `register` Function:
- This function is responsible for registering new users by the admin.
- It expects the `fullname`, `email`, `password`, and `role` in the request body.
- It validates the input fields such as checking if all required fields are provided, validating email format, and password format.
- It checks if the email already exists in the database.
- If all validations pass and the user is authorized as an admin, it creates a new user using the `User.create` method and saves it to the database.
- Finally, it returns a JSON response with the created user data and a status code of 201 (Created). If any error occurs, it returns a status code of 500 (Internal Server Error).


#### `registeremployee` Function:
- Similar to the `register` function but specifically designed for registering employees.
- It expects `fullname`, `email`, and `password` in the request body.
- It does not require the `role` field as it assumes the role to be "employee".
- It performs similar validation and user creation steps as the `register` function.
- Additionally, it generates a JWT token for the user, attaches it to the response cookies, and returns a status code of 201 (Created) upon successful registration.

#### `signin` Function:
- Handles user authentication.
- Expects `email` and `password` in the request body.
- Checks if the user exists in the database and if the provided password matches the stored password using bcrypt.
- If authentication is successful, it generates a JWT token for the user, attaches it to the response cookies, and returns the user data along with a status code of 200 (OK).
- If authentication fails (incorrect email or password), it returns a status code of 401 (Unauthorized).

#### `logout` Function:
- Handles user logout by clearing the token from the cookies.
- Sets a "logout" token in the cookies with a short expiration time.
- Returns a success message along with a status code of 200 (OK).

#### `forgotPassword` Function:
- Handles the forgot password functionality.
- Expects an `email` in the request body.
- Finds the user with the provided email address and sends a password reset link to the user's email using Nodemailer.
- Generates a JWT token containing the user's email address and sends it as a query parameter in the password reset link.
- Returns a success message upon successfully sending the email.
- If the user is not found or an error occurs, it returns an appropriate error response.

#### `ResetPassword` Function:
- Handles the password reset process.
- Expects `newPassword` and `email` in the request body.
- Hashes the new password using bcrypt.
- Finds the user with the provided email address and updates their password in the database.
- Returns a success message if the password is reset successfully.
- If the user is not found or an error occurs, it returns an appropriate error response.

These functions collectively handle user registration, authentication, logout, and password management functionalities in the IMS application. They incorporate validation, user data manipulation, token generation, and error handling to ensure smooth operation of the application.


### Explanation of the Inventory Controller:

#### `createInventoryItem` Function:
- Creates a new inventory item.
- Expects `name`, `description`, `quantity`, `price`, and `category` in the request body.
- Associates the inventory item with the user who created it by storing the user's ID (`userId`) in the item.
- Saves the newly created inventory item to the database and returns it with a status code of 201 (Created).
- If any error occurs during the process, it returns a status code of 500 (Internal Server Error).

#### `getAllInventoryItems` Function:
- Retrieves all inventory items from the database.
- Returns an array of inventory items as a JSON response.

#### `getInventoryItemById` Function:
- Retrieves a specific inventory item by its ID.
- Expects the item ID as a request parameter (`id`).
- Returns the inventory item with the provided ID as a JSON response.
- If the item is not found, it returns a status code of 404 (Not Found).

#### `getCurrentInventoryItems` Function:
- Retrieves all inventory items with a quantity greater than zero.
- Populates the `movementTypes` field of each inventory item to filter by specific movement types such as "purchase", "return", or "sale".

#### `getAllSoldItems` Function:
- Retrieves all inventory items with a quantity equal to zero, indicating they have been sold.
- Populates the `movementTypes` field to filter by the "sale" movement type.

#### `updateInventoryItem` Function:
- Updates an existing inventory item by its ID.
- Expects the item ID as a request parameter (`id`) and the updated item details in the request body.
- Returns the updated inventory item as a JSON response.

#### `setThresholdsForAllItem` Function:
- Sets minimum and maximum thresholds for all inventory items.
- Expects `minThreshold` and `maxThreshold` in the request body.
- Updates all inventory items in the database with the provided thresholds.
- Returns a success message upon updating the thresholds.

#### `deleteInventoryItem` Function:
- Deletes an inventory item by its ID.
- Expects the item ID as a request parameter (`id`).
- Deletes the inventory item from the database and returns a success message.

#### `InventorySearch` Function:
- Performs a search query on the inventory items based on their name.
- Expects the `name` to search for in the request body.
- Utilizes MongoDB's text search feature to find matching items by name.
- Returns the search results as a JSON response.

These functions collectively handle various operations related to inventory items such as creation, retrieval, updating, and deletion, along with search functionality.


### Explanation of the Stock Movement Controller:

This controller manages the creation, retrieval, updating, and deletion of stock movements, which represent changes in inventory quantity due to various actions such as purchases, sales, and returns.

#### `createStockMovement` Function:
- Handles the creation of new stock movements based on the provided data in the request body.
- It calculates the updated quantity of the corresponding inventory item based on the movement type (purchase, sale, or return) and the quantity involved.
- If the movement type is "sale", it checks if the quantity to be sold exceeds the available quantity in stock and returns a 400 status code with an appropriate error message if it does.
- Updates the inventory item's quantity accordingly.
- Saves the new stock movement and the updated inventory item to the database.
- Returns a JSON response with the saved movement and the updated inventory item.

#### `getAllStockMovements` Function:
- Retrieves all stock movements from the database.
- Returns a JSON response containing all stock movements.

#### `getStockMovementById` Function:
- Retrieves a specific stock movement by its ID from the database.
- If the stock movement is not found, it returns a 404 status code with an appropriate error message.
- Returns a JSON response containing the retrieved stock movement.

#### `updateStockMovement` Function:
- Updates a specific stock movement based on the provided ID and request body data.
- Returns a JSON response containing the updated stock movement.

#### `deleteStockMovement` Function:
- Deletes a specific stock movement from the database based on the provided ID.
- Returns a JSON response confirming the successful deletion of the stock movement.

#### Helper Modules:
- `InventoryItem` and `StockMovement`: Models representing inventory items and stock movements respectively, used for fetching data from the database.

This controller facilitates the management of stock movements, allowing for effective tracking and updating of inventory quantities.


### Explanation of the Report Generation and Emailing Controller:

This controller handles the generation and emailing of reports containing inventory item details.

#### `generateAndSendReport` Function:
- Retrieves inventory items and stock movements from the database.
- Generates an HTML table containing details of each inventory item, including sales, purchases, returns, purchase orders, total quantity, and total price.
- Creates a transporter using Nodemailer for sending email notifications.
- Prepares email options including the report content generated earlier.
- Sends the email to the recipient specified in the request body.
- Upon successful sending of the email, it returns a JSON response with a status code of 200 (OK) and a success message.
- If any error occurs during the process, it returns a status code of 500 (Internal Server Error) along with an error message.

#### Helper Functions and Modules:
- `nodemailer`: Used for sending emails with SMTP transport.
- `InventoryItem` and `StockMovement`: Models representing inventory items and stock movements respectively.
- These models are used to fetch data from the database for report generation.

This controller efficiently generates and emails reports containing detailed information about inventory items, aiding in inventory management and analysis.


### Explanation of the Notification System Controller:

This controller handles the functionality related to sending email notifications for low and high inventory items.

#### `createEmail` Function:
- Creates a new email address entry in the database.
- It expects the email address to be provided in the request body.
- Upon successful creation, it returns a JSON response with a status code of 201 (Created).
- In case of any error during the creation process, it returns a status code of 500 (Internal Server Error) along with an error message.

#### Notification Functions:
- `sendLowInventoryNotification`: Sends notification emails when inventory quantity is below the minimum threshold.
- `sendHighInventoryNotification`: Sends notification emails when inventory quantity exceeds the maximum threshold.
- Both functions take the email address and the respective inventory items as parameters.
- They create a transporter using Nodemailer and send an email containing a table with the relevant inventory items.

#### Helper Functions:
- `generateTableHTML`: Generates an HTML table containing inventory item details.
- `checkThresholdsAndSendNotifications`: Checks inventory thresholds and sends notifications accordingly.
- This function is scheduled to run daily using the `node-cron` library (`cron.schedule('0 0 * * *', ...)`) to ensure timely notifications.
- It fetches all inventory items, filters them based on thresholds, fetches registered email addresses, and sends notifications if necessary.

This controller efficiently manages inventory notifications by regularly checking thresholds and sending notifications to registered email addresses.


### Explanation of the Notification System Controller:

This controller handles the functionality related to sending email notifications for low and high inventory items.

#### `createEmail` Function:
- Creates a new email address entry in the database.
- It expects the email address to be provided in the request body.
- Upon successful creation, it returns a JSON response with a status code of 201 (Created).
- In case of any error during the creation process, it returns a status code of 500 (Internal Server Error) along with an error message.

#### Notification Functions:
- `sendLowInventoryNotification`: Sends notification emails when inventory quantity is below the minimum threshold.
- `sendHighInventoryNotification`: Sends notification emails when inventory quantity exceeds the maximum threshold.
- Both functions take the email address and the respective inventory items as parameters.
- They create a transporter using Nodemailer and send an email containing a table with the relevant inventory items.

#### Helper Functions:
- `generateTableHTML`: Generates an HTML table containing inventory item details.
- `checkThresholdsAndSendNotifications`: Checks inventory thresholds and sends notifications accordingly.
- This function is scheduled to run daily using the `node-cron` library (`cron.schedule('0 0 * * *', ...)`) to ensure timely notifications.
- It fetches all inventory items, filters them based on thresholds, fetches registered email addresses, and sends notifications if necessary.

This controller efficiently manages inventory notifications by regularly checking thresholds and sending notifications to registered email addresses.


### Explanation of the User Controller:

This controller handles user-related operations such as retrieving user data, updating user information, deleting users, and updating user passwords.

#### `getAllUsers` Function:
- Retrieves all users from the database.
- Returns a JSON response containing all users.

#### `getUserById` Function:
- Retrieves a specific user by their ID from the database.
- If the user is not found, it returns a 404 status code with an appropriate error message.
- Returns a JSON response containing the retrieved user.

#### `deleteuser` Function:
- Deletes a specific user from the database based on the provided ID.
- If no user is found with the provided ID, it returns a 400 status code with an appropriate error message.
- Returns a JSON response confirming the successful deletion of the user.

#### `updateUser` Function:
- Handles updating user information based on the provided request body data.
- Checks if at least one property (fullname or email) is provided in the request body.
- Updates user properties if provided in the request body.
- Saves the updated user to the database.
- Creates a new tokenUser with the updated user information and attaches cookies to the response.
- Returns a JSON response containing the updated user information.

#### `updateUserPassword` Function:
- Handles updating the user's password.
- Validates that both the old and new passwords are provided in the request body.
- Checks if the old password matches the user's current password.
- Updates the user's password to the new password provided.
- Returns a JSON response indicating the success of the password update.

#### Helper Modules:
- `User`: Model representing users, used for fetching user data from the database.
- `CustomError`: Custom error handler module for handling specific error types.
- `http-status-codes`: Module providing HTTP status codes for response handling.
- `createTokenUser`, `attachCookiesToResponse`: Utility functions for creating token users and attaching cookies to the response.

This controller manages user-related functionalities, including user retrieval, deletion, updating, and password modification.
