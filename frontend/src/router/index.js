import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'pengajuan', name: 'Pengajuan', component: () => import('../views/Pengajuan.vue') },
      { path: 'pengajuan/baru', name: 'PengajuanBaru', component: () => import('../views/PengajuanForm.vue') },
      { path: 'pengajuan/:id', name: 'PengajuanDetail', component: () => import('../views/PengajuanDetail.vue') },
      { path: 'sp3k', name: 'SP3K', component: () => import('../views/SP3K.vue') },
      { path: 'akad', name: 'Akad', component: () => import('../views/Akad.vue') },
      { path: 'verifikasi', name: 'Verifikasi', component: () => import('../views/Verifikasi.vue') },
      { path: 'pencairan', name: 'Pencairan', component: () => import('../views/Pencairan.vue') },
      { path: 'laporan', name: 'Laporan', component: () => import('../views/Laporan.vue') },
      { path: 'efek', name: 'Efek', component: () => import('../views/Efek.vue') },
      { path: 'angsuran', name: 'Angsuran', component: () => import('../views/Angsuran.vue') },
      { path: 'pic', name: 'PIC', component: () => import('../views/PIC.vue') },
      { path: 'cabang', name: 'Cabang', component: () => import('../views/Cabang.vue') },
      { path: 'stok-rumah', name: 'StokRumah', component: () => import('../views/StokRumah.vue') },
      { path: 'prioritas', name: 'Prioritas', component: () => import('../views/Prioritas.vue') },
      { path: 'pengaturan', name: 'Pengaturan', component: () => import('../views/Pengaturan.vue') }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.guest && token) {
    next('/');
  } else {
    next();
  }
});

export default router;
