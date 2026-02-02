export type Language = 'English' | '繁體中文';
export type Theme = 'Light' | 'Dark';

export interface FlowerStyle {
  name: string;
  gradient: string;
  sidebar: string;
  card: string;
  accent: string;
  text: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
  maxTokens: number;
  category: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  tab: string;
  agent: string;
  model: string;
  tokensEst: number;
}

export interface TwAppData {
  // 1. Basic Data
  docNo: string;
  eNo: string;
  applyDate: string;
  caseType: string;
  deviceCategory: string;
  caseKind: string;
  origin: string;
  productClass: string;
  similar: string;
  replaceFlag: string;
  priorAppNo: string;

  // 2. Device Info
  nameZh: string;
  nameEn: string;
  indications: string;
  specComp: string;
  mainCat: string;
  itemCode: string;
  itemName: string;

  // 3. Applicant Data
  uniformId: string;
  firmName: string;
  firmAddr: string;
  respName: string;
  contactName: string;
  contactTel: string;
  contactFax: string;
  contactEmail: string;
  confirmMatch: boolean;
  certRaps: boolean;
  certAhwp: boolean;
  certOther: string;

  // 4. Manufacturer Info
  manuType: string;
  manuName: string;
  manuCountry: string;
  manuAddr: string;
  manuNote: string;

  // 5. Attachments/Details
  authApplicable: string;
  authDesc: string;
  cfsApplicable: string;
  cfsDesc: string;
  qmsApplicable: string;
  qmsDesc: string;
  similarInfo: string;
  labelingInfo: string;
  techFileInfo: string;
  preclinicalInfo: string;
  preclinicalReplace: string;
  clinicalJust: string;
  clinicalInfo: string;
}

export interface Settings {
  language: Language;
  theme: Theme;
  styleName: string;
  apiKey: string;
  model: string;
  temperature: number;
}