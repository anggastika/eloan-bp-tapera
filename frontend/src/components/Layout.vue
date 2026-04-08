<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>E-Loan Tapera</h2>
        <p>Sistem Pembiayaan Perumahan</p>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">Menu Utama</div>
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="nav-icon">📊</span><span>Dashboard</span>
        </router-link>
        <router-link to="/pengajuan" class="nav-item" :class="{ active: $route.path.startsWith('/pengajuan') }">
          <span class="nav-icon">📋</span><span>Pengajuan</span>
        </router-link>
        <router-link to="/sp3k" class="nav-item" :class="{ active: $route.path === '/sp3k' }">
          <span class="nav-icon">📄</span><span>SP3K</span>
        </router-link>
        <router-link to="/verifikasi" class="nav-item" :class="{ active: $route.path === '/verifikasi' }">
          <span class="nav-icon">✅</span><span>Verifikasi</span>
        </router-link>
        <router-link to="/akad" class="nav-item" :class="{ active: $route.path === '/akad' }">
          <span class="nav-icon">📝</span><span>Akad</span>
        </router-link>
        <router-link to="/pencairan" class="nav-item" :class="{ active: $route.path === '/pencairan' }">
          <span class="nav-icon">💰</span><span>Pencairan</span>
        </router-link>

        <div class="nav-section">Keuangan</div>
        <router-link to="/angsuran" class="nav-item" :class="{ active: $route.path === '/angsuran' }">
          <span class="nav-icon">📅</span><span>Jadwal Angsuran</span>
        </router-link>
        <router-link to="/efek" class="nav-item" :class="{ active: $route.path === '/efek' }">
          <span class="nav-icon">📈</span><span>Efek</span>
        </router-link>
        <router-link to="/laporan" class="nav-item" :class="{ active: $route.path === '/laporan' }">
          <span class="nav-icon">📑</span><span>Laporan</span>
        </router-link>

        <div class="nav-section">Pengelolaan</div>
        <router-link to="/pic" class="nav-item" :class="{ active: $route.path === '/pic' }">
          <span class="nav-icon">👤</span><span>PIC</span>
        </router-link>
        <router-link to="/cabang" class="nav-item" :class="{ active: $route.path === '/cabang' }">
          <span class="nav-icon">🏢</span><span>Cabang</span>
        </router-link>
        <router-link to="/stok-rumah" class="nav-item" :class="{ active: $route.path === '/stok-rumah' }">
          <span class="nav-icon">🏠</span><span>Stok Rumah</span>
        </router-link>
        <router-link to="/prioritas" class="nav-item" :class="{ active: $route.path === '/prioritas' }">
          <span class="nav-icon">⭐</span><span>Prioritas</span>
        </router-link>
        <router-link to="/pengaturan" class="nav-item" :class="{ active: $route.path === '/pengaturan' }">
          <span class="nav-icon">⚙️</span><span>Pengaturan</span>
        </router-link>
      </nav>
    </aside>

    <div class="main-content">
      <header class="topbar">
        <div class="topbar-left">
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="topbar-right">
          <div class="user-info">
            <div class="user-avatar">{{ userInitial }}</div>
            <span>{{ auth.userName }}</span>
          </div>
          <button class="btn btn-outline btn-sm" @click="logout">Logout</button>
        </div>
      </header>
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  name: 'AppLayout',
  computed: {
    auth() {
      return useAuthStore();
    },
    userInitial() {
      return this.auth.userName ? this.auth.userName.charAt(0).toUpperCase() : 'U';
    },
    pageTitle() {
      const titles = {
        Dashboard: 'Dashboard',
        Pengajuan: 'Pengajuan Pembiayaan',
        PengajuanBaru: 'Pengajuan Baru',
        PengajuanDetail: 'Detail Pengajuan',
        SP3K: 'SP3K',
        Akad: 'Akad',
        Verifikasi: 'Verifikasi Kelayakan',
        Pencairan: 'Pencairan',
        Laporan: 'Laporan',
        Efek: 'Efek',
        Angsuran: 'Jadwal Angsuran',
        PIC: 'Pengelolaan PIC',
        Cabang: 'Cabang',
        StokRumah: 'Stok Rumah',
        Prioritas: 'Pengajuan Prioritas',
        Pengaturan: 'Pengaturan'
      };
      return titles[this.$route.name] || 'E-Loan';
    }
  },
  methods: {
    logout() {
      this.auth.logout();
      this.$router.push('/login');
    }
  }
};
</script>
