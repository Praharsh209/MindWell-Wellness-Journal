import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Leaf, LockKeyhole } from 'lucide-react';
import { useLogin, useRegister } from '@/services/api-client/index.js';
import { Logo } from '@/components/mindwell-ui';
export function AuthPage({ mode }) {
    const [, setLocation] = useLocation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useLogin();
    const register = useRegister();
    const isLogin = mode === 'login';
    const submit = (event) => {
        event.preventDefault();
        setError('');
        const done = (result) => { window.localStorage.setItem('mindwell_token', result.token); setLocation('/dashboard'); };
        if (isLogin)
            login.mutate({ data: { email, password } }, { onSuccess: done, onError: () => setError('That combination doesn’t look right yet.') });
        else
            register.mutate({ data: { name, email, password } }, { onSuccess: done, onError: () => setError('We couldn’t make that space. Check your details and try again.') });
    };
    const pending = login.isPending || register.isPending;
    return _jsxs("div", { className: "grain min-h-[100dvh] bg-background lg:grid lg:grid-cols-[.9fr_1.1fr]", children: [_jsxs("div", { className: "hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between", children: [_jsx(Logo, { compact: true }), _jsxs("div", { children: [_jsx("p", { className: "font-mono text-[11px] uppercase tracking-[.2em] text-primary-foreground/50", children: "A private practice" }), _jsx("h1", { className: "mt-5 max-w-md font-display text-6xl leading-[.92] tracking-[-.05em]", children: "The page is yours." }), _jsx("p", { className: "mt-7 max-w-sm text-base leading-7 text-primary-foreground/65", children: "No streaks to chase. No score to improve. Just a place to meet yourself where you are." })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-primary-foreground/50", children: [_jsx(LockKeyhole, { size: 14 }), " Your thoughts stay private."] })] }), _jsxs("div", { className: "flex min-h-[100dvh] flex-col px-6 py-7 sm:px-12", children: [_jsxs("div", { className: "flex items-center justify-between lg:justify-end", children: [_jsxs(Link, { href: "/", className: "flex items-center gap-2 text-sm text-muted-foreground lg:hidden", "data-testid": "link-back-home", children: [_jsx(ArrowLeft, { size: 15 }), " home"] }), _jsx(Logo, { compact: true })] }), _jsxs("div", { className: "mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-14", children: [_jsx("span", { className: "mb-7 grid size-11 place-items-center rounded-2xl bg-secondary text-primary", children: _jsx(Leaf, { size: 20 }) }), _jsx("p", { className: "font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground", children: isLogin ? 'Welcome back' : 'Begin here' }), _jsx("h1", { className: "mt-3 font-display text-5xl tracking-[-.05em]", children: isLogin ? 'Good to see you.' : 'Make some room.' }), _jsx("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: isLogin ? 'Your quiet space is ready when you are.' : 'A private place for your daily check-ins and honest pages.' }), _jsxs("form", { onSubmit: submit, className: "mt-9 space-y-4", children: [!isLogin && _jsx(Field, { label: "Your name", value: name, onChange: setName, placeholder: "What should we call you?", type: "text", testId: "input-name" }), _jsx(Field, { label: "Email", value: email, onChange: setEmail, placeholder: "you@example.com", type: "email", testId: "input-email" }), _jsx(Field, { label: "Password", value: password, onChange: setPassword, placeholder: "At least 8 characters", type: "password", testId: "input-password" }), error && _jsx("p", { className: "rounded-xl bg-destructive/8 px-3 py-2.5 text-sm text-destructive", "data-testid": "status-auth-error", children: error }), _jsxs("button", { disabled: pending, className: "mt-3 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60", "data-testid": "button-auth-submit", children: [pending ? 'Opening your space…' : isLogin ? 'Sign in' : 'Create my space', " ", _jsx(ArrowRight, { className: "ml-2 inline", size: 16 })] })] }), _jsxs("p", { className: "mt-7 text-center text-sm text-muted-foreground", children: [isLogin ? 'New here? ' : 'Already have a space? ', _jsx(Link, { href: isLogin ? '/register' : '/login', className: "font-semibold text-primary underline-offset-4 hover:underline", "data-testid": "link-auth-switch", children: isLogin ? 'Create an account' : 'Sign in' })] })] })] })] });
}
function Field({ label, value, onChange, placeholder, type, testId }) {
    return _jsxs("label", { className: "block", children: [_jsx("span", { className: "mb-2 block text-xs font-semibold text-foreground", children: label }), _jsx("input", { required: true, minLength: type === 'password' ? 8 : undefined, type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-accent/50", "data-testid": testId })] });
}
