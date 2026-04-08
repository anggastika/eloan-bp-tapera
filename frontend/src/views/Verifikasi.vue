<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <select v-model="jenisFilter" class="form-control" style="width:180px" @change="loadData">
          <option value="">Semua Jenis</option>
          <option value="KPR">KPR - Layak Huni</option>
          <option value="KBR">KBR - Layak Bangun</option>
          <option value="KRR">KRR - Layak Renovasi</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Verifikasi Baru</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>ID</th><th>No Pengajuan</th><th>Jenis</th><th>Lat/Long</th><th>Status</th><th>Tanggal</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.Pengajuan?.nomor_pengajuan || item.id_pengajuan }}</td>
              <td>{{ item.jenis_verifikasi || '-' }}</td>
              <td>{{ item.latitude || '-' }}, {{ item.longitude || '-' }}</td>
              <td><span :class="'badge badge-' + (item.status === 'VERIFIED' ? 'approved' : 'pending')">{{ item.status }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="6" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Verifikasi Kelayakan</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="createVerifikasi">
          <div class="form-group"><label class="form-label">ID Pengajuan *</label><input v-model="form.id_pengajuan" type="number" class="form-control" required /></div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Jenis Verifikasi</label>
              <select v-model="form.jenis_verifikasi" class="form-control">
                <option value="LAYAK_HUNI">Layak Huni (KPR)</option>
                <option value="LAYAK_BANGUN">Layak Bangun (KBR)</option>
                <option value="LAYAK_RENOVASI">Layak Renovasi (KRR)</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Latitude</label><input v-model="form.latitude" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Longitude</label><input v-model="form.longitude" class="form-control" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label><input type="checkbox" v-model="form.atap" /> Atap Layak</label></div>
            <div class="form-group"><label><input type="checkbox" v-model="form.lantai" /> Lantai Layak</label></div>
            <div class="form-group"><label><input type="checkbox" v-model="form.dinding" /> Dinding Layak</label></div>
            <div class="form-group"><label><input type="checkbox" v-model="form.sanitasi" /> Sanitasi Layak</label></div>
            <div class="form-group"><label><input type="checkbox" v-model="form.air_bersih" /> Air Bersih</label></div>
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
  name: 'VerifikasiView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, jenisFilter: '',
      form: { id_pengajuan: '', jenis_verifikasi: 'LAYAK_HUNI', latitude: '', longitude: '', atap: true, lantai: true, dinding: true, sanitasi: true, air_bersih: true }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const { data } = await api.get('/verifikasi'); this.items = data.data?.rows || []; } catch(e) { console.error(e); } finally { this.loading = false; } },
    async createVerifikasi() {
      this.submitting = true;
      try { await api.post('/verifikasi/layak-huni', this.form); this.showModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; }
    },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
