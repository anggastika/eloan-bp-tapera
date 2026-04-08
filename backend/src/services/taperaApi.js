const axios = require('axios');
const CryptoJS = require('crypto-js');
const logger = require('../config/logger');
const { MitraConfig } = require('../models');

class TaperaApiService {
  constructor() {
    this.baseUrl = process.env.TAPERA_BASE_URL || 'https://apidev.tapera.go.id:8443';
    this.clientSecret = process.env.TAPERA_CLIENT_SECRET || '';
  }

  async getActiveMitraConfig() {
    const config = await MitraConfig.findOne({ where: { is_active: true } });
    if (!config) {
      throw new Error('No active Mitra configuration found');
    }
    return config;
  }

  async getToken() {
    const config = await this.getActiveMitraConfig();

    if (config.access_token && config.token_expires_at && new Date(config.token_expires_at) > new Date()) {
      return config.access_token;
    }

    try {
      const response = await axios.post(`${config.base_url}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: config.client_id,
        client_secret: config.client_secret
      });

      const token = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      await config.update({
        access_token: token,
        token_expires_at: expiresAt
      });

      return token;
    } catch (error) {
      logger.error('Failed to get OAuth token:', error.message);
      throw new Error('Failed to authenticate with BP Tapera');
    }
  }

  generateSignature(requestPath, httpMethod, token, timestamp, requestBody) {
    const body = requestBody ? JSON.stringify(requestBody) : '';
    const payload = `path=${requestPath}&verb=${httpMethod}&token=${token}&timestamp=${timestamp}&body=${body}`;
    const hmacSignature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(payload, this.clientSecret)
    );
    return hmacSignature;
  }

  async buildHeaders(requestPath, httpMethod, cabangMitra, picMitra, requestBody) {
    const config = await this.getActiveMitraConfig();
    const token = await this.getToken();
    const timestamp = new Date().toISOString();
    const signature = this.generateSignature(requestPath, httpMethod, token, timestamp, requestBody);

    return {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'application/gzip',
      'Kode-Mitra': config.kode_mitra,
      'Cabang-Mitra': cabangMitra || 'PUSAT',
      'PIC-Mitra': picMitra || '',
      'Token-Mitra': token,
      'Signature-Mitra': signature,
      'Timestamp-Mitra': timestamp,
      'Channel-Mitra': process.env.TAPERA_CHANNEL || 'WEB'
    };
  }

  async request(method, path, data, cabangMitra, picMitra) {
    const config = await this.getActiveMitraConfig();
    const url = `${config.base_url}${path}`;
    const headers = await this.buildHeaders(path, method.toUpperCase(), cabangMitra, picMitra, data);

    try {
      const response = await axios({
        method,
        url,
        headers,
        data: method !== 'GET' ? data : undefined,
        params: method === 'GET' ? data : undefined,
        timeout: 30000
      });

      logger.info(`Tapera API ${method} ${path} - Status: ${response.status}`);
      return response.data;
    } catch (error) {
      logger.error(`Tapera API Error ${method} ${path}:`, error.response?.data || error.message);
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.status || 'BP Tapera API Error',
        data: error.response?.data
      };
    }
  }

  // === Pengajuan Pembiayaan ===
  async submitPengajuan(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/pengajuan', data, cabang, pic);
  }

  async followUpPengajuan(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/follow-up', data, cabang, pic);
  }

  async listPengajuan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/pengajuan/list', params, cabang, pic);
  }

  async detailPengajuan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/pengajuan/detail', params, cabang, pic);
  }

  async inquiryByNik(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/pengajuan/inquiry', params, cabang, pic);
  }

  async uploadDokumen(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/pengajuan/upload', data, cabang, pic);
  }

  // === SP3K ===
  async submitSP3K(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/sp3k', data, cabang, pic);
  }

  async listSP3K(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/sp3k/list', params, cabang, pic);
  }

  async detailSP3K(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/sp3k/detail', params, cabang, pic);
  }

  // === Verifikasi Kelayakan ===
  async layakHuniPic(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/layak-huni/pic', data, cabang, pic);
  }

  async layakBangunRumah(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/layak-kbr', data, cabang, pic);
  }

  async layakRenovasiRumah(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/layak-krr', data, cabang, pic);
  }

  async cekKelayakan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/layak-huni', params, cabang, pic);
  }

  // === Akad ===
  async submitAkad(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/akad', data, cabang, pic);
  }

  async listAkad(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/akad/list', params, cabang, pic);
  }

  async detailAkad(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/akad/detail', params, cabang, pic);
  }

  // === Pencairan ===
  async submitPencairanTapera(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/pencairan/tapera', data, cabang, pic);
  }

  async submitPencairanFlpp(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/pencairan/flpp', data, cabang, pic);
  }

  async listPencairan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/pencairan/list', params, cabang, pic);
  }

  async detailPencairan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/pencairan/detail', params, cabang, pic);
  }

  // === Laporan ===
  async submitLaporanOutstanding(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/laporan/outstanding', data, cabang, pic);
  }

  async submitLaporanPelunasan(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/laporan/pelunasan', data, cabang, pic);
  }

  // === Efek ===
  async submitAmortisasi(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/efek/amortisasi', data, cabang, pic);
  }

  async submitEfek(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/efek', data, cabang, pic);
  }

  async listEfek(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/efek/list', params, cabang, pic);
  }

  async detailEfek(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/efek/detail', params, cabang, pic);
  }

  // === Jadwal Angsuran FLPP ===
  async submitJadwalAngsuran(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pembiayaan/jadwal-angsuran', data, cabang, pic);
  }

  async listAngsuran7525(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/jadwal-angsuran/7525/list', params, cabang, pic);
  }

  async listAngsuran9010(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/jadwal-angsuran/9010/list', params, cabang, pic);
  }

  async detailAngsuran7525(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/jadwal-angsuran/7525/detail', params, cabang, pic);
  }

  async detailAngsuran9010(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pembiayaan/jadwal-angsuran/9010/detail', params, cabang, pic);
  }

  // === Pengelolaan PIC ===
  async tambahPic(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pic', data, cabang, pic);
  }

  async listPic(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pic/list', params, cabang, pic);
  }

  async ubahPic(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pic/update', data, cabang, pic);
  }

  async hapusPic(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pic/delete', data, cabang, pic);
  }

  async detailPic(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/pic/detail', params, cabang, pic);
  }

  async assignRolePic(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/pic/assign-role', data, cabang, pic);
  }

  // === Stok Rumah ===
  async listPerumahan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/stok-rumah/perumahan', params, cabang, pic);
  }

  async listRumah(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/stok-rumah/rumah', params, cabang, pic);
  }

  async detailRumah(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/stok-rumah/rumah/detail', params, cabang, pic);
  }

  // === Parameter ===
  async listProduk(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/produk', params, cabang, pic);
  }

  async detailProduk(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/produk/detail', params, cabang, pic);
  }

  async getProvinsi(cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/provinsi', {}, cabang, pic);
  }

  async getKabupaten(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/kabupaten', params, cabang, pic);
  }

  async getKecamatan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/kecamatan', params, cabang, pic);
  }

  async getKelurahan(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/kelurahan', params, cabang, pic);
  }

  async listProses(cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/proses', {}, cabang, pic);
  }

  async cekLimit(cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/limit', {}, cabang, pic);
  }

  async listErrorCode(cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/error-code', {}, cabang, pic);
  }

  async detailErrorCode(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/error-code/detail', params, cabang, pic);
  }

  async getSegmenPekerjaan(cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/segmen-pekerjaan', {}, cabang, pic);
  }

  async getStatusPernikahan(cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/parameter/status-pernikahan', {}, cabang, pic);
  }

  // === Pengajuan Prioritas ===
  async submitPrioritas(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/prioritas/request', data, cabang, pic);
  }

  async listPrioritas(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/prioritas', params, cabang, pic);
  }

  async cekPrioritas(params, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/prioritas/inquiry', params, cabang, pic);
  }

  async updatePrioritas(data, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/prioritas/request/update', data, cabang, pic);
  }

  // === Cabang ===
  async tambahCabang(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/cabang', data, cabang, pic);
  }

  async listCabang(params, cabang, pic) {
    return this.request('GET', '/api/mitra-penyalur/v2/cabang/list', params, cabang, pic);
  }

  async ubahCabang(data, cabang, pic) {
    return this.request('POST', '/api/mitra-penyalur/v2/cabang/update', data, cabang, pic);
  }
}

module.exports = new TaperaApiService();
