import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AdminLogin } from './admin/AdminLogin.tsx'
import { AdminLayout } from './admin/AdminLayout.tsx'
import { DashboardPage } from './admin/DashboardPage.tsx'
import { ProductsPage } from './admin/ProductsPage.tsx'
import { CategoriesPage } from './admin/CategoriesPage.tsx'
import { SettingsPage } from './admin/SettingsPage.tsx'


// Allow direct /admin URLs to work while using HashRouter
if (!window.location.hash && window.location.pathname.startsWith('/admin')) {
  const target = `${window.location.pathname}${window.location.search}`;
  window.location.replace(`/#${target}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
