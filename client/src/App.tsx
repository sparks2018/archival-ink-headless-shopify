import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import ArtistPage from "./pages/ArtistPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import SubmitArtPage from "./pages/SubmitArtPage";
import GalleryPage from "./pages/GalleryPage";
import AllArtistsPage from "./pages/AllArtistsPage";
import { EmailCaptureManager } from "./components/EmailCaptureManager";
import { MigrationNotification } from "./components/MigrationNotification";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/artists" component={AllArtistsPage} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/artist/:slug" component={ArtistPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/submit-art" component={SubmitArtPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <FavoritesProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <EmailCaptureManager />
              <MigrationNotification />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
