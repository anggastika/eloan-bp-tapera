<template>
  <div>
    <div class="card">
      <h3 class="card-title">Profil Pengguna</h3>
      <div v-if="user" class="form-row" style="margin-top:16px">
        <div><strong>Nama:</strong> {{ user.nama }}</div>
        <div><strong>Email:</strong> {{ user.email }}</div>
        <div><strong>Role:</strong> {{ user.role }}</div>
        <div><strong>Cabang:</strong> {{ user.kode_cabang || '-' }}</div>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">Ubah Password</h3>
      <div v-if="pwMessage" :class="'alert alert-' + pwMessageType">{{ pwMessage }}</div>
      <form @submit.prevent="changePassword" style="max-width:400px;margin-top:16px">
        <div class="form-group">
          <label class="form-label">Password Lama</label>
          <input v-model="pwForm.old_password" type="password" class="form-control" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password Baru</label>
          <input v-model="pwForm.new_password" type="password" class="form-control" minlength="6" required />
        </div>
        <div class="form-group">
          <label class="form-label">Konfirmasi Password Baru</label>
          <input v-model="pwForm.confirm" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="pwLoading">{{ pwLoading ? 'Menyimpan...' : 'Ubah Password' }}</button>
      </form>
    </div>

    <div class="card">
      <h3 class="card-title">Parameter Tapera</h3>
      <p style="color:var(--text-light);font-size:14px;margin-top:8px">Berikut adalah referensi data parameter dari BP Tapera:</p>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" @click="loadParam('produk')">Produk</button>
        <button class="btn btn-outline btn-sm" @click="loadParam('provinsi')">Provinsi</button>
        <button class="btn btn-outline btn-sm" @click="loadParam('proses')">Proses</button>
        <button class="btn btn-outline btn-sm" @click="loadParam('error-code')">Error Code</button>
        <button class="btn btn-outline btn-sm" @click="loadParam('segmen-pekerjaan')">Segmen Pekerjaan</button>
        <button class="btn btn-outline btn-sm" @click="loadParam('status-pernikahan')">Status Pernikahan</button>
      </div>
    </div>

    <div v-if="paramData" class="modal-overlay" @click.self="paramData = null">
      <div class="modal" style="max-width:800px">
        <div class="modal-header">
          <h3>Parameter: {{ paramTitle }}</h3>
          <button class="modal-close" @click="paramData = null">&times;</button>
        </div>
        <pre style="white-space:pre-wrap;font-size:12px;max-height:400px;overflow:auto">{{ JSON.stringify(paramData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'PengaturanView',
  data() {
    return {
      pwForm: { old_password: '', new_password: '', confirm: '' },
      pwLoading: false, pwMessage: '', pwMessageType: 'success',
      paramData: null, paramTitle: ''
    };
  },
  computed: {
    user() { return useAuthStore().user; }
  },
  methods: {
    async changePassword() {
      if (this.pwForm.new_password !== this.pwForm.confirm) {
        this.pwMessage = 'Password baru tidak cocok'; this.pwMessageType = 'danger'; return;
      }
      this.pwLoading = true; this.pwMessage = '';
      try {
        await api.put('/auth/change-password', { old_password: this.pwForm.old_password, new_password: this.pwForm.new_password });
        this.pwMessage = 'Password berhasil diubah'; this.pwMessageType = 'success';
        this.pwForm = { old_password: '', new_password: '', confirm: '' };
      } catch(e) { this.pwMessage = e.response?.data?.message || 'Gagal ubah password'; this.pwMessageType = 'danger'; }
      finally { this.pwLoading = false; }
    },
    async loadParam(type) {
      this.paramTitle = type;
      try { const { data } = await api.get('/parameter/' + type); this.paramData = data.data || data; }
      catch(e) { this.paramData = { error: e.response?.data?.message || 'Gagal memuat parameter' }; }
    }
  }
};
</script>
