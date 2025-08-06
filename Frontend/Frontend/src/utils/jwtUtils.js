// Utility to decode JWT tokens
export const decodeJWT = (token) => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Simple base64 decoding
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const userData = JSON.parse(decodedPayload);
    console.log('Decoded JWT payload:', userData);
    
    return {
      email: userData.sub, // 'sub' is the standard JWT claim for subject (email)
      role: userData.roles && userData.roles.length > 0 ? userData.roles[0] : 'USER',
      exp: userData.exp,
      iat: userData.iat
    };
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}; 