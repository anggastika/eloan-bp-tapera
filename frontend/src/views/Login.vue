<template>
  <div class="login-page">
    <div class="login-card">
      <h1>E-Loan BP Tapera</h1>
      <p>Sistem Pembiayaan Perumahan</p>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="Password" required />
        </div>
        <button type="submit" class="btn btn-primary btn-login" :disabled="loading">
          {{ loading ? 'Masuk...' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  name: 'LoginView',
  data() {
    return { email: '', password: '', error: '', loading: false };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;
      try {
        const auth = useAuthStore();
        await auth.login(this.email, this.password);
        this.$router.push('/');
      } catch (err) {
        this.error = err.response?.data?.message || 'Login gagal';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
