import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import MyTasks from "./pages/MyTasks";
import MyBatches from "./pages/MyBatches"; // Import MyBatches
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login page does not use the main layout */}
          <Route path="/login" element={<Login />} />

          {/* Routes that use the main layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} /> {/* Default route is Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/batches" element={<MyBatches />} /> {/* MyBatches page */}
            <Route path="/partners" element={<Partners />} />
            <Route path="/settings" element={<div>Configurações Página</div>} /> {/* Placeholder */}
            <Route path="/tasks" element={<MyTasks />} /> {/* MyTasks page */}
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;