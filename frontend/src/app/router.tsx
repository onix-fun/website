import { lazy, Suspense } from 'react'
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
const ProcessPage = lazy(() =>
  import('@/pages/process').then((m) => ({ default: m.ProcessPage })),
)
const DigitalCatalogPage = lazy(() =>
  import('@/pages/digital-catalog').then((m) => ({
    default: m.DigitalCatalogPage,
  })),
)
const ConstructorPage = lazy(() =>
  import('@/pages/constructor').then((m) => ({ default: m.ConstructorPage })),
)
const FormPage = lazy(() =>
  import('@/pages/form').then((m) => ({ default: m.FormPage })),
)
const TestPage = lazy(() =>
  import('@/pages/test').then((m) => ({ default: m.TestPage })),
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
      { path: 'about', element: <AboutPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'process', element: <ProcessPage /> },
      { path: 'digital-catalog', element: <DigitalCatalogPage /> },
      { path: 'constructor', element: <ConstructorPage /> },
      { path: 'form', element: <FormPage /> },
      { path: 'test', element: <TestPage /> },
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
