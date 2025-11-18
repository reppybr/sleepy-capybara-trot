import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout"; // Import the new Layout component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout> {/* Wrap routes with the new Layout component */}
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/batches" element={<div>My Batches Page</div>} /> {/* Placeholder */}
            <Route path="/partners" element={<div>My Network Page</div>} /> {/* Placeholder */}
            <Route path="/settings" element={<div>Settings Page</div>} /> {/* Placeholder */}
            <Route path="/management" element={<div>Management Page</div>} /> {/* Placeholder for brand_owner */}
            <Route path="/tasks" element={<div>My Tasks Page</div>} /> {/* Placeholder for partners */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;