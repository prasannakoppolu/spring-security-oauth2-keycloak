import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import productService from '../../services/productService';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stockQuantity: number;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
  active: boolean;
  featured: boolean;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  categories: string[];
  brands: string[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  brands: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { page?: number; size?: number; sortBy?: string; sortDir?: string }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (params: { name: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;