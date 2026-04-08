<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <select v-model="tipeFilter" class="form-control" style="width:180px" @change="loadData">
          <option value="">Semua Tipe</option>
          <option value="TAPERA">Tapera</option>
          <option value="FLPP">FLPP</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Pencairan Baru</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>No Batch</th><th>No Pengajuan</th><th>Nama</th><th>Tipe</th><th>Nilai</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nomor_batch || '-' }}</td>
              <td>{{ item.Pengajuan?.nomor_pengajuan || '-' }}</td>
              <td>{{ item.Pengajuan?.nama_pemohon || '-' }}</td>
              <td>{{ item.tipe_program }}</td>
              <td>{{ formatCurrency(item.nilai_pencairan) }}</td>
              <td><span :class="'badge badge-' + (item.status === 'DISBURSED' ? 'approved' : 'pending')">{{ item.status }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td><button class="btn btn-outline btn-sm" @click="submitPencairan(item)" v-if="item.status === 'DRAFT'">Submit</button></td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="8" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Pencairan Baru</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="createPencairan">
          <div class="form-group"><label class="form-label">ID Pengajuan *</label><input v-model="form.id_pengajuan" type="number" class="form-control" required /></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">No Batch</label><input v-model="form.nomor_batch" class="form-control" /></div>
            <div class="form-group">
              <label class="form-label">Tipe Program *</label>
              <select v-model="form.tipe_program" class="form-control" required>
                <option value="TAPERA">Tapera</option>
                <option value="FLPP">FLPP</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Nilai Pencairan</label><input v-model="form.nilai_pencairan" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Tgl Pencairan</label><input v-model="form.tanggal_pencairan" type="date" class="form-control" /></div>
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
  name: 'PencairanView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, tipeFilter: '',
      form: { id_pengajuan: '', nomor_batch: '', tipe_program: 'TAPERA', nilai_pencairan: '', tanggal_pencairan: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const params = {}; if (this.tipeFilter) params.tipe_program = this.tipeFilter; const { data } = await api.get('/pencairan', { params }); this.items = Array.isArray(data.data) ? data.data : (data.data?.rows || []); } catch(e) { console.error(e); } finally { this.loading = false; } },
    async createPencairan() { this.submitting = true; try { await api.post('/pencairan', this.form); this.showModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; } },
    async submitPencairan(item) { try { await api.post('/pencairan/submit', { id: item.id }); await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } },
    formatCurrency(v) { return v ? 'Rp ' + Number(v).toLocaleString('id-ID') : '-'; },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
