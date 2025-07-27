import axios from 'axios';

const API_URL = '/api/products';

interface ProductParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

interface SearchParams {
  name: string;
  page?: number;
  size?: number;
}

const getProducts = async (params: ProductParams = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

const getFeaturedProducts = async () => {
  const response = await axios.get(`${API_URL}/featured`);
  return response.data;
};

const getProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const searchProducts = async (params: SearchParams) => {
  const response = await axios.get(`${API_URL}/search`, { params });
  return response.data;
};

const getProductsByCategory = async (category: string, params: ProductParams = {}) => {
  const response = await axios.get(`${API_URL}/category/${category}`, { params });
  return response.data;
};

const getProductsByPriceRange = async (minPrice: number, maxPrice: number, params: ProductParams = {}) => {
  const response = await axios.get(`${API_URL}/price-range`, {
    params: { minPrice, maxPrice, ...params }
  });
  return response.data;
};

const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

const getBrands = async () => {
  const response = await axios.get(`${API_URL}/brands`);
  return response.data;
};

// Admin functions (require authentication)
const createProduct = async (product: any, token: string) => {
  const response = await axios.post(API_URL, product, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const updateProduct = async (id: string, product: any, token: string) => {
  const response = await axios.put(`${API_URL}/${id}`, product, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const deleteProduct = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const productService = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getProductsByPriceRange,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;