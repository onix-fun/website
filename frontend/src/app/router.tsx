import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/pages/layout/RootLayout";

const HomePage = lazy(() => import("@/pages/home").then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import("@/pages/about").then((m) => ({ default: m.AboutPage })));
const CatalogPage = lazy(() => import("@/pages/catalog").then((m) => ({ default: m.CatalogPage })));
const ServicesPage = lazy(() => import("@/pages/services").then((m) => ({ default: m.ServicesPage })));
const ProductPage = lazy(() => import("@/pages/product").then((m) => ({ default: m.ProductPage })));
const DigitalPage = lazy(() => import("@/pages/digital").then((m) => ({ default: m.DigitalPage })));
const FormPage = lazy(() => import("@/pages/form").then((m) => ({ default: m.FormPage })));
const PrivacyPage = lazy(() => import("@/pages/legal").then((m) => ({ default: m.PrivacyPage })));
const PersonalDataPage = lazy(() => import("@/pages/legal").then((m) => ({ default: m.PersonalDataPage })));
const CookiesPage = lazy(() => import("@/pages/legal").then((m) => ({ default: m.CookiesPage })));
const DigitalProductPage = lazy(() =>
    import("@/pages/digital-product").then((m) => ({
        default: m.DigitalProductPage,
    })),
);
const ErrorPage = lazy(() => import("@/pages/error").then((m) => ({ default: m.ErrorPage })));

export function createAppRouter() {
    return createBrowserRouter(
        [
            {
                element: <RootLayout />,
                errorElement: <ErrorPage />,
                children: [
                    { index: true, element: <HomePage /> },
                    { path: "about", element: <AboutPage /> },
                    { path: "services", element: <ServicesPage /> },
                    { path: "catalog", element: <CatalogPage /> },
                    { path: "catalog/:id", element: <ProductPage /> },
                    { path: "digital", element: <DigitalPage /> },
                    { path: "digital/:id", element: <DigitalProductPage /> },
                    { path: "form", element: <FormPage /> },
                    { path: "privacy", element: <PrivacyPage /> },
                    { path: "personal-data", element: <PersonalDataPage /> },
                    { path: "cookies", element: <CookiesPage /> },
                    { path: "*", element: <ErrorPage /> },
                ],
            },
        ],
        {
            basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
        },
    );
}
