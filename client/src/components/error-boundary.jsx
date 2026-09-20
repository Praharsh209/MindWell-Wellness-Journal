import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component, } from 'react';
function toError(value) {
    if (value instanceof Error) {
        return value;
    }
    if (typeof value === 'string') {
        return new Error(value);
    }
    try {
        return new Error(JSON.stringify(value));
    }
    catch {
        return new Error(String(value));
    }
}
function DefaultFallback({ error, resetError }) {
    return (_jsx("div", { className: "grain grid min-h-[100dvh] w-full place-items-center bg-background p-6 text-foreground", children: _jsxs("div", { className: "w-full max-w-lg rounded-[26px] border border-border bg-card p-7 text-center shadow-lg", children: [_jsx("div", { className: "mx-auto mb-5 grid size-11 place-items-center rounded-2xl bg-secondary font-display text-2xl text-primary", children: "!" }), _jsx("h1", { className: "font-display text-3xl tracking-[-.04em]", children: "A quiet interruption" }), _jsx("p", { className: "mt-2 text-sm leading-6 text-muted-foreground", children: "Something unexpected happened in this space. Your saved pages are safe." }), import.meta.env.DEV ? (_jsx("pre", { className: "mt-4 overflow-x-auto rounded-xl bg-secondary p-3 text-left text-xs text-muted-foreground", children: error.message || String(error) })) : null, _jsx("button", { type: "button", onClick: resetError, className: "mt-5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90", children: "Try again" })] }) }));
}
export class ErrorBoundary extends Component {
    state = { error: null };
    static getDerivedStateFromError(error) {
        return { error: toError(error) };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error:', toError(error), info.componentStack);
    }
    componentDidUpdate(prevProps) {
        if (this.state.error !== null &&
            prevProps.resetKey !== this.props.resetKey) {
            this.resetError();
        }
    }
    resetError = () => {
        this.setState({ error: null });
    };
    render() {
        const { error } = this.state;
        if (error === null) {
            return this.props.children;
        }
        const Fallback = this.props.FallbackComponent ?? DefaultFallback;
        return _jsx(Fallback, { error: error, resetError: this.resetError });
    }
}
