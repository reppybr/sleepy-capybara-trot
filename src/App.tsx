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
import RegisterStage from "./pages/RegisterStage";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { SupabaseAuthProvider } from "./context/SupabaseAuthContext";
import { InjectedTaskProvider } from "./context/InjectedTaskContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SupabaseAuthProvider>
          <InjectedTaskProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/batches" element={<MyBatches />} />
                  <Route path="/batches/:id" element={<BatchDetails />} />
                  <Route path="/register-stage/:id" element={<RegisterStage />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/register-enterprise" element={<RegisterEnterprise />} />
                  <Route path="/tasks" element={<MyTasks />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </InjectedTaskProvider>
        </SupabaseAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;