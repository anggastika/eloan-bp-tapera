<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <input v-model="search" type="text" placeholder="Cari nama/NIK..." class="form-control" style="width:250px" @input="debouncedSearch" />
        <select v-model="statusFilter" class="form-control" style="width:180px" @change="loadData">
          <option value="">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <router-link to="/pengajuan/baru" class="btn btn-primary">+ Pengajuan Baru</router-link>
    </div>

    <div class="card">
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>No. Pengajuan</th>
              <th>Nama Pemohon</th>
              <th>NIK</th>
              <th>Jenis</th>
              <th>Prinsip</th>
              <th>Nilai</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nomor_pengajuan || '-' }}</td>
              <td>{{ item.nama_pemohon }}</td>
              <td>{{ item.nik_pemohon }}</td>
              <td>{{ item.jenis_pembiayaan }}</td>
              <td>{{ item.prinsip_pembiayaan }}</td>
              <td>{{ formatCurrency(item.nilai_pembiayaan) }}</td>
              <td><span :class="'badge badge-' + statusClass(item.status_pengajuan)">{{ item.status_pengajuan }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <router-link :to="'/pengajuan/' + item.id" class="btn btn-outline btn-sm">Detail</router-link>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="9" class="empty-state">Tidak ada data pengajuan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="page <= 1" @click="page--; loadData()">Prev</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button :disabled="page >= totalPages" @click="page++; loadData()">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'PengajuanView',
  data() {
    return { items: [], loading: false, search: '', statusFilter: '', page: 1, totalPages: 1, searchTimeout: null };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = { page: this.page, limit: 20 };
        if (this.search) params.search = this.search;
        if (this.statusFilter) params.status = this.statusFilter;
        const { data } = await api.get('/pengajuan', { params });
        this.items = Array.isArray(data.data) ? data.data : (data.data?.rows || []);
        this.totalPages = Math.ceil((data.pagination?.total || 0) / 20);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => { this.page = 1; this.loadData(); }, 400);
    },
    formatCurrency(val) { return val ? 'Rp ' + Number(val).toLocaleString('id-ID') : '-'; },
    formatDate(val) { return val ? new Date(val).toLocaleDateString('id-ID') : '-'; },
    statusClass(s) { return ({ DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected' })[s] || 'draft'; }
  }
};
</script>
