<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <select v-model="tipeFilter" class="form-control" style="width:180px" @change="loadData">
          <option value="">Semua</option>
          <option value="7525">75:25</option>
          <option value="9010">90:10</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Jadwal Angsuran</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>ID</th><th>No Pengajuan</th><th>Angsuran Ke</th><th>Jatuh Tempo</th><th>Pokok</th><th>Bunga</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.id_pengajuan }}</td>
              <td>{{ item.angsuran_ke }}</td>
              <td>{{ formatDate(item.tanggal_jatuh_tempo) }}</td>
              <td>{{ formatCurrency(item.nilai_angsuran_pokok) }}</td>
              <td>{{ formatCurrency(item.nilai_angsuran_bunga) }}</td>
              <td>{{ formatCurrency((Number(item.nilai_angsuran_pokok) || 0) + (Number(item.nilai_angsuran_bunga) || 0)) }}</td>
              <td><span :class="'badge badge-' + (item.status_bayar === 'PAID' ? 'approved' : 'pending')">{{ item.status_bayar || 'UNPAID' }}</span></td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="8" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Submit Jadwal Angsuran</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="submitJadwal">
          <div class="form-row">
            <div class="form-group"><label class="form-label">ID Pengajuan *</label><input v-model="form.id_pengajuan" type="number" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Angsuran Ke *</label><input v-model="form.angsuran_ke" type="number" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Jatuh Tempo</label><input v-model="form.tanggal_jatuh_tempo" type="date" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Pokok</label><input v-model="form.nilai_angsuran_pokok" type="number" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Bunga</label><input v-model="form.nilai_angsuran_bunga" type="number" class="form-control" /></div>
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
  name: 'AngsuranView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, tipeFilter: '',
      form: { id_pengajuan: '', angsuran_ke: '', tanggal_jatuh_tempo: '', nilai_angsuran_pokok: '', nilai_angsuran_bunga: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const { data } = await api.get('/angsuran'); this.items = Array.isArray(data.data) ? data.data : (data.data?.rows || []); } catch(e) { console.error(e); } finally { this.loading = false; } },
    async submitJadwal() { this.submitting = true; try { await api.post('/angsuran/jadwal', this.form); this.showModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; } },
    formatCurrency(v) { return v ? 'Rp ' + Number(v).toLocaleString('id-ID') : '-'; },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
