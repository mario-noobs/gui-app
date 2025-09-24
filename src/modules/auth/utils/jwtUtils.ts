/**
 * Utility functions for working with JWT tokens
 */

/**
 * Extract the subject (sub) claim from the JWT token in localStorage
 * @returns The user ID from the JWT, or null if not available
 */
export const getJwtUserId = (): string | null => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    // Extract the payload part of the JWT (second part)
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    // Decode base64 and parse the JSON
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.sub || null;
  } catch (error) {
    console.error('Error extracting JWT user ID:', error);
    return null;
  }
};

/**
 * Save the JWT subject to localStorage for easy access
 * @param token - The JWT token
 */
export const saveJwtSubToLocalStorage = (token: string): void => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return;
    
    const decoded = JSON.parse(atob(payload));
    if (decoded.sub) {
      localStorage.setItem('jwt_user_id', decoded.sub);
    }
  } catch (error) {
    console.error('Error saving JWT subject to localStorage:', error);
  }
};
