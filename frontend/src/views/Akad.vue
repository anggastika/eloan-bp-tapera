<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <input v-model="search" type="text" placeholder="Cari..." class="form-control" style="width:250px" />
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Akad Baru</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>No Akad</th><th>No Pengajuan</th><th>Nama</th><th>Tgl Akad</th><th>Notaris</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nomor_akad || '-' }}</td>
              <td>{{ item.Pengajuan?.nomor_pengajuan || '-' }}</td>
              <td>{{ item.Pengajuan?.nama_pemohon || '-' }}</td>
              <td>{{ formatDate(item.tanggal_akad) }}</td>
              <td>{{ item.notaris || '-' }}</td>
              <td><span :class="'badge badge-' + (item.status === 'COMPLETED' ? 'approved' : 'pending')">{{ item.status }}</span></td>
              <td><button class="btn btn-outline btn-sm" @click="submitAkad(item)" v-if="item.status === 'DRAFT'">Submit</button></td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="7" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>Akad Baru</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="createAkad">
          <div class="form-group"><label class="form-label">ID Pengajuan *</label><input v-model="form.id_pengajuan" type="number" class="form-control" required /></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">No Akad</label><input v-model="form.nomor_akad" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Tgl Akad</label><input v-model="form.tanggal_akad" type="date" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Notaris</label><input v-model="form.notaris" class="form-control" /></div>
            <div class="form-group"><label class="form-label">No Rekening</label><input v-model="form.nomor_rekening" class="form-control" /></div>
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
  name: 'AkadView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, search: '',
      form: { id_pengajuan: '', nomor_akad: '', tanggal_akad: '', notaris: '', nomor_rekening: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const { data } = await api.get('/akad'); this.items = data.data?.rows || []; } catch(e) { console.error(e); } finally { this.loading = false; } },
    async createAkad() { this.submitting = true; try { await api.post('/akad', this.form); this.showModal = false; await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; } },
    async submitAkad(item) { try { await api.post('/akad/submit', { id: item.id }); await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } },
    formatDate(v) { return v ? new Date(v).toLocaleDateString('id-ID') : '-'; }
  }
};
</script>
