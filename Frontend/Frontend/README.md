# E-Commerce Platform

A full-stack e-commerce application built with React (Frontend) and Spring Boot (Backend) featuring product management, discount slots, and admin functionality.

## 🚀 Features

### Frontend (React + Redux)
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Product Management**: Admin panel for adding, editing, and deleting products
- **Slot Management**: Multiple discount tiers per product with capacity tracking
- **Authentication**: JWT-based authentication with mock fallback for development
- **State Management**: Redux Toolkit for centralized state management
- **Real-time Updates**: Dynamic product and slot data updates

### Backend (Spring Boot + JPA)
- **RESTful APIs**: Complete CRUD operations for products, slots, and categories
- **Security**: JWT-based authentication with Spring Security
- **Database**: MySQL with JPA/Hibernate for data persistence
- **Slot System**: Advanced discount tier management with capacity tracking
- **Image Management**: Support for multiple product images
- **CORS Configuration**: Cross-origin resource sharing for frontend integration

## 🏗️ Architecture

```
Frontend (React)          Backend (Spring Boot)
├── Components            ├── Controllers
│   ├── AdminProducts     │   ├── ProductController
│   ├── Auth             │   ├── SlotController
│   └── UI Components    │   └── AuthController
├── Redux Store          ├── Services
│   ├── authSlice        │   ├── ProductService
│   ├── slotsSlice       │   └── SlotService
│   └── cartSlice        ├── Models
└── Pages                │   ├── Products
    ├── Admin            │   ├── Slot
    ├── Shop             │   └── User
    └── Checkout         └── Security
```

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **Java** (JDK 17 or higher)
- **MySQL** (v8.0 or higher)
- **Maven** (v3.6 or higher)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Frontend
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd Ecommerce

# Start Spring Boot application
./mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8085`

### 4. Database Configuration

Update the database configuration in `Ecommerce/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🔧 Configuration

### Frontend Configuration

The frontend is configured to connect to the backend API at `http://localhost:8085`. You can modify the API base URL in the following files:

- `src/slices/authSlice.js`
- `src/slices/slotsSlice.js`
- `src/pages/AdminProducts.jsx`

### Backend Configuration

Key configuration files:

- `application.properties`: Database and server configuration
- `SecurityConfig.java`: Authentication and authorization rules
- `CorsFilter`: Cross-origin resource sharing settings

## 📚 API Documentation

### Authentication Endpoints

```
POST /tricto/auth/login     - User login
POST /tricto/auth/register  - User registration
```

### Product Endpoints

```
GET    /tricto/products     - Get all products
POST   /tricto/products     - Create new product
PUT    /tricto/products/{id} - Update product
DELETE /tricto/products/{id} - Delete product
```

### Slot Endpoints

```
GET    /tricto/slots                    - Get all slots
POST   /tricto/slots                    - Create new slot
GET    /tricto/slots/product/{productId} - Get slots for product
PUT    /tricto/slots/{id}               - Update slot
DELETE /tricto/slots/{id}               - Delete slot
POST   /tricto/slots/{id}/reset         - Reset slot
POST   /tricto/slots/reset-all-pending  - Reset all pending slots
```

## 🎯 Key Features

### Product Management
- Add products with multiple images
- Configure up to 3 discount slots per product
- Category assignment and inventory tracking
- Real-time product updates

### Slot System
- **Multiple Tiers**: Up to 3 discount tiers per product
- **Capacity Tracking**: Monitor current vs maximum slot capacity
- **Auto-Fill Detection**: Automatic marking of full slots
- **Bulk Operations**: Reset all pending slots

### Admin Panel
- **Product CRUD**: Complete product lifecycle management
- **Slot Configuration**: Advanced discount tier setup
- **Image Management**: Support for multiple product images
- **Real-time Feedback**: Success/error messages for all operations

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for users and admins
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Comprehensive data validation

## 🚀 Development

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development

```bash
# Start with hot reload
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR file
./mvnw clean package
```

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
./mvnw test
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── slices/             # Redux Toolkit slices
│   ├── assets/             # Images and icons
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json

Ecommerce/
├── src/main/java/
│   └── com/cdac/e_commerce/
│       ├── controller/      # REST API controllers
│       ├── service/         # Business logic
│       ├── model/           # JPA entities
│       ├── repository/      # Data access layer
│       ├── security/        # Authentication & authorization
│       └── ModelDto/        # Data transfer objects
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## 🔒 Security

### Authentication Flow
1. User submits credentials via login form
2. Backend validates credentials and returns JWT token
3. Frontend stores token in Redux state and localStorage
4. Token is included in subsequent API requests
5. Backend validates token for protected endpoints

### Security Features
- **JWT Tokens**: Secure, stateless authentication
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses

## 🐛 Troubleshooting

### Common Issues

1. **Port 8085 Already in Use**
   ```bash
   # Find and kill the process using port 8085
   lsof -ti:8085 | xargs kill -9
   ```

2. **Database Connection Issues**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database exists

3. **Frontend Build Issues**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **CORS Issues**
   - Verify backend is running on port 8085
   - Check CORS configuration in `SecurityConfig.java`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing frontend library
- Redux Toolkit for simplified state management
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Happy Coding! 🚀**
