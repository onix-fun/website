import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/app/RootLayout'

const HomePage = lazy(() =>
  import('@/pages/home').then((m) => ({ default: m.HomePage })),
)
const AboutPage = lazy(() =>
  import('@/pages/about').then((m) => ({ default: m.AboutPage })),
)
const CatalogPage = lazy(() =>
  import('@/pages/catalog').then((m) => ({ default: m.CatalogPage })),
)
const ProductPage = lazy(() =>
  import('@/pages/product').then((m) => ({ default: m.ProductPage })),
)
const DigitalPage = lazy(() =>
  import('@/pages/digital').then((m) => ({ default: m.DigitalPage })),
)
const DigitalProductPage = lazy(() =>
  import('@/pages/digital-product').then((m) => ({
    default: m.DigitalProductPage,
  })),
)
const ErrorPage = lazy(() =>
  import('@/pages/error').then((m) => ({ default: m.ErrorPage })),
)

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:id', element: <ProductPage /> },
      { path: 'digital', element: <DigitalPage /> },
      { path: 'digital/:id', element: <DigitalProductPage /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
])
