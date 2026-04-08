<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <input v-model="search" type="text" placeholder="Cari..." class="form-control" style="width:250px" />
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Pengajuan Prioritas</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>NIK</th><th>Nama</th><th>No HP</th><th>Prioritas</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nik }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.no_hp || '-' }}</td>
              <td><span :class="'badge badge-' + (item.prioritas ? 'approved' : 'draft')">{{ item.prioritas ? 'Ya' : 'Tidak' }}</span></td>
              <td><span :class="'badge badge-' + (item.status === 'APPROVED' ? 'approved' : 'pending')">{{ item.status }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button class="btn btn-outline btn-sm" @click="submitToTapera(item)" v-if="item.status === 'DRAFT'">Submit</button>
                <button class="btn btn-outline btn-sm" @click="cekPrioritas(item)" style="margin-left:4px">Cek</button>
              </td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="7" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Pengajuan Prioritas</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="createPrioritas">
          <div class="form-row">
            <div class="form-group"><label class="form-label">NIK *</label><input v-model="form.nik" class="form-control" maxlength="16" required /></div>
            <div class="form-group"><label class="form-label">Nama *</label><input v-model="form.nama" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">No HP</label><input v-model="form.no_hp" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Email</label><input v-model="form.email" type="email" class="form-control" /></div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="submitting">{{ submitting ? 'Menyimpan...' : 'Simpan' }}</button>
        </form>
      </div>
    </div>

    <div v-if="cekResult" class="modal-overlay" @click.self="cekResult = null">
      <div class="modal">
        <div class="modal-header"><h3>Hasil Cek Prioritas</h3><button class="modal-close" @click="cekResult = null">&times;</button></div>
        <pre style="white-space:pre-wrap;font-size:13px">{{ JSON.stringify(cekResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
export default {
  name: 'PrioritasView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, search: '', cekResult: null,
      form: { nik: '', nama: '', no_hp: '', email: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const { data } = await api.get('/prioritas'); this.items = Array.isArray(data.data) ? data.data : (data.data?.rows || []); } catch(e) { console.error(e); } finally { this.loading = false; } },
    async createPrioritas() { this.submitting = true; try { await api.post('/prioritas', this.form); this.showModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; } },
    async submitToTapera(item) { try { await api.post('/prioritas/submit', { id: item.id }); await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } },
    async cekPrioritas(item) { try { const { data } = await api.get('/prioritas/cek', { params: { nik: item.nik } }); this.cekResult = data.data; } catch(e) { alert(e.response?.data?.message || 'Gagal'); } },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
