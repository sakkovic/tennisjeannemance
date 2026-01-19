import { useEffect } from 'react';
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from './components/Navigation';
import Home from './components/Home';
import Reservations from './components/Reservations';
import Footer from './components/Footer';
import MobileBookButton from './components/MobileBookButton';
import BackToTop from './components/BackToTop';
import PlayerPortal from './components/PlayerPortal';
import useDynamicTheme from './hooks/use-dynamic-theme';

function App() {
  const { navRef, mainRef } = useDynamicTheme();
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div ref={mainRef} className="min-h-screen overflow-x-hidden flex flex-col">
            <Navigation ref={navRef} />

            <main className="flex-grow pt-32">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/reservations" component={Reservations} />
                <Route path="/portal" component={PlayerPortal} />
                {/* Fallback to Home for unknown routes */}
                <Route component={Home} />
              </Switch>
            </main>

            {location !== '/portal' && (
              <>
                <Footer />
                <MobileBookButton />
                <BackToTop />
              </>
            )}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

