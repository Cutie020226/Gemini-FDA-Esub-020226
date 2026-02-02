import { FlowerStyle, AgentConfig } from './types';

export const FLOWER_STYLES: FlowerStyle[] = [
  { name: 'Rose', gradient: 'bg-gradient-to-br from-red-100 via-rose-200 to-pink-300', sidebar: 'bg-rose-900/10', card: 'bg-white/60', accent: 'text-rose-600', text: 'text-rose-950' },
  { name: 'Lily', gradient: 'bg-gradient-to-tr from-slate-50 via-white to-slate-200', sidebar: 'bg-slate-900/5', card: 'bg-white/80', accent: 'text-slate-600', text: 'text-slate-900' },
  { name: 'Sunflower', gradient: 'bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-200', sidebar: 'bg-amber-900/10', card: 'bg-white/60', accent: 'text-amber-700', text: 'text-amber-950' },
  { name: 'Lavender', gradient: 'bg-gradient-to-bl from-purple-100 via-violet-200 to-indigo-200', sidebar: 'bg-indigo-900/10', card: 'bg-white/60', accent: 'text-indigo-600', text: 'text-indigo-950' },
  { name: 'Cherry Blossom', gradient: 'bg-gradient-to-r from-pink-100 via-pink-200 to-rose-100', sidebar: 'bg-pink-900/10', card: 'bg-white/60', accent: 'text-pink-500', text: 'text-pink-950' },
  { name: 'Orchid', gradient: 'bg-gradient-to-br from-fuchsia-100 via-purple-200 to-fuchsia-300', sidebar: 'bg-fuchsia-900/10', card: 'bg-white/60', accent: 'text-fuchsia-700', text: 'text-fuchsia-950' },
  { name: 'Tulip', gradient: 'bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100', sidebar: 'bg-orange-900/10', card: 'bg-white/60', accent: 'text-orange-600', text: 'text-orange-950' },
  { name: 'Daisy', gradient: 'bg-gradient-to-br from-green-50 via-white to-yellow-50', sidebar: 'bg-green-900/5', card: 'bg-white/90', accent: 'text-green-600', text: 'text-green-950' },
  { name: 'Lotus', gradient: 'bg-gradient-to-br from-pink-50 via-rose-100 to-teal-50', sidebar: 'bg-teal-900/10', card: 'bg-white/70', accent: 'text-teal-600', text: 'text-teal-950' },
  { name: 'Jasmine', gradient: 'bg-gradient-to-tr from-yellow-50 via-white to-green-50', sidebar: 'bg-stone-900/5', card: 'bg-white/80', accent: 'text-stone-600', text: 'text-stone-950' },
  { name: 'Poppy', gradient: 'bg-gradient-to-br from-red-200 via-red-300 to-orange-200', sidebar: 'bg-red-900/10', card: 'bg-white/60', accent: 'text-red-700', text: 'text-red-950' },
  { name: 'Daffodil', gradient: 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-green-100', sidebar: 'bg-yellow-900/10', card: 'bg-white/60', accent: 'text-yellow-600', text: 'text-yellow-950' },
  { name: 'Hydrangea', gradient: 'bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200', sidebar: 'bg-blue-900/10', card: 'bg-white/60', accent: 'text-blue-600', text: 'text-blue-950' },
  { name: 'Peony', gradient: 'bg-gradient-to-br from-pink-200 via-rose-200 to-red-100', sidebar: 'bg-rose-900/10', card: 'bg-white/60', accent: 'text-rose-600', text: 'text-rose-950' },
  { name: 'Violet', gradient: 'bg-gradient-to-br from-violet-200 via-purple-300 to-indigo-300', sidebar: 'bg-violet-900/10', card: 'bg-white/60', accent: 'text-violet-700', text: 'text-violet-950' },
  { name: 'Marigold', gradient: 'bg-gradient-to-br from-orange-200 via-amber-300 to-yellow-200', sidebar: 'bg-orange-900/10', card: 'bg-white/60', accent: 'text-orange-700', text: 'text-orange-950' },
  { name: 'Hibiscus', gradient: 'bg-gradient-to-br from-red-100 via-pink-300 to-rose-200', sidebar: 'bg-pink-900/10', card: 'bg-white/60', accent: 'text-pink-600', text: 'text-pink-950' },
  { name: 'Magnolia', gradient: 'bg-gradient-to-br from-slate-100 via-pink-50 to-white', sidebar: 'bg-slate-900/5', card: 'bg-white/80', accent: 'text-slate-500', text: 'text-slate-900' },
  { name: 'Iris', gradient: 'bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-200', sidebar: 'bg-indigo-900/10', card: 'bg-white/60', accent: 'text-indigo-700', text: 'text-indigo-950' },
  { name: 'Dahlia', gradient: 'bg-gradient-to-br from-rose-300 via-pink-400 to-red-300', sidebar: 'bg-rose-900/20', card: 'bg-white/60', accent: 'text-rose-800', text: 'text-rose-950' },
];

export const LABELS = {
  Dashboard: { English: "Dashboard", "繁體中文": "儀表板" },
  TwPremarket: { English: "TW Premarket", "繁體中文": "醫療器材查驗登記" },
  FiveTenK: { English: "510(k) Intelligence", "繁體中文": "510(k) 智能分析" },
  PdfToMd: { English: "PDF → Markdown", "繁體中文": "PDF → Markdown" },
  Checklist: { English: "Checklist & Report", "繁體中文": "審查流程" },
  Notes: { English: "Note Keeper", "繁體中文": "筆記助手" },
  Config: { English: "Agents Config", "繁體中文": "代理設定" },
  Theme: { English: "Theme", "繁體中文": "主題" },
  Language: { English: "Language", "繁體中文": "語言" },
  Style: { English: "Style", "繁體中文": "風格" },
  Jackpot: { English: "Jackpot!", "繁體中文": "手氣不錯!" },
  RunAgent: { English: "Run Agent", "繁體中文": "執行代理" },
  Processing: { English: "Processing...", "繁體中文": "處理中..." },
  InputKey: { English: "Enter API Key", "繁體中文": "輸入 API 金鑰" },
  KeySet: { English: "API Key Loaded", "繁體中文": "API 金鑰已載入" },
};

export const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: "tw_screen_review",
    name: "TFDA Screen Review",
    model: "gemini-2.5-flash",
    systemPrompt: "You are a TFDA premarket screen reviewer. Analyze the application for completeness.",
    maxTokens: 4000,
    category: "TFDA"
  },
  {
    id: "fda_510k_analyst",
    name: "510(k) Analyst",
    model: "gemini-2.5-flash",
    systemPrompt: "You are an FDA 510(k) analyst. Summarize device info and predicate comparisons.",
    maxTokens: 4000,
    category: "FDA"
  },
  {
    id: "note_organizer",
    name: "Note Organizer",
    model: "gemini-2.5-flash",
    systemPrompt: "Organize messy notes into structured Markdown. Highlight risks and action items.",
    maxTokens: 2000,
    category: "Productivity"
  }
];
