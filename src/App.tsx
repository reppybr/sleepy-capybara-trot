import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import MyTasks from "./pages/MyTasks";
import MyBatches from "./pages/MyBatches";
import BatchDetails from "./pages/BatchDetails";
import Settings from "./pages/Settings";
import RegisterEnterprise from "./pages/RegisterEnterprise";
import RegisterStage from "./pages/RegisterStage"; // Import the new page
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { InjectedTaskProvider } from "./context/InjectedTaskContext";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <InjectedTaskProvider>
            <Routes>
              {/* Login page does not use the main layout and is publicly accessible */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} /> {/* Default route is Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/batches" element={<MyBatches />} />
                  <Route path="/batches/:id" element={<BatchDetails />} />
                  <Route path="/register-stage/:id" element={<RegisterStage />} /> {/* New route */}
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/register-enterprise" element={<RegisterEnterprise />} />
                  <Route path="/tasks" element={<MyTasks />} />
                </Route>
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </InjectedTaskProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;