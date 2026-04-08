<template>
  <div>
    <div v-if="loading" class="loading"><div class="spinner"></div></div>
    <template v-else-if="item">
      <div v-if="message" :class="'alert alert-' + messageType">{{ message }}</div>

      <div class="toolbar">
        <router-link to="/pengajuan" class="btn btn-outline">&larr; Kembali</router-link>
        <div style="display:flex;gap:8px">
          <button v-if="item.status_pengajuan === 'DRAFT'" class="btn btn-primary" @click="submitToTapera" :disabled="submitting">
            {{ submitting ? 'Mengirim...' : 'Submit ke Tapera' }}
          </button>
          <button v-if="item.status_pengajuan === 'SUBMITTED'" class="btn btn-warning" @click="followUp" :disabled="submitting">
            Follow Up
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Informasi Pengajuan</h3>
          <span :class="'badge badge-' + statusClass(item.status_pengajuan)">{{ item.status_pengajuan }}</span>
        </div>
        <div class="form-row">
          <div><strong>No. Pengajuan:</strong> {{ item.nomor_pengajuan || '-' }}</div>
          <div><strong>ID Tapera:</strong> {{ item.id_pengajuan || '-' }}</div>
          <div><strong>Tanggal:</strong> {{ formatDate(item.createdAt) }}</div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Data Pemohon</h3>
        <div class="form-row">
          <div><strong>NIK:</strong> {{ item.nik_pemohon }}</div>
          <div><strong>Nama:</strong> {{ item.nama_pemohon }}</div>
          <div><strong>No HP:</strong> {{ item.nomor_hp || '-' }}</div>
          <div><strong>Email:</strong> {{ item.email || '-' }}</div>
          <div><strong>Pekerjaan:</strong> {{ item.pekerjaan || '-' }}</div>
          <div><strong>Penghasilan:</strong> {{ formatCurrency(item.penghasilan) }}</div>
          <div><strong>Alamat:</strong> {{ item.alamat || '-' }}</div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Data Pembiayaan</h3>
        <div class="form-row">
          <div><strong>Jenis:</strong> {{ item.jenis_pembiayaan }}</div>
          <div><strong>Prinsip:</strong> {{ item.prinsip_pembiayaan }}</div>
          <div><strong>Program:</strong> {{ item.tipe_program || '-' }}</div>
          <div><strong>Nilai:</strong> {{ formatCurrency(item.nilai_pembiayaan) }}</div>
          <div><strong>Tenor:</strong> {{ item.tenor || '-' }} bulan</div>
          <div><strong>Suku Bunga:</strong> {{ item.bunga || '-' }}%</div>
          <div><strong>Uang Muka:</strong> {{ formatCurrency(item.uang_muka) }}</div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Data Properti</h3>
        <div class="form-row">
          <div><strong>Alamat Agunan:</strong> {{ item.alamat_agunan || '-' }}</div>
          <div><strong>Kode Wilayah:</strong> {{ item.kode_wilayah_agunan || '-' }}</div>
          <div><strong>Harga Rumah:</strong> {{ formatCurrency(item.harga_rumah) }}</div>
          <div><strong>RT/RW:</strong> {{ item.rt_agunan || '-' }}/{{ item.rw_agunan || '-' }}</div>
          <div><strong>Blok/Unit:</strong> {{ item.blok_agunan || '-' }}/{{ item.nomor_unit_agunan || '-' }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'PengajuanDetailView',
  data() {
    return { item: null, loading: true, submitting: false, message: '', messageType: 'success' };
  },
  created() { this.loadData(); },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await api.get('/pengajuan/' + this.$route.params.id);
        this.item = data.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async submitToTapera() {
      this.submitting = true;
      try {
        await api.post('/pengajuan/' + this.item.id + '/submit');
        this.message = 'Berhasil dikirim ke BP Tapera';
        this.messageType = 'success';
        await this.loadData();
      } catch (err) {
        this.message = err.response?.data?.message || 'Gagal mengirim';
        this.messageType = 'danger';
      } finally {
        this.submitting = false;
      }
    },
    async followUp() {
      this.submitting = true;
      try {
        await api.post('/pengajuan/follow-up', { id_pengajuan: this.item.id });
        this.message = 'Follow up berhasil';
        this.messageType = 'success';
        await this.loadData();
      } catch (err) {
        this.message = err.response?.data?.message || 'Gagal follow up';
        this.messageType = 'danger';
      } finally {
        this.submitting = false;
      }
    },
    formatCurrency(val) { return val ? 'Rp ' + Number(val).toLocaleString('id-ID') : '-'; },
    formatDate(val) { return val ? new Date(val).toLocaleDateString('id-ID') : '-'; },
    statusClass(s) { return ({ DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected' })[s] || 'draft'; }
  }
};
</script>
