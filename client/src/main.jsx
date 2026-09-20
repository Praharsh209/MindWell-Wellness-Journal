import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { setBaseUrl } from './services/api-client/custom-fetch';
import './index.css';

setBaseUrl(import.meta.env.VITE_API_URL || 'http://localhost:5000');

createRoot(document.getElementById('root'), {
    // Keeps caught errors off reportError(), which would raise the dev overlay.
    onCaughtError: (error, errorInfo) => {
        console.error(error, errorInfo.componentStack);
    },
}).render(_jsx(ErrorBoundary, { children: _jsx(App, {}) }));
