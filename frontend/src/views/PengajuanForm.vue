<template>
  <div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="success" class="alert alert-success">{{ success }}</div>

    <form @submit.prevent="handleSubmit">
      <div class="card">
        <h3 class="card-title">Data Pemohon</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">NIK *</label>
            <input v-model="form.nik_pemohon" type="text" class="form-control" maxlength="16" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nama Pemohon *</label>
            <input v-model="form.nama_pemohon" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tempat Lahir</label>
            <input v-model="form.tempat_lahir" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Lahir *</label>
            <input v-model="form.tanggal_lahir" type="date" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nomor KK *</label>
            <input v-model="form.nomor_kk" type="text" class="form-control" maxlength="16" required />
          </div>
          <div class="form-group">
            <label class="form-label">No HP *</label>
            <input v-model="form.nomor_hp" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">NPWP</label>
            <input v-model="form.npwp" type="text" class="form-control" maxlength="16" />
          </div>
          <div class="form-group">
            <label class="form-label">Alamat</label>
            <input v-model="form.alamat" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Pekerjaan *</label>
            <input v-model="form.pekerjaan" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Penghasilan *</label>
            <input v-model="form.penghasilan" type="number" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Status Nikah *</label>
            <select v-model="form.status_nikah" class="form-control" required>
              <option value="">Pilih</option>
              <option value="BELUM_KAWIN">Belum Kawin</option>
              <option value="KAWIN">Kawin</option>
              <option value="CERAI_HIDUP">Cerai Hidup</option>
              <option value="CERAI_MATI">Cerai Mati</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Data Pembiayaan</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Jenis Pembiayaan *</label>
            <select v-model="form.jenis_pembiayaan" class="form-control" required>
              <option value="">Pilih</option>
              <option value="KPR">KPR</option>
              <option value="KBR">KBR</option>
              <option value="KRR">KRR</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Prinsip Pembiayaan *</label>
            <select v-model="form.prinsip_pembiayaan" class="form-control" required>
              <option value="">Pilih</option>
              <option value="KONVENSIONAL">Konvensional</option>
              <option value="SYARIAH">Syariah</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Produk *</label>
            <input v-model="form.produk" type="text" class="form-control" placeholder="cth: KPR Tapera" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tipe Program</label>
            <select v-model="form.tipe_program" class="form-control">
              <option value="">Pilih</option>
              <option value="TAPERA">Tapera</option>
              <option value="FLPP">FLPP</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Nilai Pembiayaan *</label>
            <input v-model="form.nilai_pembiayaan" type="number" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tenor (bulan)</label>
            <input v-model="form.tenor" type="number" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Suku Bunga (%)</label>
            <input v-model="form.bunga" type="number" step="0.01" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Uang Muka</label>
            <input v-model="form.uang_muka" type="number" class="form-control" />
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Data Properti</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Alamat Agunan</label>
            <input v-model="form.alamat_agunan" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Kode Wilayah Agunan</label>
            <input v-model="form.kode_wilayah_agunan" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">ID Lokasi</label>
            <input v-model="form.id_lokasi" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Harga Rumah</label>
            <input v-model="form.harga_rumah" type="number" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">RT Agunan</label>
            <input v-model="form.rt_agunan" type="text" class="form-control" maxlength="5" />
          </div>
          <div class="form-group">
            <label class="form-label">RW Agunan</label>
            <input v-model="form.rw_agunan" type="text" class="form-control" maxlength="5" />
          </div>
          <div class="form-group">
            <label class="form-label">Blok Agunan</label>
            <input v-model="form.blok_agunan" type="text" class="form-control" maxlength="10" />
          </div>
          <div class="form-group">
            <label class="form-label">Nomor Unit Agunan</label>
            <input v-model="form.nomor_unit_agunan" type="text" class="form-control" maxlength="10" />
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;justify-content:flex-end">
        <router-link to="/pengajuan" class="btn btn-outline">Batal</router-link>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Menyimpan...' : 'Simpan Draft' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'PengajuanFormView',
  data() {
    return {
      loading: false,
      error: '',
      success: '',
      form: {
        nik_pemohon: '', nama_pemohon: '', tempat_lahir: '', tanggal_lahir: '',
        nomor_kk: '', nomor_hp: '', email: '', npwp: '', alamat: '',
        pekerjaan: '', penghasilan: '', status_nikah: '',
        produk: '', jenis_pembiayaan: '', prinsip_pembiayaan: '', tipe_program: '',
        nilai_pembiayaan: '', tenor: '', bunga: '', uang_muka: '',
        alamat_agunan: '', kode_wilayah_agunan: '', id_lokasi: '',
        harga_rumah: '', rt_agunan: '', rw_agunan: '', blok_agunan: '', nomor_unit_agunan: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.success = '';
      this.loading = true;
      try {
        const payload = {};
        for (const [key, value] of Object.entries(this.form)) {
          payload[key] = value === '' ? null : value;
        }
        const { data } = await api.post('/pengajuan', payload);
        this.success = 'Pengajuan berhasil disimpan sebagai draft';
        setTimeout(() => this.$router.push('/pengajuan/' + data.data.id), 1500);
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal menyimpan pengajuan';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
