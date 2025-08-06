# 🔐 Google OAuth Setup Guide - Step by Step

## 🚨 **Current Issue**
You're getting "The OAuth client was not found" error because the Google OAuth client ID is not properly configured.

## 📋 **Step-by-Step Setup**

### **Step 1: Create Google Cloud Project**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name: `E-Commerce OAuth` (or any name you prefer)
   - Click "Create"

### **Step 2: Enable Google+ API**

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" > "Library"

2. **Enable Google Identity**
   - Search for "Google Identity"
   - Click on "Google Identity" 
   - Click "Enable"

### **Step 3: Configure OAuth Consent Screen**

1. **Go to OAuth Consent Screen**
   - In the left sidebar, click "APIs & Services" > "OAuth consent screen"

2. **Configure Consent Screen**
   - User Type: **External** (for development)
   - App name: `Your E-Commerce App`
   - User support email: `your-email@gmail.com`
   - Developer contact information: `your-email@gmail.com`
   - Click "Save and Continue"

3. **Add Scopes** (Optional)
   - Click "Add or Remove Scopes"
   - Select: `email`, `profile`, `openid`
   - Click "Update"

4. **Add Test Users** (Optional)
   - Click "Add Users"
   - Add your email address
   - Click "Add"

5. **Complete Setup**
   - Click "Save and Continue" through remaining steps

### **Step 4: Create OAuth 2.0 Credentials**

1. **Go to Credentials**
   - In the left sidebar, click "APIs & Services" > "Credentials"

2. **Create OAuth Client ID**
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Web application**
   - Name: `E-Commerce Web Client`

3. **Configure Authorized Origins**
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     http://localhost:5174
     http://localhost:5175
     http://localhost:5176
     http://localhost:5177
     http://localhost:3000
     ```

4. **Configure Authorized Redirect URIs**
   - **Authorized redirect URIs:**
     ```
     http://localhost:5173
     http://localhost:5174
     http://localhost:5175
     http://localhost:5176
     http://localhost:5177
     http://localhost:3000
     ```

5. **Create Client ID**
   - Click "Create"
   - **Copy the Client ID** (you'll need this)

### **Step 5: Update Your Application**

1. **Update Frontend Configuration**
   ```javascript
   // In src/main.jsx, replace the clientId:
   <GoogleOAuthProvider clientId="YOUR_ACTUAL_CLIENT_ID_HERE">
   ```

2. **Update Backend Configuration**
   ```properties
   # In Ecommerce/src/main/resources/application.properties:
   google.oauth.client-id=YOUR_ACTUAL_CLIENT_ID_HERE
   ```

### **Step 6: Test the Integration**

1. **Restart Backend**
   ```bash
   cd Ecommerce
   ./mvnw spring-boot:run
   ```

2. **Restart Frontend**
   ```bash
   npm run dev
   ```

3. **Test Google Login**
   - Navigate to your login page
   - Click the Google login button
   - Should work without errors

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"The OAuth client was not found"**
   - ✅ **Solution**: Follow the setup guide above
   - Make sure you've created the OAuth client ID correctly

2. **"Redirect URI mismatch"**
   - ✅ **Solution**: Add your frontend URL to authorized redirect URIs
   - Include all possible ports: 5173, 5174, 5175, etc.

3. **"Google+ API not enabled"**
   - ✅ **Solution**: Enable Google Identity API in Google Cloud Console

4. **"Invalid client ID"**
   - ✅ **Solution**: Double-check the client ID in both frontend and backend
   - Make sure there are no extra spaces or characters

### **Debug Steps:**

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Google Cloud Settings**
   - Ensure OAuth consent screen is configured
   - Verify client ID and secret are correct
   - Check authorized origins and redirect URIs

3. **Test with Different Ports**
   - If using port 5177, add it to authorized origins
   - Update both frontend and backend configurations

## 🎯 **Quick Test Setup**

For immediate testing, you can use this temporary configuration:

```javascript
// Frontend (src/main.jsx)
<GoogleOAuthProvider clientId="1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com">
```

```properties
# Backend (application.properties)
google.oauth.client-id=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**Note**: This is a dummy client ID for testing the UI. For actual functionality, you need to follow the setup guide above.

## 📞 **Need Help?**

If you're still having issues:

1. **Check the setup guide** step by step
2. **Verify all URLs** are added to authorized origins
3. **Restart both servers** after configuration changes
4. **Clear browser cache** and try again

---

**Happy Coding! 🚀** 