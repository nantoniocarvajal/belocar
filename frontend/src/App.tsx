import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

import { HomePage } from './pages/public/HomePage'
import { CatalogPage } from './pages/public/CatalogPage'
import { ProductDetailPage } from './pages/public/ProductDetailPage'
import { CartPage } from './pages/public/CartPage'
import { AboutPage } from './pages/public/AboutPage'
import { ShippingPage } from './pages/public/ShippingPage'
import { ContactPage } from './pages/public/ContactPage'
import { FaqPage } from './pages/public/FaqPage'
import { NotFoundPage } from './pages/public/NotFoundPage'

import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminSiteConfigPage } from './pages/admin/AdminSiteConfigPage'
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage'
import { AdminQuoteDetailPage } from './pages/admin/AdminQuoteDetailPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalogo/:slug" element={<ProductDetailPage />} />
        <Route path="/cotizacion" element={<CartPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/despachos-y-retiros" element={<ShippingPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/preguntas-frecuentes" element={<FaqPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/productos" replace />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="productos/nuevo" element={<AdminProductFormPage />} />
          <Route path="productos/:id/editar" element={<AdminProductFormPage />} />
          <Route path="categorias" element={<AdminCategoriesPage />} />
          <Route path="cotizaciones" element={<AdminQuotesPage />} />
          <Route path="cotizaciones/:id" element={<AdminQuoteDetailPage />} />
          <Route path="configuracion" element={<AdminSiteConfigPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
