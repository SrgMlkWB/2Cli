const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://2gamerz-backend.onrender.com';

export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  motivation?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        confirmationPassword: userData.password
      }),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de l\'inscription');
    }
    
    return data;
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    throw error;
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur d\'authentification');
    }
    
    return data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Non authentifié');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur de récupération de l\'utilisateur:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la déconnexion');
    }
    
    return true;
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    throw error;
  }
}
