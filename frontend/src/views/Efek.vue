<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <select v-model="jenisFilter" class="form-control" style="width:180px" @change="loadData">
          <option value="">Semua Jenis</option>
          <option value="LTN">LTN</option>
          <option value="NCD">NCD</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Efek Baru</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>No Batch</th><th>Kode Efek</th><th>Jenis</th><th>Tenor</th><th>Nilai</th><th>Bunga</th><th>Status</th><th>Tanggal</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nomor_batch || '-' }}</td>
              <td>{{ item.kode_efek || '-' }}</td>
              <td>{{ item.jenis_efek }}</td>
              <td>{{ item.tenor || '-' }}</td>
              <td>{{ formatCurrency(item.nilai_efek) }}</td>
              <td>{{ item.bunga || '-' }}%</td>
              <td><span :class="'badge badge-' + (item.status_efek === 'ACTIVE' ? 'approved' : 'pending')">{{ item.status_efek }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="8" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Efek Baru</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="createEfek">
          <div class="form-row">
            <div class="form-group"><label class="form-label">No Batch</label><input v-model="form.nomor_batch" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Kode Efek</label><input v-model="form.kode_efek" class="form-control" /></div>
            <div class="form-group">
              <label class="form-label">Jenis Efek *</label>
              <select v-model="form.jenis_efek" class="form-control" required><option value="LTN">LTN</option><option value="NCD">NCD</option></select>
            </div>
            <div class="form-group"><label class="form-label">Tenor</label><input v-model="form.tenor" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Nilai Efek</label><input v-model="form.nilai_efek" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Bunga (%)</label><input v-model="form.bunga" type="number" step="0.01" class="form-control" /></div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="submitting">{{ submitting ? 'Menyimpan...' : 'Simpan' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
export default {
  name: 'EfekView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, jenisFilter: '',
      form: { nomor_batch: '', kode_efek: '', jenis_efek: 'LTN', tenor: '', nilai_efek: '', bunga: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const { data } = await api.get('/efek'); this.items = Array.isArray(data.data) ? data.data : (data.data?.rows || []); } catch(e) { console.error(e); } finally { this.loading = false; } },
    async createEfek() { this.submitting = true; try { await api.post('/efek', this.form); this.showModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; } },
    formatCurrency(v) { return v ? 'Rp ' + Number(v).toLocaleString('id-ID') : '-'; },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
