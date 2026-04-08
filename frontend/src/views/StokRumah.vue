<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <input v-model="search" type="text" placeholder="Cari perumahan..." class="form-control" style="width:250px" @input="debouncedSearch" />
        <select v-model="view" class="form-control" style="width:180px" @change="loadData">
          <option value="perumahan">Perumahan</option>
          <option value="rumah">Rumah</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <template v-else>
        <div v-if="view === 'perumahan'" class="table-container">
          <table>
            <thead><tr><th>Nama Perumahan</th><th>Developer</th><th>Provinsi</th><th>Kota</th><th>Total Unit</th><th>Tersedia</th></tr></thead>
            <tbody>
              <tr v-for="item in items" :key="item.id || item.kode_perumahan">
                <td>{{ item.nama_perumahan || '-' }}</td>
                <td>{{ item.nama_developer || '-' }}</td>
                <td>{{ item.provinsi || '-' }}</td>
                <td>{{ item.kota || '-' }}</td>
                <td>{{ item.total_unit || '-' }}</td>
                <td>{{ item.unit_tersedia || '-' }}</td>
              </tr>
              <tr v-if="items.length === 0"><td colspan="6" class="empty-state">Tidak ada data</td></tr>
            </tbody>
          </table>
        </div>
        <div v-else class="table-container">
          <table>
            <thead><tr><th>Kode Rumah</th><th>Perumahan</th><th>Tipe</th><th>Luas Tanah</th><th>Luas Bangunan</th><th>Harga</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="item in items" :key="item.id || item.kode_rumah">
                <td>{{ item.kode_rumah || '-' }}</td>
                <td>{{ item.nama_perumahan || '-' }}</td>
                <td>{{ item.tipe_rumah || '-' }}</td>
                <td>{{ item.luas_tanah || '-' }} m2</td>
                <td>{{ item.luas_bangunan || '-' }} m2</td>
                <td>{{ formatCurrency(item.harga) }}</td>
                <td><span :class="'badge badge-' + (item.status === 'AVAILABLE' ? 'approved' : 'pending')">{{ item.status || '-' }}</span></td>
              </tr>
              <tr v-if="items.length === 0"><td colspan="7" class="empty-state">Tidak ada data</td></tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
export default {
  name: 'StokRumahView',
  data() {
    return { items: [], loading: false, search: '', view: 'perumahan', searchTimeout: null };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const endpoint = this.view === 'perumahan' ? '/stok-rumah/perumahan' : '/stok-rumah/rumah';
        const { data } = await api.get(endpoint);
        this.items = data.data || [];
      } catch(e) { console.error(e); this.items = []; } finally { this.loading = false; }
    },
    debouncedSearch() { clearTimeout(this.searchTimeout); this.searchTimeout = setTimeout(() => this.loadData(), 400); },
    formatCurrency(v) { return v ? 'Rp ' + Number(v).toLocaleString('id-ID') : '-'; }
  }
};
</script>
