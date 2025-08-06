# Address Saving Feature Implementation

## Overview
The checkout page now automatically saves the user's shipping address to the backend database when an order is placed. This allows users to have their addresses stored for future orders.

## Implementation Details

### Frontend Changes (Checkout.jsx)

#### 1. Enhanced Form Fields
- **Address Field**: Now includes a textarea for detailed shipping address (Street, City, State)
- **Pincode Field**: Added a new input field with validation for 6-digit pincode
- **Form Validation**: Pincode field includes pattern validation `[0-9]{6}`

#### 2. Address Saving Function
```javascript
const saveAddress = async (addressData) => {
  // Saves address to backend before placing order
  // Uses authentication token from Redux state
  // Handles errors gracefully without blocking order placement
}
```

#### 3. Integration with Order Process
- Address is saved **before** the order is placed
- If address saving fails, the order can still be placed
- Success message confirms address was saved

### Backend Structure

#### 1. Address Entity (Address.java)
```java
@Entity
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank
    @Column(name = "address_line", nullable = false)
    private String addressLine;
    
    @NotBlank
    @Column(nullable = false)
    private String pincode;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
```

#### 2. Address DTO (AddressDto.java)
```java
public class AddressDto {
    private Integer id;
    private String addressLine;
    private String pincode;
    private Integer userId;
    // getters and setters
}
```

#### 3. API Endpoints
- **POST** `/tricto/address` - Create new address
- **GET** `/tricto/address` - Get all addresses
- **GET** `/tricto/address/{id}` - Get address by ID
- **PUT** `/tricto/address/{id}` - Update address
- **DELETE** `/tricto/address/{id}` - Delete address

## Database Schema

### Address Table
```sql
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address_line` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6i66ijb8twgcqtetl8eeeed6v` (`user_id`),
  CONSTRAINT `FK6i66ijb8twgcqtetl8eeeed6v` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## User Experience

### 1. Checkout Process
1. User fills in shipping details (name, email, address, pincode)
2. User clicks "Place Order"
3. Address is automatically saved to backend
4. Order is placed
5. Success message confirms both order placement and address saving

### 2. Form Validation
- **Name**: Required text field
- **Email**: Required email field with email validation
- **Address**: Required textarea for detailed address
- **Pincode**: Required field with 6-digit number validation

### 3. Error Handling
- If address saving fails, order can still be placed
- Console logs provide debugging information
- User is informed that address was saved in success message

## Security Features

### 1. Authentication
- Address saving requires valid JWT token
- Token is retrieved from Redux state or localStorage
- Unauthorized requests are handled gracefully

### 2. Data Validation
- Backend validates required fields
- Pincode format is validated on frontend
- User ID is verified before saving

## Technical Implementation

### 1. Frontend API Call
```javascript
const addressPayload = {
  addressLine: addressData.address,
  pincode: addressData.pincode,
  userId: authState.profile.id
};

const response = await fetch('http://localhost:8085/tricto/address', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(addressPayload),
});
```

### 2. Backend Processing
```java
@Override
public AddressDto createAddress(AddressDto dto) {
    User user = userRepository.findById(dto.getUserId())
        .orElseThrow(() -> new UserNotFoundException("User not found"));
    
    Address address = convertToEntity(dto);
    address.setUser(user);
    
    Address saved = addressRepository.save(address);
    return convertToDto(saved);
}
```

## Benefits

1. **User Convenience**: Addresses are saved for future orders
2. **Data Persistence**: Addresses are stored in database
3. **Error Resilience**: Order placement continues even if address saving fails
4. **Validation**: Both frontend and backend validation ensure data quality
5. **Security**: Authentication required for address operations

## Future Enhancements

1. **Address Management**: Allow users to view/edit saved addresses
2. **Multiple Addresses**: Support for multiple shipping addresses per user
3. **Address Selection**: Dropdown to select from saved addresses during checkout
4. **Address Verification**: Integration with address verification services
5. **Default Address**: Allow users to set a default shipping address

## Testing

### Manual Testing Steps
1. Start backend server: `cd Ecommerce && ./mvnw spring-boot:run`
2. Start frontend server: `npm run dev`
3. Login to the application
4. Add items to cart
5. Go to checkout page
6. Fill in address details including pincode
7. Place order
8. Verify address is saved in database

### Database Verification
```sql
SELECT * FROM address WHERE user_id = [your_user_id];
```

This feature enhances the user experience by automatically saving shipping addresses, making future orders more convenient for users. 