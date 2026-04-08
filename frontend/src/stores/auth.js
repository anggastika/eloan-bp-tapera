import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.nama || '',
    userRole: (state) => state.user?.role || ''
  },
  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.token = data.data.token;
      this.user = data.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      return data;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    async fetchProfile() {
      const { data } = await api.get('/auth/profile');
      this.user = data.data;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
});
