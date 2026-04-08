<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <select v-model="jenisFilter" class="form-control" style="width:220px" @change="loadData">
          <option value="">Semua Jenis</option>
          <option value="OUTSTANDING">Outstanding</option>
          <option value="PELUNASAN_DIPERCEPAT">Pelunasan Dipercepat</option>
        </select>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" @click="showOutstandingModal = true">+ Laporan Outstanding</button>
        <button class="btn btn-success" @click="showPelunasanModal = true">+ Laporan Pelunasan</button>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>ID</th><th>Jenis</th><th>Periode</th><th>Jumlah Debitur</th><th>Total Outstanding</th><th>Status</th><th>Tanggal</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.jenis_laporan }}</td>
              <td>{{ item.periode || '-' }}</td>
              <td>{{ item.jumlah_debitur || '-' }}</td>
              <td>{{ formatCurrency(item.total_outstanding) }}</td>
              <td><span :class="'badge badge-' + (item.status === 'SUBMITTED' ? 'submitted' : 'draft')">{{ item.status }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="7" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showOutstandingModal" class="modal-overlay" @click.self="showOutstandingModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Laporan Outstanding</h3><button class="modal-close" @click="showOutstandingModal = false">&times;</button></div>
        <form @submit.prevent="submitOutstanding">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Periode *</label><input v-model="outstandingForm.periode" type="month" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Jumlah Debitur</label><input v-model="outstandingForm.jumlah_debitur" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Total Outstanding</label><input v-model="outstandingForm.total_outstanding" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Total Kolektibilitas Lancar</label><input v-model="outstandingForm.total_kolektibilitas_lancar" type="number" class="form-control" /></div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="submitting">{{ submitting ? 'Menyimpan...' : 'Simpan' }}</button>
        </form>
      </div>
    </div>

    <div v-if="showPelunasanModal" class="modal-overlay" @click.self="showPelunasanModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Laporan Pelunasan Dipercepat</h3><button class="modal-close" @click="showPelunasanModal = false">&times;</button></div>
        <form @submit.prevent="submitPelunasan">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Periode *</label><input v-model="pelunasanForm.periode" type="month" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Jumlah Debitur</label><input v-model="pelunasanForm.jumlah_debitur" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Total Pelunasan</label><input v-model="pelunasanForm.total_pelunasan" type="number" class="form-control" /></div>
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
  name: 'LaporanView',
  data() {
    return { items: [], loading: false, showOutstandingModal: false, showPelunasanModal: false, submitting: false, jenisFilter: '',
      outstandingForm: { periode: '', jumlah_debitur: '', total_outstanding: '', total_kolektibilitas_lancar: '' },
      pelunasanForm: { periode: '', jumlah_debitur: '', total_pelunasan: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const params = {}; if (this.jenisFilter) params.jenis_laporan = this.jenisFilter; const { data } = await api.get('/laporan', { params }); this.items = data.data?.rows || []; } catch(e) { console.error(e); } finally { this.loading = false; } },
    async submitOutstanding() { this.submitting = true; try { await api.post('/laporan/outstanding', this.outstandingForm); this.showOutstandingModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; } },
    async submitPelunasan() { this.submitting = true; try { await api.post('/laporan/pelunasan', this.pelunasanForm); this.showPelunasanModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; } },
    formatCurrency(v) { return v ? 'Rp ' + Number(v).toLocaleString('id-ID') : '-'; },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
