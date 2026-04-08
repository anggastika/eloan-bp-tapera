<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <input v-model="search" type="text" placeholder="Cari..." class="form-control" style="width:250px" @input="debouncedSearch" />
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ SP3K Baru</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>No SP3K</th><th>No Pengajuan</th><th>Nama</th><th>Nilai</th><th>Tenor</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nomor_sp3k || '-' }}</td>
              <td>{{ item.Pengajuan?.nomor_pengajuan || '-' }}</td>
              <td>{{ item.Pengajuan?.nama_pemohon || '-' }}</td>
              <td>{{ formatCurrency(item.nilai_pembiayaan_disetujui) }}</td>
              <td>{{ item.tenor_disetujui || '-' }} bln</td>
              <td><span :class="'badge badge-' + (item.status === 'APPROVED' ? 'approved' : 'pending')">{{ item.status }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button class="btn btn-outline btn-sm" @click="submitSP3K(item)" v-if="item.status === 'DRAFT'">Submit</button>
              </td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="8" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>SP3K Baru</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="createSP3K">
          <div class="form-group">
            <label class="form-label">ID Pengajuan *</label>
            <input v-model="form.id_pengajuan" type="number" class="form-control" required />
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">No SP3K</label><input v-model="form.nomor_sp3k" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Nilai Disetujui</label><input v-model="form.nilai_pembiayaan_disetujui" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Tenor Disetujui</label><input v-model="form.tenor_disetujui" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Suku Bunga</label><input v-model="form.suku_bunga_disetujui" type="number" step="0.01" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Tgl Terbit</label><input v-model="form.tanggal_sp3k" type="date" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Berlaku Sampai</label><input v-model="form.berlaku_sampai" type="date" class="form-control" /></div>
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
  name: 'SP3KView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, search: '', searchTimeout: null,
      form: { id_pengajuan: '', nomor_sp3k: '', nilai_pembiayaan_disetujui: '', tenor_disetujui: '', suku_bunga_disetujui: '', tanggal_sp3k: '', berlaku_sampai: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() {
      this.loading = true;
      try { const { data } = await api.get('/sp3k'); this.items = Array.isArray(data.data) ? data.data : (data.data?.rows || []); } catch(e) { console.error(e); } finally { this.loading = false; }
    },
    async createSP3K() {
      this.submitting = true;
      try { await api.post('/sp3k', this.form); this.showModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; }
    },
    async submitSP3K(item) {
      try { await api.post('/sp3k/submit', { id: item.id }); await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); }
    },
    debouncedSearch() { clearTimeout(this.searchTimeout); this.searchTimeout = setTimeout(() => this.loadData(), 400); },
    formatCurrency(v) { return v ? 'Rp ' + Number(v).toLocaleString('id-ID') : '-'; },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
