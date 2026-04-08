<template>
  <div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Pengajuan</div>
        <div class="stat-value">{{ stats.total || 0 }}</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-label">Menunggu Review</div>
        <div class="stat-value">{{ stats.pending || 0 }}</div>
      </div>
      <div class="stat-card success">
        <div class="stat-label">Disetujui</div>
        <div class="stat-value">{{ stats.approved || 0 }}</div>
      </div>
      <div class="stat-card info">
        <div class="stat-label">Sudah Akad</div>
        <div class="stat-value">{{ stats.akad || 0 }}</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">Ditolak</div>
        <div class="stat-value">{{ stats.rejected || 0 }}</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Pengajuan Terbaru</h3>
        <router-link to="/pengajuan" class="btn btn-outline btn-sm">Lihat Semua</router-link>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>No. Pengajuan</th>
              <th>Nama Pemohon</th>
              <th>NIK</th>
              <th>Jenis</th>
              <th>Nilai</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recentList" :key="item.id">
              <td>{{ item.nomor_pengajuan || '-' }}</td>
              <td>{{ item.nama_pemohon }}</td>
              <td>{{ item.nik_pemohon }}</td>
              <td>{{ item.jenis_pembiayaan }}</td>
              <td>{{ formatCurrency(item.nilai_pembiayaan) }}</td>
              <td><span :class="'badge badge-' + statusClass(item.status_pengajuan)">{{ item.status_pengajuan }}</span></td>
              <td>{{ formatDate(item.createdAt) }}</td>
            </tr>
            <tr v-if="recentList.length === 0">
              <td colspan="7" class="empty-state">Belum ada pengajuan</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'DashboardView',
  data() {
    return {
      stats: {},
      recentList: []
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const [statsRes, listRes] = await Promise.all([
          api.get('/pengajuan/dashboard'),
          api.get('/pengajuan?limit=10')
        ]);
        this.stats = statsRes.data.data || {};
        this.recentList = Array.isArray(listRes.data.data) ? listRes.data.data : (listRes.data.data?.rows || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      }
    },
    formatCurrency(val) {
      if (!val) return '-';
      return 'Rp ' + Number(val).toLocaleString('id-ID');
    },
    formatDate(val) {
      if (!val) return '-';
      return new Date(val).toLocaleDateString('id-ID');
    },
    statusClass(status) {
      const map = { DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected', PENDING: 'pending' };
      return map[status] || 'draft';
    }
  }
};
</script>
