import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { Activity, ArrowDownToLine, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Crown, Flame, HeartPulse, LockKeyhole, Moon, Pause, Pencil, Play, Plus, Save, Search, ShieldCheck, Sparkles, Sun, Trash2, X, } from 'lucide-react';
import { getExportDataQueryKey, getGetJournalQueryKey, getGetCurrentUserQueryKey, getListJournalsQueryKey, getListMoodsQueryKey, useCreateJournal, useDeleteJournal, useExportData, useGetDashboard, useGetJournal, useGetMoodAnalytics, useGetCurrentUser, useListJournals, useListMoods, useUpdateJournal, useUpdateProfile, useUpsertTodayMood, useUpgradePremium, } from '@/services/api-client/index.js';
import { AppShell, Button, EmptyState, ErrorState, PageLoader, SectionHeading, StatCard } from '@/components/mindwell-ui';
const fmt = (date) => date ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) : 'Today';
const today = () => new Date().toISOString().slice(0, 10);
export function DashboardPage() {
    const { data, isLoading, isError, refetch } = useGetDashboard();
    const { data: analytics } = useGetMoodAnalytics();

    if (isLoading)
        return _jsx(AppShell, {
            children: _jsx(PageLoader, {})
        });

    if (isError || !data)
        return _jsx(AppShell, {
            children: _jsx(ErrorState, {
                onRetry: () => refetch()
            })
        });

    const trend = analytics?.trend ?? [];

    return _jsxs(AppShell, {
        children: [
            _jsx(SectionHeading, {
                eyebrow: "Your overview",
                title: "Good morning.",
                text: "A small check-in is still a check-in. Here’s the shape of your space lately.",
                action: _jsxs(Link, {
                    href: "/journal",
                    className: "rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground",
                    "data-testid": "link-new-entry-dashboard",
                    children: [
                        _jsx(Plus, {
                            className: "mr-1 inline",
                            size: 15
                        }),
                        " New entry"
                    ]
                })
            }),

            _jsxs("div", {
                className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                children: [
                    _jsx(StatCard, {
                        label: "Current streak",
                        value: `${data.streak} days`,
                        note: "The rhythm is yours to keep.",
                        icon: Flame,
                        tint: "bg-[#f7e2b0]"
                    }),

                    _jsx(StatCard, {
                        label: "Pages written",
                        value: data.totalEntries,
                        note: "Every page counts.",
                        icon: BookOpen,
                        tint: "bg-[#d7e5d3]"
                    }),

                    _jsx(StatCard, {
                        label: "Average mood",
                        value: data.averageMood.toFixed(1),
                        note: "Out of ten, recently.",
                        icon: Activity,
                        tint: "bg-[#e6d6d4]"
                    }),

                    _jsx(StatCard, {
                        label: "Today",
                        value: data.todayMood
                            ? `${data.todayMood.mood}/10`
                            : 'Open',
                        note: data.todayMood
                            ? `${data.todayMood.emotion} energy`
                            : 'A moment for yourself.',
                        icon: HeartPulse,
                        tint: "bg-secondary"
                    })
                ]
            }),

            _jsxs("div", {
                className: "mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]",
                children: [

                    _jsxs("section", {
                        className: "rounded-[24px] border border-card-border bg-card p-6 sm:p-7",
                        children: [

                            _jsxs("div", {
                                className: "flex items-start justify-between",
                                children: [

                                    _jsxs("div", {
                                        children: [
                                            _jsx("p", {
                                                className: "font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground",
                                                children: "Mood, last few days"
                                            }),

                                            _jsx("h2", {
                                                className: "mt-2 font-display text-3xl tracking-[-.04em]",
                                                children: "A little weather report"
                                            })
                                        ]
                                    }),

                                    _jsx(Link, {
                                        href: "/mood",
                                        className: "rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground",
                                        "data-testid": "link-view-mood",
                                        children: _jsx(ArrowRight, {
                                            size: 17
                                        })
                                    })
                                ]
                            }),

                            _jsx("div", {
                                className: "mt-8 h-52 w-full",
                                children: trend.length ? (

                                    _jsx(ResponsiveContainer, {
                                        width: "100%",
                                        height: "100%",
                                        children: _jsxs(LineChart, {
                                            data: trend,
                                            margin: {
                                                top: 20,
                                                right: 10,
                                                left: -20,
                                                bottom: 0
                                            },
                                            children: [

                                                _jsx(XAxis, {
                                                    dataKey: "date",
                                                    tickFormatter: (date) =>
                                                        new Date(date)
                                                            .toLocaleDateString(
                                                                'en',
                                                                { weekday: 'short' }
                                                            )
                                                            .slice(0, 2),
                                                    tick: {
                                                        fontSize: 10
                                                    },
                                                    axisLine: false,
                                                    tickLine: false
                                                }),

                                                _jsx(YAxis, {
                                                    domain: [0, 10],
                                                    ticks: [0, 2, 4, 6, 8, 10],
                                                    tick: {
                                                        fontSize: 10
                                                    },
                                                    axisLine: false,
                                                    tickLine: false
                                                }),

                                                _jsx(Tooltip, {
                                                    formatter: (value) => [
                                                        Number(value).toFixed(1),
                                                        'Average mood'
                                                    ],
                                                    labelFormatter: (date) =>
                                                        new Date(date).toLocaleDateString(
                                                            'en',
                                                            {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            }
                                                        )
                                                }),

                                                _jsx(Line, {
                                                    type: "monotone",
                                                    dataKey: "average",
                                                    stroke: "currentColor",
                                                    strokeWidth: 2,
                                                    dot: {
                                                        r: 4
                                                    },
                                                    activeDot: {
                                                        r: 6
                                                    }
                                                })
                                            ]
                                        })
                                    })

                                ) : (

                                    _jsx("p", {
                                        className: "flex h-full items-center justify-center text-sm text-muted-foreground",
                                        children: "Your pattern will appear after a few check-ins."
                                    })

                                )
                            })
                        ]
                    }),

                    _jsxs("section", {
                        className: "rounded-[24px] bg-primary p-6 text-primary-foreground sm:p-7",
                        children: [

                            _jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    _jsx("p", {
                                        className: "font-mono text-[10px] uppercase tracking-[.18em] text-primary-foreground/50",
                                        children: "A prompt for today"
                                    }),

                                    _jsx(Sparkles, {
                                        size: 18,
                                        className: "text-accent"
                                    })
                                ]
                            }),

                            _jsxs("p", {
                                className: "mt-12 font-display text-3xl leading-tight",
                                children: [
                                    "“",
                                    data.latestPrompt ||
                                        'What is asking for your attention today?',
                                    "”"
                                ]
                            }),

                            _jsxs(Link, {
                                href: "/journal",
                                className: "mt-8 inline-flex items-center text-sm font-semibold text-accent hover:gap-3",
                                "data-testid": "link-answer-prompt",
                                children: [
                                    "Answer this prompt ",
                                    _jsx(ArrowRight, {
                                        className: "ml-2",
                                        size: 15
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),

            _jsxs("div", {
                className: "mt-5 flex items-center justify-between rounded-[22px] border border-border bg-secondary/60 px-5 py-4",
                children: [

                    _jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                            _jsx("span", {
                                className: "grid size-9 place-items-center rounded-xl bg-card text-primary",
                                children: _jsx(LockKeyhole, {
                                    size: 16
                                })
                            }),

                            _jsxs("p", {
                                className: "text-sm",
                                children: [
                                    _jsx("strong", {
                                        className: "font-semibold",
                                        children: "Private by default."
                                    }),
                                    " ",
                                    _jsx("span", {
                                        className: "text-muted-foreground",
                                        children: "Only you can read these pages."
                                    })
                                ]
                            })
                        ]
                    }),

                    _jsxs(Link, {
                        href: "/settings",
                        className: "hidden text-xs font-semibold text-primary sm:block",
                        "data-testid": "link-privacy-settings",
                        children: [
                            "Privacy settings ",
                            _jsx(ArrowRight, {
                                className: "ml-1 inline",
                                size: 13
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
export function JournalPage() {
    const params = useParams();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState(null);
    const [creating, setCreating] = useState(false);
    const listParams = useMemo(() => ({ page, pageSize: 8, search: query || undefined }), [page, query]);
    const { data, isLoading, isError, refetch } = useListJournals(listParams, { query: { queryKey: getListJournalsQueryKey(listParams) } });
    const { data: selected } = useGetJournal(editing || '', { query: { enabled: !!editing, queryKey: getGetJournalQueryKey(editing || '') } });
    const create = useCreateJournal();
    const update = useUpdateJournal();
    const del = useDeleteJournal();
    const queryClient = useQueryClient();
    useEffect(() => { if (params.id)
        setEditing(params.id); }, [params.id]);
    const entries = data?.items ?? [];
    const remove = (id) => { if (window.confirm('Delete this page? This cannot be undone.'))
        del.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListJournalsQueryKey(listParams) }) }); };
    return _jsxs(AppShell, { children: [_jsx(SectionHeading, { eyebrow: "Your pages", title: "Journal", text: "A private place to put things down before they become too loud.", action: _jsxs(Button, { onClick: () => { setCreating(true); setEditing(null); }, "data-testid": "button-new-entry", children: [_jsx(Plus, { size: 16 }), " New page"] }) }), _jsxs("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground", size: 17 }), _jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), onKeyDown: (e) => e.key === 'Enter' && (setPage(1), setQuery(search)), placeholder: "Search your pages\u2026", className: "w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary", "data-testid": "input-search-journal" })] }), _jsxs(Button, { variant: "outline", onClick: () => { setPage(1); setQuery(search); }, "data-testid": "button-search-journal", children: [_jsx(Search, { size: 16 }), " Search"] })] }), isLoading ? _jsx(PageLoader, {}) : isError ? _jsx(ErrorState, { onRetry: () => refetch() }) : entries.length === 0 ? _jsx(EmptyState, { title: query ? 'Nothing here yet.' : 'Your first page is waiting.', text: query ? 'Try a different word or clear your search.' : 'You do not need the perfect thought. Start with the one that is already here.', action: _jsxs(Button, { className: "mt-6", onClick: () => setCreating(true), "data-testid": "button-empty-new-entry", children: [_jsx(Plus, { size: 16 }), " Write a page"] }) }) : _jsxs(_Fragment, { children: [_jsx("div", { className: "grid gap-4 md:grid-cols-2", children: entries.map((entry) => _jsxs("article", { className: "group rounded-[22px] border border-card-border bg-card p-5 shadow-sm hover:-translate-y-0.5", "data-testid": `card-journal-${entry.id}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("span", { className: "font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground", children: fmt(entry.updatedAt) }), _jsxs("div", { className: "flex gap-1 opacity-0 transition-opacity group-hover:opacity-100", children: [_jsx("button", { onClick: () => setEditing(entry.id), className: "rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground", "data-testid": `button-edit-journal-${entry.id}`, "aria-label": "Edit page", children: _jsx(Pencil, { size: 15 }) }), _jsx("button", { onClick: () => remove(entry.id), className: "rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive", "data-testid": `button-delete-journal-${entry.id}`, "aria-label": "Delete page", children: _jsx(Trash2, { size: 15 }) })] })] }), _jsx("h2", { className: "mt-5 font-display text-xl leading-snug", children: entry.prompt }), _jsx("p", { className: "mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground", children: entry.content }), _jsx("div", { className: "mt-5 flex flex-wrap gap-1.5", children: entry.tags?.map((tag) => _jsxs("span", { className: "rounded-full bg-secondary px-2.5 py-1 font-mono text-[10px] text-muted-foreground", children: ["#", tag] }, tag)) })] }, entry.id)) }), _jsxs("div", { className: "mt-7 flex items-center justify-between", children: [_jsxs("p", { className: "font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground", children: [data?.total ?? 0, " pages in your space"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { disabled: page <= 1, onClick: () => setPage((value) => value - 1), className: "grid size-9 place-items-center rounded-full border border-border bg-card disabled:opacity-30", "data-testid": "button-journal-previous", children: _jsx(ChevronLeft, { size: 16 }) }), _jsx("span", { className: "grid size-9 place-items-center font-mono text-xs", children: page }), _jsx("button", { disabled: page >= (data?.totalPages ?? 1), onClick: () => setPage((value) => value + 1), className: "grid size-9 place-items-center rounded-full border border-border bg-card disabled:opacity-30", "data-testid": "button-journal-next", children: _jsx(ChevronRight, { size: 16 }) })] })] })] }), (creating || editing) && _jsx(JournalEditor, { entry: selected, editingId: editing, onClose: () => { setCreating(false); setEditing(null); }, create: create, update: update, onSaved: () => { setCreating(false); setEditing(null); queryClient.invalidateQueries({ queryKey: getListJournalsQueryKey(listParams) }); } })] });
}
function JournalEditor({ entry, editingId, onClose, create, update, onSaved }) {
    const [prompt, setPrompt] = useState(entry?.prompt ?? 'What is on your mind?');
    const [content, setContent] = useState(entry?.content ?? '');
    const [tags, setTags] = useState(entry?.tags?.join(', ') ?? '');
    useEffect(() => {
        if (entry) {
            setPrompt(entry.prompt);
            setContent(entry.content);
            setTags(entry.tags?.join(', ') ?? '');
        }
    }, [entry]);
    const save = (event) => { event.preventDefault(); const tagList = tags.split(',').map((tag) => tag.trim()).filter(Boolean); if (editingId)
        update.mutate({ id: editingId, data: { prompt, content, tags: tagList } }, { onSuccess: onSaved });
    else
        create.mutate({ data: { prompt, content, tags: tagList } }, { onSuccess: onSaved }); };
    return _jsx("div", { className: "fixed inset-0 z-40 grid place-items-center bg-primary/30 p-4 backdrop-blur-sm", "data-testid": "dialog-journal-editor", children: _jsxs("form", { onSubmit: save, className: "max-h-[90dvh] w-full max-w-2xl overflow-auto rounded-[28px] border border-border bg-card p-6 shadow-2xl sm:p-8", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground", children: editingId ? 'Edit page' : 'New page' }), _jsx("h2", { className: "mt-2 font-display text-3xl", children: editingId ? 'Keep the thread going.' : 'Put it somewhere safe.' })] }), _jsx("button", { type: "button", onClick: onClose, className: "rounded-full p-2 text-muted-foreground hover:bg-secondary", "data-testid": "button-close-editor", children: _jsx(X, { size: 18 }) })] }), _jsxs("label", { className: "mt-8 block", children: [_jsx("span", { className: "mb-2 block text-xs font-semibold", children: "Prompt" }), _jsx("input", { value: prompt, onChange: (e) => setPrompt(e.target.value), className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary", required: true, "data-testid": "input-journal-prompt" })] }), _jsxs("label", { className: "mt-4 block", children: [_jsx("span", { className: "mb-2 block text-xs font-semibold", children: "Your thoughts" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), placeholder: "Start anywhere\u2026", rows: 8, className: "w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 outline-none focus:border-primary", required: true, "data-testid": "input-journal-content" })] }), _jsxs("label", { className: "mt-4 block", children: [_jsxs("span", { className: "mb-2 block text-xs font-semibold", children: ["Tags ", _jsx("span", { className: "font-normal text-muted-foreground", children: "(optional, comma separated)" })] }), _jsx("input", { value: tags, onChange: (e) => setTags(e.target.value), placeholder: "work, rest, relationships", className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary", "data-testid": "input-journal-tags" })] }), _jsxs("div", { className: "mt-7 flex justify-end gap-3", children: [_jsx(Button, { type: "button", variant: "quiet", onClick: onClose, "data-testid": "button-cancel-editor", children: "Not yet" }), _jsxs(Button, { type: "submit", disabled: create.isPending || update.isPending, "data-testid": "button-save-journal", children: [_jsx(Save, { size: 16 }), " ", create.isPending || update.isPending ? 'Saving…' : 'Save page'] })] })] }) });
}
export function MoodPage() {
    const [range, setRange] = useState('week');
    const [mood, setMood] = useState(6);
    const [energy, setEnergy] = useState(5);
    const [emotion, setEmotion] = useState('Calm');
    const { data: moods, isLoading, refetch } = useListMoods({ range }, { query: { queryKey: getListMoodsQueryKey({ range }) } });
    const { data: analytics } = useGetMoodAnalytics();
    const save = useUpsertTodayMood();
    const existing = moods?.find((item) => item.date.slice(0, 10) === today());
    const submit = () => save.mutate({ data: { mood, energy, emotion } }, { onSuccess: () => refetch() });
    const emotionCounts = analytics?.emotions ?? [];
    return _jsxs(AppShell, { children: [_jsx(SectionHeading, { eyebrow: "Daily check-in", title: "How is the weather?", text: "No need to find the right answer. Just notice what is true today." }), _jsxs("div", { className: "grid gap-5 lg:grid-cols-[1.1fr_.9fr]", children: [_jsxs("section", { className: "rounded-[24px] border border-card-border bg-card p-6 sm:p-8", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground", children: existing ? 'Today’s check-in' : 'Right now' }), _jsx("h2", { className: "mt-2 font-display text-3xl", children: "A quick temperature" })] }), _jsx(HeartPulse, { className: "text-[#bf775d]", size: 24 })] }), _jsxs("div", { className: "mt-9", children: [_jsx(Scale, { label: "Mood", value: mood, setValue: setMood, low: "Low", high: "Bright", testId: "slider-mood" }), _jsx(Scale, { label: "Energy", value: energy, setValue: setEnergy, low: "Drained", high: "Full", testId: "slider-energy" })] }), _jsxs("div", { className: "mt-8", children: [_jsx("p", { className: "mb-3 text-xs font-semibold", children: "One word for it" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'].map((item) => _jsx("button", { onClick: () => setEmotion(item), className: `rounded-full border px-3.5 py-2 text-sm ${emotion === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/40'}`, "data-testid": `button-emotion-${item.toLowerCase()}`, children: item }, item)) })] }), _jsxs(Button, { className: "mt-9", onClick: submit, disabled: save.isPending, "data-testid": "button-save-mood", children: [_jsx(Check, { size: 16 }), " ", save.isPending ? 'Saving…' : existing ? 'Update check-in' : 'Save today’s check-in'] })] }), _jsxs("section", { className: "rounded-[24px] bg-secondary p-6 sm:p-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground", children: "History" }), _jsx("h2", { className: "mt-2 font-display text-3xl", children: "Your patterns" })] }), _jsx("div", { className: "flex rounded-full bg-card p-1", children: ['week', 'month'].map((value) => _jsx("button", { onClick: () => setRange(value), className: `rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.12em] ${range === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`, "data-testid": `button-range-${value}`, children: value }, value)) })] }), isLoading ? _jsx("div", { className: "mt-8 h-48 animate-pulse rounded-2xl bg-card/60" }) : _jsx("div", { className: "mt-8 space-y-3", children: (moods ?? []).slice(-7).reverse().map((item) => _jsxs("div", { className: "flex items-center justify-between rounded-2xl bg-card/65 px-4 py-3", "data-testid": `row-mood-${item.id}`, children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold", children: item.emotion }), _jsx("p", { className: "font-mono text-[10px] text-muted-foreground", children: fmt(item.date) })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "font-display text-xl", children: [item.mood, _jsx("small", { className: "font-sans text-xs text-muted-foreground", children: "/10" })] }), _jsx("span", { className: "h-1.5 w-16 overflow-hidden rounded-full bg-border", children: _jsx("span", { className: "block h-full rounded-full bg-accent", style: { width: `${item.mood * 10}%` } }) })] })] }, item.id)) }), !moods?.length && _jsx("p", { className: "mt-8 text-sm text-muted-foreground", children: "Your history will collect softly, one day at a time." }), _jsxs("div", { className: "mt-8 border-t border-primary/10 pt-6", children: [_jsx("p", { className: "font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground", children: "Most present" }), _jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: emotionCounts.slice(0, 3).map((item) => _jsxs("span", { className: "rounded-full bg-card px-3 py-1.5 text-xs", children: [item.emotion, " ", _jsx("span", { className: "text-muted-foreground", children: item.count })] }, item.emotion)) })] })] })] })] });
}
function Scale({ label, value, setValue, low, high, testId }) {
    return _jsxs("div", { className: "mb-7", children: [_jsxs("div", { className: "flex items-end justify-between", children: [_jsx("p", { className: "text-xs font-semibold", children: label }), _jsxs("span", { className: "font-display text-3xl text-primary", children: [value, _jsx("small", { className: "font-sans text-xs text-muted-foreground", children: "/10" })] })] }), _jsx("input", { type: "range", min: "1", max: "10", value: value, onChange: (e) => setValue(Number(e.target.value)), className: "mt-3 w-full accent-primary", "data-testid": testId }), _jsxs("div", { className: "flex justify-between font-mono text-[10px] text-muted-foreground", children: [_jsx("span", { children: low }), _jsx("span", { children: high })] })] });
}
export function BreathePage() {
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState('Ready when you are');
    const [count, setCount] = useState(0);
    useEffect(() => { if (!running)
        return undefined; const phases = [['Inhale', 4], ['Hold', 7], ['Exhale', 8]]; let phaseIndex = 0; let remaining = phases[0][1]; setPhase(phases[0][0]); setCount(remaining); const timer = window.setInterval(() => { remaining -= 1; if (remaining <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        remaining = phases[phaseIndex][1];
        setPhase(phases[phaseIndex][0]);
    } setCount(remaining); }, 1000); return () => window.clearInterval(timer); }, [running]);
    return _jsxs(AppShell, { children: [_jsx(SectionHeading, { eyebrow: "A pause for your body", title: "Breathe with it.", text: "A 4-7-8 rhythm to help your nervous system remember there is no emergency here." }), _jsxs("div", { className: "mx-auto max-w-3xl rounded-[32px] bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16", children: [_jsx("div", { className: "relative mx-auto grid size-64 place-items-center rounded-full border border-accent/30 bg-primary/60 shadow-[0_0_0_28px_hsl(var(--accent)/.07),0_0_0_58px_hsl(var(--accent)/.04)] sm:size-72", children: _jsx("div", { className: `grid size-44 place-items-center rounded-full bg-accent text-accent-foreground shadow-xl sm:size-52 ${running ? 'animate-breathe-in' : ''}`, children: _jsxs("div", { children: [_jsx("p", { className: "font-display text-4xl", children: running ? count : '4—7—8' }), _jsx("p", { className: "mt-1 text-xs font-semibold uppercase tracking-[.18em]", children: running ? phase : 'the rhythm' })] }) }) }), _jsx("p", { className: "mt-10 font-display text-2xl", children: running ? 'Stay with the next breath.' : 'Nothing to solve for the next few minutes.' }), _jsx(Button, { variant: "quiet", onClick: () => setRunning(!running), className: "mt-7 min-w-36", "data-testid": "button-toggle-breathe", children: running ? _jsxs(_Fragment, { children: [_jsx(Pause, { size: 16 }), " Pause"] }) : _jsxs(_Fragment, { children: [_jsx(Play, { size: 16 }), " Begin"] }) }), running && _jsx("button", { onClick: () => { setRunning(false); setPhase('Ready when you are'); setCount(0); }, className: "ml-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary-foreground/60 hover:text-primary-foreground", "data-testid": "button-reset-breathe", children: "Reset" })] }), _jsxs("div", { className: "mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3", children: [_jsx(BreathNote, { number: "04", title: "Inhale", text: "Let the breath arrive." }), _jsx(BreathNote, { number: "07", title: "Hold", text: "Make a little room." }), _jsx(BreathNote, { number: "08", title: "Exhale", text: "Let the day soften." })] })] });
}
function BreathNote({ number, title, text }) { return _jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [_jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [number, " seconds"] }), _jsx("p", { className: "mt-3 font-display text-xl", children: title }), _jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: text })] }); }
export function SettingsPage() {
    const { data: user, isLoading } = useGetCurrentUser();
    const update = useUpdateProfile();
    const exportData = useExportData({ query: { enabled: false, queryKey: getExportDataQueryKey() } });
    const [name, setName] = useState('');
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        if (user) {
            setName(user.name);
            setTheme(user.theme);
            document.documentElement.classList.toggle('dark', user.theme === 'dark');
        }
    }, [user]);
    const save = () => update.mutate({ data: { name: name || user?.name, theme } }, { onSuccess: (next) => { setName(next.name); document.documentElement.classList.toggle('dark', next.theme === 'dark'); } });
    const download = async () => { const result = await exportData.refetch(); if (result.data) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `mindwell-export-${today()}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    } };
    if (isLoading)
        return _jsx(AppShell, { children: _jsx(PageLoader, {}) });
    return _jsxs(AppShell, { children: [_jsx(SectionHeading, { eyebrow: "Your preferences", title: "Settings", text: "Make this space feel like it belongs to you." }), _jsxs("div", { className: "grid gap-5 lg:grid-cols-[1fr_.8fr]", children: [_jsxs("section", { className: "space-y-5", children: [_jsxs("div", { className: "rounded-[24px] border border-card-border bg-card p-6 sm:p-7", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "grid size-10 place-items-center rounded-full bg-accent font-display text-xl text-primary", children: (user?.name?.[0] ?? 'M').toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", "data-testid": "text-settings-name", children: user?.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: user?.email })] })] }), _jsxs("div", { className: "mt-7", children: [_jsxs("label", { className: "text-xs font-semibold", children: ["Display name", _jsx("input", { value: name || user?.name || '', onChange: (e) => setName(e.target.value), className: "mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary", "data-testid": "input-profile-name" })] }), _jsxs("div", { className: "mt-5", children: [_jsx("p", { className: "mb-2 text-xs font-semibold", children: "Theme" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => { setTheme('light'); document.documentElement.classList.remove('dark'); }, className: `flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${theme === 'light' ? 'border-primary bg-secondary' : 'border-border'}`, "data-testid": "button-theme-light", children: [_jsx(Sun, { size: 16 }), " Light"] }), _jsxs("button", { onClick: () => { setTheme('dark'); document.documentElement.classList.add('dark'); }, className: `flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${theme === 'dark' ? 'border-primary bg-secondary' : 'border-border'}`, "data-testid": "button-theme-dark", children: [_jsx(Moon, { size: 16 }), " Dark"] })] })] }), _jsxs(Button, { onClick: save, disabled: update.isPending, className: "mt-7", "data-testid": "button-save-profile", children: [_jsx(Save, { size: 16 }), " ", update.isPending ? 'Saving…' : 'Save changes'] })] })] }), _jsxs("div", { className: "rounded-[24px] border border-card-border bg-card p-6 sm:p-7", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "grid size-10 place-items-center rounded-xl bg-secondary", children: _jsx(ShieldCheck, { size: 18, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-display text-2xl", children: "Your privacy, in writing" }), _jsx("p", { className: "mt-2 text-sm leading-6 text-muted-foreground", children: "MindWell is a personal space. Your journal pages are only visible to you." })] })] }), _jsxs("button", { onClick: download, disabled: exportData.isFetching, className: "mt-6 flex items-center gap-2 text-sm font-semibold text-primary", "data-testid": "button-export-data", children: [_jsx(ArrowDownToLine, { size: 16 }), " ", exportData.isFetching ? 'Preparing your export…' : 'Download my data'] })] })] }), _jsxs("aside", { className: "rounded-[24px] bg-secondary p-6 sm:p-7", children: [_jsx("p", { className: "font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground", children: "Account" }), _jsxs("div", { className: "mt-8 space-y-5 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-primary/10 pb-5", children: [_jsx("span", { className: "text-muted-foreground", children: "Member since" }), _jsx("span", { children: fmt(user?.createdAt) })] }), _jsxs("div", { className: "flex items-center justify-between border-b border-primary/10 pb-5", children: [_jsx("span", { className: "text-muted-foreground", children: "Plan" }), _jsxs("span", { className: "flex items-center gap-1.5 font-semibold", children: [user?.isPremium && _jsx(Crown, { size: 14, className: "text-[#bf775d]" }), user?.isPremium ? 'MindWell Plus' : 'Free'] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Security" }), _jsxs("span", { className: "flex items-center gap-1.5 text-[#54866d]", children: [_jsx(Check, { size: 14 }), " Private"] })] })] }), _jsxs(Link, { href: "/upgrade", className: "mt-10 flex items-center justify-between rounded-2xl bg-card px-4 py-4 text-sm font-semibold", "data-testid": "link-settings-upgrade", children: [_jsx("span", { children: user?.isPremium ? 'View your plan' : 'Make more room' }), _jsx(ArrowRight, { size: 16 })] })] })] })] });
}
export function UpgradePage() {
    const { data: user } = useGetCurrentUser();
    const upgrade = useUpgradePremium();
    const queryClient = useQueryClient();
    const [demoMessage, setDemoMessage] = useState('');
    const complete = () => upgrade.mutate(undefined, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
            setDemoMessage('Demo mode: MindWell Plus enabled. No payment was processed.');
        },
    });
    const features = [['Unlimited journal pages', true, true], ['Search across your pages', true, true], ['Long-term mood patterns', false, true], ['Export your full history', false, true], ['A quiet, ad-free space', true, true]];
    return _jsx(AppShell, { children: _jsxs("div", { className: "mx-auto max-w-4xl", children: [_jsxs("div", { className: "rounded-[32px] bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16", children: [_jsx("span", { className: "mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground", children: _jsx(Crown, { size: 21 }) }), _jsx("p", { className: "mt-6 font-mono text-[10px] uppercase tracking-[.2em] text-primary-foreground/55", children: "MindWell Plus" }), _jsx("h1", { className: "mx-auto mt-3 max-w-2xl font-display text-5xl leading-none tracking-[-.05em] sm:text-6xl", children: "More room for what matters." }), _jsx("p", { className: "mx-auto mt-5 max-w-md text-sm leading-6 text-primary-foreground/65", children: "Keep your full history close, so the patterns have time to become visible." }), user?.isPremium ? _jsxs("div", { className: "mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground", children: [_jsx(Check, { size: 16 }), " You\u2019re already on Plus"] }) : _jsxs(Button, { variant: "quiet", onClick: complete, disabled: upgrade.isPending, className: "mt-8 min-w-44", "data-testid": "button-upgrade", children: [upgrade.isPending ? 'Enabling demo…' : 'Try MindWell Plus — ₹299/month', " ", _jsx(ArrowRight, { size: 15 })] }), demoMessage && _jsx("p", { className: "mx-auto mt-5 max-w-md rounded-2xl bg-accent/15 px-4 py-3 text-sm font-semibold text-accent", role: "status", "data-testid": "status-demo-upgrade", children: demoMessage })] }), _jsxs("div", { className: "mt-8 rounded-[24px] border border-card-border bg-card p-6 sm:p-8", children: [_jsxs("div", { className: "grid grid-cols-[1fr_70px_70px] items-center gap-3 border-b border-border pb-4 text-center text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground", children: [_jsx("span", { className: "text-left", children: "Inside your space" }), _jsx("span", { children: "Free" }), _jsx("span", { className: "text-primary", children: "Plus" })] }), features.map(([label, free, plus]) => _jsxs("div", { className: "grid grid-cols-[1fr_70px_70px] items-center gap-3 border-b border-border py-5 text-sm last:border-0", children: [_jsx("span", { children: label }), _jsx("span", { className: "text-center", children: free ? _jsx(Check, { className: "mx-auto text-muted-foreground", size: 16 }) : _jsx("span", { className: "text-muted-foreground", children: "\u2014" }) }), _jsx("span", { className: "text-center", children: plus ? _jsx(Check, { className: "mx-auto text-primary", size: 16 }) : _jsx("span", { children: "\u2014" }) })] }, String(label)))] })] }) });
}
