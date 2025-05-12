import { 
  Outlet, 
  Route, 
  Routes,
  createBrowserRouter,
  RouterProvider 
} from "react-router-dom";
import { CatchAllNavigate } from "@refinedev/react-router";

import { Layout } from "../components/layout";
import { Login } from "../pages/auth/login";
import { Register } from "../pages/auth/register";
import { Dashboard } from "../pages/dashboard";
import { ProductList } from "../pages/products/list";
import { ProductShow } from "../pages/products/show";
import { ProductCreate } from "../pages/products/create";
import { ProductEdit } from "../pages/products/edit";
import { ProductClassList } from "../pages/product-classes/list";
import { BookingList } from "../pages/bookings/list";
import { BookingShow } from "../pages/bookings/show";
import App from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        element: <Outlet />,
        children: [
          {
            path: "/",
            element: (
              <Layout>
                <Dashboard />
              </Layout>
            ),
          },
          {
            path: "/products",
            children: [
              {
                index: true,
                element: (
                  <Layout>
                    <ProductList />
                  </Layout>
                ),
              },
              {
                path: "show/:id",
                element: (
                  <Layout>
                    <ProductShow />
                  </Layout>
                ),
              },
              {
                path: "create",
                element: (
                  <Layout>
                    <ProductCreate />
                  </Layout>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <Layout>
                    <ProductEdit />
                  </Layout>
                ),
              },
            ],
          },
          {
            path: "/product-classes",
            children: [
              {
                index: true,
                element: (
                  <Layout>
                    <ProductClassList />
                  </Layout>
                ),
              },
            ],
          },
          {
            path: "/bookings",
            children: [
              {
                index: true,
                element: (
                  <Layout>
                    <BookingList />
                  </Layout>
                ),
              },
              {
                path: "show/:id",
                element: (
                  <Layout>
                    <BookingShow />
                  </Layout>
                ),
              },
            ],
          },
          {
            path: "*",
            element: <CatchAllNavigate to="/login" />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
