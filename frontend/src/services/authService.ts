import axios from 'axios';

const API_URL = '/api/auth';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginResponse {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/signin`, credentials);
  return response.data;
};

const register = async (userData: RegisterData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;