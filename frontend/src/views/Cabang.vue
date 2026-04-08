<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <input v-model="search" type="text" placeholder="Cari cabang..." class="form-control" style="width:250px" />
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Cabang Baru</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>Kode</th><th>Nama Cabang</th><th>Kota</th><th>Provinsi</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.kode_cabang }}</td>
              <td>{{ item.nama_cabang }}</td>
              <td>{{ item.kota || '-' }}</td>
              <td>{{ item.provinsi || '-' }}</td>
              <td><span :class="'badge badge-' + (item.is_active ? 'approved' : 'rejected')">{{ item.is_active ? 'Aktif' : 'Nonaktif' }}</span></td>
              <td><button class="btn btn-outline btn-sm" @click="editBranch(item)">Edit</button></td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="6" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>{{ editMode ? 'Edit Cabang' : 'Cabang Baru' }}</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="saveBranch">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Kode Cabang *</label><input v-model="form.kode_cabang" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Nama Cabang *</label><input v-model="form.nama_cabang" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Alamat</label><input v-model="form.alamat" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Kota</label><input v-model="form.kota" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Provinsi</label><input v-model="form.provinsi" class="form-control" /></div>
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
  name: 'CabangView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, editMode: false, editId: null, search: '',
      form: { kode_cabang: '', nama_cabang: '', alamat: '', kota: '', provinsi: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const { data } = await api.get('/branch'); this.items = data.data?.rows || []; } catch(e) { console.error(e); } finally { this.loading = false; } },
    editBranch(item) { this.editMode = true; this.editId = item.id; this.form = { kode_cabang: item.kode_cabang, nama_cabang: item.nama_cabang, alamat: item.alamat || '', kota: item.kota || '', provinsi: item.provinsi || '' }; this.showModal = true; },
    async saveBranch() {
      this.submitting = true;
      try {
        if (this.editMode) { await api.put('/branch/' + this.editId, this.form); }
        else { await api.post('/branch', this.form); }
        this.showModal = false; this.editMode = false; await this.loadData();
      } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; }
    }
  }
};
</script>
