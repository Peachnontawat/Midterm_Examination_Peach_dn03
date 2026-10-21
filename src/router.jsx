import { createBrowserRouter, Navigate } from "react-router";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import ContactListPage from "./pages/ContactListPage";
import CreateContactPage from "./pages/CreateContactPage";
import EditContactPage from "./pages/EditContactPage";

export const router = createBrowserRouter([
  { index: true, element: <Navigate to="/contacts" replace /> },
  { path: "/login", element: <Login /> },
  {
    path: "/contacts",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ContactListPage /> },
      { path: "create", element: <CreateContactPage /> },
      { path: "edit/:contactId", element: <EditContactPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/contacts" replace /> },
]);
