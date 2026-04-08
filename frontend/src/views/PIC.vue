<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <input v-model="search" type="text" placeholder="Cari PIC..." class="form-control" style="width:250px" @input="debouncedSearch" />
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ PIC Baru</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead><tr><th>Nama</th><th>Email</th><th>No HP</th><th>Cabang</th><th>Role</th><th>Zona</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nama }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.no_hp || '-' }}</td>
              <td>{{ item.kode_cabang || '-' }}</td>
              <td>{{ item.role || '-' }}</td>
              <td>{{ item.zona || '-' }}</td>
              <td><span :class="'badge badge-' + (item.is_active ? 'approved' : 'rejected')">{{ item.is_active ? 'Aktif' : 'Nonaktif' }}</span></td>
              <td>
                <button class="btn btn-outline btn-sm" @click="editPic(item)">Edit</button>
                <button class="btn btn-danger btn-sm" @click="deletePic(item)" style="margin-left:4px">Hapus</button>
              </td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="8" class="empty-state">Tidak ada data</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header"><h3>{{ editMode ? 'Edit PIC' : 'PIC Baru' }}</h3><button class="modal-close" @click="showModal = false">&times;</button></div>
        <form @submit.prevent="savePic">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Nama *</label><input v-model="form.nama" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Email *</label><input v-model="form.email" type="email" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">No HP</label><input v-model="form.no_hp" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Kode Cabang</label><input v-model="form.kode_cabang" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Role</label><input v-model="form.role" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Zona</label><input v-model="form.zona" class="form-control" /></div>
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
  name: 'PICView',
  data() {
    return { items: [], loading: false, showModal: false, submitting: false, editMode: false, editId: null, search: '', searchTimeout: null,
      form: { nama: '', email: '', no_hp: '', kode_cabang: '', role: '', zona: '' }
    };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() { this.loading = true; try { const { data } = await api.get('/pic'); this.items = data.data?.rows || []; } catch(e) { console.error(e); } finally { this.loading = false; } },
    editPic(item) { this.editMode = true; this.editId = item.id; this.form = { nama: item.nama, email: item.email, no_hp: item.no_hp || '', kode_cabang: item.kode_cabang || '', role: item.role || '', zona: item.zona || '' }; this.showModal = true; },
    async savePic() {
      this.submitting = true;
      try {
        if (this.editMode) { await api.put('/pic/' + this.editId, this.form); }
        else { await api.post('/pic', this.form); }
        this.showModal = false; this.editMode = false; await this.loadData();
      } catch(e) { alert(e.response?.data?.message || 'Gagal'); } finally { this.submitting = false; }
    },
    async deletePic(item) { if (!confirm('Hapus PIC ' + item.nama + '?')) return; try { await api.delete('/pic/' + item.id); await this.loadData(); } catch(e) { alert(e.response?.data?.message || 'Gagal'); } },
    debouncedSearch() { clearTimeout(this.searchTimeout); this.searchTimeout = setTimeout(() => this.loadData(), 400); }
  }
};
</script>
