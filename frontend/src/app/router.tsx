import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/app/RootLayout'

const HomePage = lazy(() =>
  import('@/pages/home').then((m) => ({ default: m.HomePage })),
)
const CatalogPage = lazy(() =>
  import('@/pages/catalog').then((m) => ({ default: m.CatalogPage })),
)
const FormPage = lazy(() =>
  import('@/pages/form').then((m) => ({ default: m.FormPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })),
)
const ErrorPage = lazy(() =>
  import('@/pages/error').then((m) => ({ default: m.ErrorPage })),
)

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'form', element: <FormPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: (
      <Suspense fallback={null}>
        <ErrorPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
])
