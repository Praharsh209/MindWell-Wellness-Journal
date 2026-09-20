import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setAuthTokenGetter } from '@/services/api-client/index.js';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import { AuthPage } from '@/pages/auth';
import { BreathePage, DashboardPage, JournalPage, MoodPage, SettingsPage, UpgradePage, } from '@/pages/app';
import { Route, Switch, useLocation, Router as WouterRouter, } from 'wouter';
const queryClient = new QueryClient();
function Router() {
    return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    _jsx(RoutedErrorBoundary, { children: _jsxs(Switch, { children: [_jsx(Route, { path: "/", component: Home }), _jsx(Route, { path: "/login", children: () => _jsx(AuthPage, { mode: "login" }) }), _jsx(Route, { path: "/register", children: () => _jsx(AuthPage, { mode: "register" }) }), _jsx(Route, { path: "/dashboard", component: DashboardPage }), _jsx(Route, { path: "/journal", component: JournalPage }), _jsx(Route, { path: "/journal/:id", component: JournalPage }), _jsx(Route, { path: "/mood", component: MoodPage }), _jsx(Route, { path: "/breathe", component: BreathePage }), _jsx(Route, { path: "/settings", component: SettingsPage }), _jsx(Route, { path: "/upgrade", component: UpgradePage }), _jsx(Route, { component: NotFound })] }) }));
}
function RoutedErrorBoundary({ children }) {
    const [location] = useLocation();
    return _jsx(ErrorBoundary, { resetKey: location, children: children });
}
function App() {
    useEffect(() => {
        setAuthTokenGetter(() => window.localStorage.getItem('mindwell_token'));
        return () => setAuthTokenGetter(null);
    }, []);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsxs(TooltipProvider, { children: [_jsx(WouterRouter, { base: import.meta.env.BASE_URL.replace(/\/$/, ''), children: _jsx(Router, {}) }), _jsx(Toaster, {})] }) }));
}
export default App;
