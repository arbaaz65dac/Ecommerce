# TRICTO E-COMMERCE PLATFORM - PROJECT DOCUMENTATION

## **Table of Contents**
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Setup Instructions](#setup-instructions)
5. [Features & Functionality](#features--functionality)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Security Implementation](#security-implementation)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

---

## **1. PROJECT OVERVIEW**

### **1.1 Project Description**
Tricto is a modern e-commerce platform that implements a unique slot-based discount system. The platform allows customers to purchase products at discounted rates based on available time slots, creating a dynamic pricing model that encourages timely purchases.

### **1.2 Key Features**
- **Slot-Based Discount System**: Dynamic pricing based on time slots
- **Google OAuth Integration**: Secure social login functionality
- **Admin Panel**: Comprehensive product and slot management
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Live slot availability tracking
- **Secure Authentication**: JWT-based authentication system

### **1.3 Project Goals**
- **Primary**: Implement a slot-based discount e-commerce system
- **Secondary**: Provide seamless user experience with modern UI/UX
- **Tertiary**: Ensure scalability and maintainability

---

## **2. SYSTEM ARCHITECTURE**

### **2.1 High-Level Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Spring Boot) │◄──►│   (MySQL)       │
│   - Redux       │    │   - JPA/Hibernate│    │   - eCommerce1  │
│   - Tailwind    │    │   - Security    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **2.2 Frontend Architecture**
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── sections/           # Large UI sections
├── slices/             # Redux state management
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── assets/             # Static assets
```

### **2.3 Backend Architecture**
```
src/main/java/com/cdac/e_commerce/e_commerce/
├── controller/         # REST API endpoints
├── service/           # Business logic
├── repository/        # Data access layer
├── model/             # JPA entities
├── ModelDto/          # Data transfer objects
├── security/          # Authentication & authorization
├── exception/         # Custom exceptions
└── enums/             # Enumeration classes
```

---

## **3. TECHNOLOGY STACK**

### **3.1 Frontend Technologies**
- **React 18**: Modern UI library
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **@react-oauth/google**: Google OAuth integration

### **3.2 Backend Technologies**
- **Spring Boot 3.5.4**: Application framework
- **Spring Security**: Authentication & authorization
- **Spring Data JPA**: Data access layer
- **Hibernate**: ORM framework
- **MySQL**: Database
- **JWT**: Token-based authentication
- **Google API Client**: OAuth verification

### **3.3 Development Tools**
- **Maven**: Build tool
- **Node.js**: JavaScript runtime
- **npm**: Package manager
- **Git**: Version control

---

## **4. SETUP INSTRUCTIONS**

### **4.1 Prerequisites**
```bash
# Required software
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
```

### **4.2 Database Setup**
```sql
-- Create database
CREATE DATABASE eCommerce1;
USE eCommerce1;
```

### **4.3 Backend Setup**
```bash
# Navigate to backend directory
cd Ecommerce

# Install dependencies
./mvnw clean install

# Configure application.properties
# Update database credentials and Google OAuth client ID

# Start backend server
./mvnw spring-boot:run
```

### **4.4 Frontend Setup**
```bash
# Navigate to frontend directory
cd /Users/yogeshkadam/Desktop/Frontend

# Install dependencies
npm install

# Install additional dependencies
npm install @react-oauth/google react-redux

# Start development server
npm run dev
```

### **4.5 Google OAuth Setup**
1. Create Google Cloud Console project
2. Enable Google Identity API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost:5173`
   - `http://localhost:5174`
   - `http://localhost:5175`
   - `http://localhost:5176`
   - `http://localhost:5177`
   - `http://localhost:3000`
6. Update client ID in `application.properties` and `main.jsx`

---

## **5. FEATURES & FUNCTIONALITY**

### **5.1 User Features**
- **Product Browsing**: View products with images and details
- **Slot-Based Purchasing**: Buy products at discounted rates
- **Google OAuth Login**: Secure social authentication
- **Shopping Cart**: Add/remove items
- **Order Management**: Track order status
- **User Profile**: Manage personal information

### **5.2 Admin Features**
- **Product Management**: CRUD operations for products
- **Slot Management**: Configure discount slots
- **Order Management**: View and manage orders
- **Category Management**: Organize products
- **User Management**: Monitor user activities

### **5.3 Slot System**
- **Dynamic Pricing**: Discounts based on time slots
- **Slot Capacity**: Limited slots per product
- **Real-time Updates**: Live slot availability
- **Automatic Cleanup**: Expired slot management

---

## **6. API DOCUMENTATION**

### **6.1 Authentication Endpoints**
```http
POST /tricto/auth/register
POST /tricto/auth/login
POST /tricto/auth/google
GET  /tricto/auth/me
```

### **6.2 Product Endpoints**
```http
GET    /tricto/products
GET    /tricto/products/{id}
POST   /tricto/products
PUT    /tricto/products/{id}
DELETE /tricto/products/{id}
```

### **6.3 Slot Endpoints**
```http
GET    /tricto/slots
GET    /tricto/slots/{id}
POST   /tricto/slots
PUT    /tricto/slots/{id}
DELETE /tricto/slots/{id}
```

### **6.4 Order Endpoints**
```http
GET    /tricto/orders
GET    /tricto/orders/{id}
POST   /tricto/orders
PUT    /tricto/orders/{id}
```

### **6.5 Request/Response Examples**

#### **Register User**
```json
POST /tricto/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### **Login Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

## **7. DATABASE SCHEMA**

### **7.1 Core Tables**

#### **Users Table**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Products Table**
```sql
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

#### **Slots Table**
```sql
CREATE TABLE slot (
    slot_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    discount_percentage INT NOT NULL,
    max_slot_size INT NOT NULL,
    current_slot_size INT DEFAULT 0,
    is_full BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

#### **Orders Table**
```sql
CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **7.2 Relationships**
- **Products** ↔ **Categories** (Many-to-One)
- **Products** ↔ **ProductImages** (One-to-Many)
- **Products** ↔ **Slots** (One-to-Many)
- **Users** ↔ **Orders** (One-to-Many)
- **Orders** ↔ **OrderItems** (One-to-Many)

---

## **8. SECURITY IMPLEMENTATION**

### **8.1 Authentication**
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: BCrypt encryption
- **Google OAuth**: Social login integration
- **Role-based Access**: USER and ADMIN roles

### **8.2 Authorization**
```java
// Security configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Permit public endpoints
    .antMatchers("/tricto/auth/**").permitAll()
    .antMatchers("/tricto/products/**").permitAll()
    
    // Require authentication for admin endpoints
    .antMatchers("/tricto/admin/**").hasRole("ADMIN")
}
```

### **8.3 CORS Configuration**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5177"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
}
```

---

## **9. DEPLOYMENT GUIDE**

### **9.1 Production Environment**
```bash
# Backend deployment
./mvnw clean package
java -jar target/e-commerce-0.0.1-SNAPSHOT.jar

# Frontend deployment
npm run build
# Deploy dist/ folder to web server
```

### **9.2 Environment Variables**
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/eCommerce1
spring.datasource.username=root
spring.datasource.password=Yoisbest@1999

# Google OAuth
google.oauth.client-id=721991805686-4v50m3kc0us55nflml2doqh2fq9pnulg.apps.googleusercontent.com

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000
```

### **9.3 Docker Deployment**
```dockerfile
# Backend Dockerfile
FROM openjdk:17-jdk-slim
COPY target/e-commerce-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## **10. TROUBLESHOOTING**

### **10.1 Common Issues**

#### **Port Already in Use**
```bash
# Kill processes on specific ports
lsof -ti:8085 | xargs kill -9
lsof -ti:5173,5174,5175,5176,5177,3000 | xargs kill -9
```

#### **Database Connection Issues**
```bash
# Check MySQL service
sudo service mysql status
sudo service mysql start

# Test connection
mysql -u root -p
```

#### **Google OAuth Errors**
- **401 invalid_client**: Check client ID configuration
- **401 no registered origin**: Add frontend URL to authorized origins
- **403 access blocked**: Verify OAuth consent screen configuration

#### **Frontend Build Issues**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Install missing dependencies
npm install @react-oauth/google react-redux
```

### **10.2 Log Analysis**
```bash
# Backend logs
tail -f Ecommerce/logs/application.log

# Frontend logs
# Check browser console for errors
```

### **10.3 Performance Optimization**
- **Database Indexing**: Add indexes on frequently queried columns
- **Caching**: Implement Redis for session management
- **CDN**: Use CDN for static assets
- **Compression**: Enable gzip compression

---

## **11. DEVELOPMENT WORKFLOW**

### **11.1 Code Standards**
- **Java**: Follow Google Java Style Guide
- **JavaScript**: Use ESLint and Prettier
- **CSS**: Follow Tailwind CSS conventions
- **Git**: Use conventional commit messages

### **11.2 Testing Strategy**
```bash
# Backend tests
./mvnw test

# Frontend tests
npm test

# Integration tests
./mvnw verify
```

### **11.3 Code Review Checklist**
- [ ] Code follows style guidelines
- [ ] Tests are written and passing
- [ ] Security considerations addressed
- [ ] Performance impact evaluated
- [ ] Documentation updated

---

## **12. MAINTENANCE & MONITORING**

### **12.1 Regular Tasks**
- **Database Backup**: Daily automated backups
- **Log Rotation**: Weekly log cleanup
- **Security Updates**: Monthly dependency updates
- **Performance Monitoring**: Real-time metrics

### **12.2 Monitoring Tools**
- **Application Metrics**: Spring Boot Actuator
- **Database Monitoring**: MySQL Workbench
- **Frontend Monitoring**: Browser DevTools
- **Error Tracking**: Custom exception handling

---

## **13. FUTURE ENHANCEMENTS**

### **13.1 Planned Features**
- **Payment Integration**: Stripe/PayPal integration
- **Email Notifications**: Order status updates
- **Mobile App**: React Native application
- **Analytics Dashboard**: Sales and user analytics
- **Multi-language Support**: Internationalization

### **13.2 Technical Improvements**
- **Microservices**: Break down into smaller services
- **Message Queue**: Redis/RabbitMQ for async processing
- **Caching Layer**: Redis for performance optimization
- **API Gateway**: Centralized API management

---

## **14. CONTACT & SUPPORT**

### **14.1 Development Team**
- **Project Lead**: Yogesh Kadam
- **Backend Developer**: Spring Boot Specialist
- **Frontend Developer**: React Specialist
- **Database Administrator**: MySQL Expert

### **14.2 Resources**
- **GitHub Repository**: [Project Repository]
- **Documentation**: [Project Wiki]
- **Issue Tracking**: [GitHub Issues]
- **API Documentation**: [Swagger UI]

---

## **15. APPENDIX**

### **15.1 Useful Commands**
```bash
# Start all services
./start-services.sh

# Stop all services
./stop-services.sh

# Database migration
./mvnw flyway:migrate

# Generate API documentation
./mvnw springdoc:generate
```

### **15.2 Configuration Files**
- `application.properties`: Backend configuration
- `vite.config.js`: Frontend build configuration
- `tailwind.config.js`: CSS framework configuration
- `package.json`: Node.js dependencies
- `pom.xml`: Maven dependencies

### **15.3 Third-Party Services**
- **Google Cloud Console**: OAuth configuration
- **MySQL Database**: Data persistence
- **Vite Dev Server**: Frontend development
- **Spring Boot**: Backend framework

---

**Document Version**: 1.0  
**Last Updated**: August 5, 2025  
**Maintained By**: Development Team 