# E-Commerce Spring Boot Application

A comprehensive e-commerce backend application built with Spring Boot, featuring user authentication, product management, order processing, and secure API endpoints.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for products with category management
- **Shopping Cart**: Add/remove items, view cart contents
- **Order Processing**: Create and manage orders with delivery slots
- **Address Management**: User address management for deliveries
- **Image Management**: Product image upload and management
- **Transaction Tracking**: Payment transaction management
- **RESTful API**: Complete REST API with proper HTTP status codes
- **Database Integration**: MySQL database with JPA/Hibernate
- **Security**: Spring Security with CORS configuration

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.5.4
- **Java Version**: 17
- **Database**: MySQL 8.0+
- **Security**: Spring Security with JWT
- **ORM**: Spring Data JPA with Hibernate
- **Build Tool**: Maven
- **Server**: Tomcat (embedded)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Postman** (for API testing)

## 🗄️ Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE eCommerce1;
   ```

2. **Update Database Configuration**:
   Edit `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/eCommerce1
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ecommerce
```

### 2. Build the Project
```bash
mvn clean install
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8085`

## 📚 API Documentation

### Base URL
```
http://localhost:8085/tricto
```

### Authentication Endpoints

#### Register User
```http
POST /tricto/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

#### Login User
```http
POST /tricto/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response**:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /tricto/auth/me
Authorization: Bearer <your-jwt-token>
```

### Product Endpoints

#### Get All Products
```http
GET /tricto/products
Authorization: Bearer <your-jwt-token>
```

#### Get Product by ID
```http
GET /tricto/products/{productId}
Authorization: Bearer <your-jwt-token>
```

#### Create Product
```http
POST /tricto/products
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "productName": "Sample Product",
    "price": 99.99,
    "quantity": 10,
    "categoryId": 1
}
```

#### Update Product
```http
PUT /tricto/products/{productId}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "productName": "Updated Product",
    "price": 89.99,
    "quantity": 15,
    "categoryId": 1
}
```

#### Delete Product
```http
DELETE /tricto/products/{productId}
Authorization: Bearer <your-jwt-token>
```

### Category Endpoints

#### Get All Categories
```http
GET /tricto/categories
Authorization: Bearer <your-jwt-token>
```

#### Create Category
```http
POST /tricto/categories
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "categoryName": "Electronics"
}
```

### Cart Endpoints

#### Add Item to Cart
```http
POST /tricto/cart/add
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "productId": 1,
    "quantity": 2
}
```

#### Get Cart Items
```http
GET /tricto/cart
Authorization: Bearer <your-jwt-token>
```

#### Remove Item from Cart
```http
DELETE /tricto/cart/{cartId}
Authorization: Bearer <your-jwt-token>
```

### Order Endpoints

#### Create Order
```http
POST /tricto/orders
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "deliveryAddress": "123 Main St, City, State",
    "slotId": 1
}
```

#### Get User Orders
```http
GET /tricto/orders
Authorization: Bearer <your-jwt-token>
```

#### Get Order by ID
```http
GET /tricto/orders/{orderId}
Authorization: Bearer <your-jwt-token>
```

### Address Endpoints

#### Add Address
```http
POST /tricto/address
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
}
```

#### Get User Addresses
```http
GET /tricto/address
Authorization: Bearer <your-jwt-token>
```

### Slot Endpoints

#### Get Available Slots
```http
GET /tricto/slots
Authorization: Bearer <your-jwt-token>
```

### Transaction Endpoints

#### Get User Transactions
```http
GET /tricto/transactions
Authorization: Bearer <your-jwt-token>
```

### Image Endpoints

#### Upload Product Image
```http
POST /tricto/images/upload
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

file: <image-file>
productId: 1
```

#### Get Product Images
```http
GET /tricto/images/product/{productId}
Authorization: Bearer <your-jwt-token>
```

## 🔐 Security

### Authentication Flow
1. User registers with email and password
2. User logs in and receives JWT token
3. Include JWT token in `Authorization` header for protected endpoints
4. Token format: `Bearer <jwt-token>`

### Public Endpoints
- `/tricto/auth/register` - User registration
- `/tricto/auth/login` - User login
- `/tricto/message` - Test endpoint

### Protected Endpoints
All other endpoints require authentication with a valid JWT token.

## 🗂️ Project Structure

```
src/main/java/com/cdac/e_commerce/e_commerce/
├── controller/          # REST API controllers
├── model/              # JPA entities
├── ModelDto/           # Data Transfer Objects
├── repository/         # JPA repositories
├── service/            # Business logic services
├── security/           # Security configuration
├── exception/          # Custom exceptions
└── enums/             # Enumeration classes
```

## 🔧 Configuration

### Application Properties
- **Server Port**: 8085
- **Database**: MySQL (eCommerce1)
- **JPA**: Hibernate with auto-update
- **CORS**: Configured for localhost:5173

### Database Schema
The application uses JPA/Hibernate with auto-schema generation. Tables are created automatically based on entity classes.

## 🧪 Testing

### Using Postman
1. Import the API collection (if available)
2. Set up environment variables for base URL and JWT token
3. Test endpoints in the following order:
   - Register user
   - Login to get JWT token
   - Use JWT token for protected endpoints

### Test Endpoints
```http
GET http://localhost:8085/tricto/message
```

## 🐛 Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Ensure you're using the correct endpoint path (`/tricto/...`)
   - Check if JWT token is included in Authorization header
   - Verify token is not expired

2. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `eCommerce1` exists

3. **Port Already in Use**
   - Change server port in `application.properties`
   - Or kill the process using port 8085

## 📝 API Response Format

### Success Response
```json
{
    "data": {...},
    "message": "Success",
    "status": 200
}
```

### Error Response
```json
{
    "error": "Error message",
    "status": 400,
    "timestamp": "2024-01-01T00:00:00"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **CDAC Team** - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Spring Security for robust authentication
- MySQL team for the database 