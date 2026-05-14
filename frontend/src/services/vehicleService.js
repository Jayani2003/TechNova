import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: `${API_BASE_URL}/vehicles`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cbt_token') || localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==================== CATEGORY API ====================
export const categoryService = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    create: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    update: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};

// ==================== VEHICLE API ====================
export const vehicleService = {
    getAll: async (params = {}) => {
        const response = await api.get('/', { params });
        return response.data;
    },

    getByCategory: async (categoryId) => {
        const response = await api.get(`/category/${categoryId}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/${id}`);
        return response.data;
    },

    create: async (vehicleData) => {
        const response = await api.post('/', vehicleData);
        return response.data;
    },

    update: async (id, vehicleData) => {
        const response = await api.put(`/${id}`, vehicleData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/stats');
        return response.data;
    },
};