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
import Settings from "./pages/Settings"; // Import the new Settings page
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { InjectedTaskProvider } from "./context/InjectedTaskContext";

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
              {/* Login page does not use the main layout */}
              <Route path="/login" element={<Login />} />

              {/* Routes that use the main layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} /> {/* Default route is Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/batches" element={<MyBatches />} />
                <Route path="/batches/:id" element={<BatchDetails />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/settings" element={<Settings />} /> {/* Point to the new Settings component */}
                <Route path="/tasks" element={<MyTasks />} />
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