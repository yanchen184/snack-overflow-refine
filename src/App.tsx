import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { 
  ChakraProvider, 
  extendTheme, 
  ColorModeScript
} from "@chakra-ui/react";

import { Outlet, Route, Routes } from "react-router-dom";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { Layout } from "./components/layout";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { Dashboard } from "./pages/dashboard";
import { ProductList } from "./pages/products/list";
import { ProductShow } from "./pages/products/show";
import { ProductCreate } from "./pages/products/create";
import { ProductEdit } from "./pages/products/edit";
import { ProductClassList } from "./pages/product-classes/list";
import { BookingList } from "./pages/bookings/list";
import { BookingShow } from "./pages/bookings/show";

// Extend Chakra theme
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
});

// App version number displayed in header
const APP_VERSION = "1.4.0";

function App() {
  // API base URL
  const API_URL = "http://localhost:8080/api";

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <DevtoolsProvider>
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider(API_URL)}
            authProvider={authProvider}
            routerProvider={routerBindings}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "7hGBey-enRm2T-CIZlGe",
            }}
            resources={[
              {
                name: "dashboard",
                list: "/",
              },
              {
                name: "products",
                list: "/products",
                show: "/products/show/:id",
                create: "/products/create",
                edit: "/products/edit/:id",
                meta: {
                  canDelete: true,
                },
              },
              {
                name: "product-classes",
                list: "/product-classes",
                meta: {
                  canDelete: true,
                },
              },
              {
                name: "bookings",
                list: "/bookings",
                show: "/bookings/show/:id",
                create: "/bookings/create",
                edit: "/bookings/edit/:id",
                meta: {
                  canDelete: true,
                },
              },
            ]}
          >
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                element={
                  <Outlet />
                }
              >
                {/* Dashboard */}
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  }
                />

                {/* Products */}
                <Route path="/products">
                  <Route
                    index
                    element={
                      <Layout>
                        <ProductList />
                      </Layout>
                    }
                  />
                  <Route
                    path="show/:id"
                    element={
                      <Layout>
                        <ProductShow />
                      </Layout>
                    }
                  />
                  <Route
                    path="create"
                    element={
                      <Layout>
                        <ProductCreate />
                      </Layout>
                    }
                  />
                  <Route
                    path="edit/:id"
                    element={
                      <Layout>
                        <ProductEdit />
                      </Layout>
                    }
                  />
                </Route>

                {/* Product Classes */}
                <Route path="/product-classes">
                  <Route
                    index
                    element={
                      <Layout>
                        <ProductClassList />
                      </Layout>
                    }
                  />
                </Route>

                {/* Bookings */}
                <Route path="/bookings">
                  <Route
                    index
                    element={
                      <Layout>
                        <BookingList />
                      </Layout>
                    }
                  />
                  <Route
                    path="show/:id"
                    element={
                      <Layout>
                        <BookingShow />
                      </Layout>
                    }
                  />
                </Route>

                {/* Catch-all route for authentication */}
                <Route path="*" element={<CatchAllNavigate to="/login" />} />
              </Route>
            </Routes>

            {/* Core components */}
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          <DevtoolsPanel />
        </RefineKbarProvider>
      </DevtoolsProvider>
    </ChakraProvider>
  );
}

export default App;
