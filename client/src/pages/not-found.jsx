import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'wouter';
import { ArrowLeft, CircleHelp } from 'lucide-react';
import { Logo } from '@/components/mindwell-ui';
export default function NotFound() {
    return _jsx("div", { className: "grain grid min-h-[100dvh] place-items-center bg-background px-6 text-foreground", children: _jsxs("div", { className: "w-full max-w-xl text-center", children: [_jsx("div", { className: "flex justify-center", children: _jsx(Logo, {}) }), _jsx("span", { className: "mx-auto mt-16 grid size-16 place-items-center rounded-[22px] bg-secondary text-primary", children: _jsx(CircleHelp, { size: 28 }) }), _jsx("p", { className: "mt-7 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground", children: "A page went wandering" }), _jsx("h1", { className: "mt-3 font-display text-6xl tracking-[-.06em]", children: "Nothing here." }), _jsx("p", { className: "mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground", children: "This corner of MindWell hasn\u2019t been written yet. Let\u2019s get you back to your space." }), _jsxs(Link, { href: "/", className: "mt-8 inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground", "data-testid": "link-not-found-home", children: [_jsx(ArrowLeft, { className: "mr-2", size: 15 }), " Back home"] })] }) });
}
