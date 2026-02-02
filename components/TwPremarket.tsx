import React, { useState, useEffect } from 'react';
import { Settings, FlowerStyle, TwAppData, LogEntry } from '../types';
import { generateContent } from '../services/geminiService';
import { Play, ClipboardList, FileText, ChevronDown, ChevronUp, Download, FileJson, FileSpreadsheet, FolderOpen } from 'lucide-react';

interface TwPremarketProps {
  settings: Settings;
  currentStyle: FlowerStyle;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const TwPremarket: React.FC<TwPremarketProps> = ({ settings, currentStyle, addLog }) => {
  const [formData, setFormData] = useState<TwAppData>({
    // 1. Basic
    docNo: '', 
    eNo: 'MDE-', 
    applyDate: new Date().toISOString().split('T')[0], 
    caseType: '一般申請案', 
    deviceCategory: '一般醫材', 
    caseKind: '新案',
    origin: '國產',
    productClass: '第二等級',
    similar: '無',
    replaceFlag: '否',
    priorAppNo: '',
    
    // 2. Device
    nameZh: '', 
    nameEn: '', 
    indications: '詳如核定之中文說明書',
    specComp: '詳如核定之中文說明書',
    mainCat: '',
    itemCode: '',
    itemName: '',
    
    // 3. Applicant
    uniformId: '',
    firmName: '', 
    firmAddr: '',
    respName: '',
    contactName: '',
    contactTel: '',
    contactFax: '',
    contactEmail: '',
    confirmMatch: false,
    certRaps: false,
    certAhwp: false,
    certOther: '',

    // 4. Manufacturer
    manuType: '單一製造廠',
    manuName: '',
    manuCountry: 'TAIWAN， ROC',
    manuAddr: '',
    manuNote: '',

    // 5. Details
    authApplicable: '不適用',
    authDesc: '',
    cfsApplicable: '不適用',
    cfsDesc: '',
    qmsApplicable: '適用',
    qmsDesc: '',
    similarInfo: '',
    labelingInfo: '',
    techFileInfo: '',
    preclinicalInfo: '',
    preclinicalReplace: '',
    clinicalJust: '不適用',
    clinicalInfo: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [generatedMd, setGeneratedMd] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'Form' | 'Draft' | 'AI Report'>('Form');
  
  // Case Management
  const [mockCases, setMockCases] = useState<TwAppData[]>([]);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(-1);

  // Load default datasets at start
  useEffect(() => {
    fetch('/defaultdataset.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMockCases(data);
        }
      })
      .catch(err => console.error("Failed to load default mock datasets", err));
  }, []);

  const handleLoadCase = () => {
    if (selectedCaseIdx >= 0 && mockCases[selectedCaseIdx]) {
      setFormData(mockCases[selectedCaseIdx]);
      alert(`Loaded case: ${mockCases[selectedCaseIdx].nameEn}`);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Application_${formData.docNo || "Draft"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    const headers = Object.keys(formData);
    const values = Object.values(formData).map(v => {
      // Escape quotes and wrap in quotes
      const str = String(v).replace(/"/g, '""');
      return `"${str}"`;
    });
    const csvContent = [headers.join(','), values.join(',')].join('\n');
    
    // Add BOM for Excel compatibility with UTF-8
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Application_${formData.docNo || "Draft"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateMarkdown = () => {
    const md = `# 第二、三等級醫療器材查驗登記申請書（線上草稿）

## 一、案件基本資料
- 公文文號：${formData.docNo || "（未填）"}
- 電子流水號：${formData.eNo || "（未填）"}
- 申請日：${formData.applyDate}
- 案件類型：${formData.caseType}
- 醫療器材類型：${formData.deviceCategory}
- 案件種類：${formData.caseKind}
- 產地：${formData.origin}
- 產品等級：${formData.productClass}
- 有無類似品：${formData.similar}
- 是否勾選「替代臨床前測試及原廠品質管制資料」：${formData.replaceFlag}
- 前次申請案號：${formData.priorAppNo || "不適用"}

## 二、醫療器材基本資訊
- 中文名稱：${formData.nameZh}
- 英文名稱：${formData.nameEn}
- 效能、用途或適應症說明：${formData.indications}
- 型號、規格或主要成分：${formData.specComp}

### 分類分級品項
- 主類別：${formData.mainCat || "（未填）"}
- 分級品項代碼：${formData.itemCode || "（未填）"}
- 分級品項名稱：${formData.itemName || "（未填）"}

## 三、醫療器材商資料
- 統一編號：${formData.uniformId}
- 醫療器材商名稱：${formData.firmName}
- 地址：${formData.firmAddr}
- 負責人姓名：${formData.respName}
- 聯絡人姓名：${formData.contactName}
- 電話：${formData.contactTel}
- 傳真：${formData.contactFax || "（未填）"}
- 電子郵件：${formData.contactEmail}
- 已確認與最新醫療器材商證照資訊相符：${formData.confirmMatch ? "是" : "否"}

### 其它佐證
- RAPS：${formData.certRaps ? "有" : "無"}
- AHWP：${formData.certAhwp ? "有" : "無"}
- 其它訓練/證書：${formData.certOther || "無"}

## 四、製造廠資訊
- 製造方式：${formData.manuType}
- 製造廠名稱：${formData.manuName}
- 製造國別：${formData.manuCountry}
- 製造廠地址：${formData.manuAddr}
- 製造相關說明：${formData.manuNote || "（未填）"}

## 五～七、附屬文件資料
- 原廠授權登記書適用性：${formData.authApplicable}
- 原廠授權登記書資料說明：${formData.authDesc || "（未填）"}
- 出產國製售證明適用性：${formData.cfsApplicable}
- 出產國製售證明資料說明：${formData.cfsDesc || "（未填）"}
- QMS/QSD 適用性：${formData.qmsApplicable}
- QMS/QSD 資料說明：${formData.qmsDesc || "（未填）"}

## 十～十二、技術資料摘要
### 類似品相關資訊
${formData.similarInfo || "（未填）"}

### 標籤／說明書／包裝擬稿重點
${formData.labelingInfo || "（未填）"}

### 產品結構、材料、規格、性能、用途、圖樣等技術檔案摘要
${formData.techFileInfo || "（未填）"}

## 十三～十七、安全性與臨床前測試
### 臨床前測試與原廠品質管制資料摘要
${formData.preclinicalInfo || "（未填）"}

### 替代「臨床前測試及原廠品質管制資料」之說明
${formData.preclinicalReplace || "（未填）"}

## 十八、臨床證據資料
- 臨床證據適用性：${formData.clinicalJust}
- 臨床證據摘要：
${formData.clinicalInfo || "（未填）"}
`;
    setGeneratedMd(md);
    setViewMode('Draft');
  };

  const handleScreenReview = async () => {
    if (!settings.apiKey) {
      alert("Please enter an API Key in the sidebar.");
      return;
    }
    setLoading(true);
    setViewMode('AI Report');
    const systemPrompt = "You are a TFDA premarket screen reviewer. Analyze the application for completeness and consistency based on the TFDA regulations.";
    const userPrompt = `
      === Application Data ===
      ${JSON.stringify(formData, null, 2)}
      
      Task: Perform a screen review. 
      1. List missing fields based on 'completeness'.
      2. Check for internal inconsistencies (e.g. Class II device but missing QMS info, or Manufacturer country mismatch).
      3. Provide a summary verdict (Pass/Conditional/Fail).
    `;

    try {
      const output = await generateContent(settings.apiKey, settings.model, systemPrompt, userPrompt, settings.temperature);
      setResult(output);
      addLog({
        tab: 'TW Premarket',
        agent: 'Screen Reviewer',
        model: settings.model,
        tokensEst: Math.ceil((userPrompt.length + output.length) / 4)
      });
    } catch (e) {
      console.error(e);
      setResult("Error generating review.");
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className={`text-md font-bold uppercase tracking-wide border-b border-black/10 pb-2 mb-4 mt-6 ${currentStyle.text} opacity-80`}>
      {title}
    </h3>
  );

  const InputLabel = ({ label, required = false }: { label: string, required?: boolean }) => (
    <label className={`block text-xs font-bold uppercase mb-1.5 ${currentStyle.text} opacity-70`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const TextInput = ({ name, value, placeholder, colSpan = 1 }: any) => (
      <div className={colSpan > 1 ? `md:col-span-${colSpan}` : ''}>
        <InputLabel label={name} /> {/* Simplification for demo code readability, ideally map label prop */}
        <input name={name} value={value} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-white/50 border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none transition-all text-sm" placeholder={placeholder} />
      </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className={`p-6 rounded-xl shadow-lg border border-white/40 backdrop-blur-md ${currentStyle.card}`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentStyle.sidebar} ${currentStyle.text}`}>
              <ClipboardList size={24} />
            </div>
            <h2 className={`text-2xl font-bold ${currentStyle.text}`}>Step 1 – 線上申請書草稿</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
             {/* Case Management Controls */}
             <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-lg">
                <FolderOpen size={16} className={`opacity-60 ${currentStyle.text}`} />
                <select 
                  className="bg-transparent text-xs font-semibold focus:outline-none max-w-[150px]"
                  onChange={(e) => setSelectedCaseIdx(Number(e.target.value))}
                  value={selectedCaseIdx}
                >
                  <option value={-1}>Select Test Case...</option>
                  {mockCases.map((c, idx) => (
                    <option key={idx} value={idx}>{c.nameEn || c.nameZh || `Case ${idx+1}`}</option>
                  ))}
                </select>
                <button 
                  onClick={handleLoadCase}
                  disabled={selectedCaseIdx === -1}
                  className="px-2 py-1 bg-blue-500/20 text-blue-700 text-xs rounded hover:bg-blue-500/30 disabled:opacity-50"
                >
                  Load
                </button>
             </div>

             <div className="h-6 w-px bg-gray-400/30 mx-1"></div>

             <div className="flex bg-white/40 rounded-lg p-1">
               {['Form', 'Draft', 'AI Report'].map(m => (
                 <button 
                   key={m}
                   onClick={() => setViewMode(m as any)}
                   className={`px-4 py-1 rounded text-xs font-bold transition-all ${viewMode === m ? 'bg-white shadow text-black' : 'text-gray-600 hover:bg-white/20'}`}
                 >
                   {m}
                 </button>
               ))}
            </div>

            <div className="flex gap-2 ml-2">
               <button onClick={handleDownloadJSON} title="Export JSON" className="p-2 rounded-lg bg-white/40 hover:bg-white/60 transition-all text-gray-700">
                  <FileJson size={18} />
               </button>
               <button onClick={handleDownloadCSV} title="Export CSV" className="p-2 rounded-lg bg-white/40 hover:bg-white/60 transition-all text-gray-700">
                  <FileSpreadsheet size={18} />
               </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'Form' && (
          <div>
            {/* 1. Basic Info */}
            <SectionHeader title="一、案件基本資料 (Case Basic Info)" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               <div>
                 <InputLabel label="公文文號" />
                 <input name="docNo" value={formData.docNo} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
               </div>
               <div>
                 <InputLabel label="電子流水號" />
                 <input name="eNo" value={formData.eNo} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
               </div>
               <div>
                 <InputLabel label="申請日" />
                 <input type="date" name="applyDate" value={formData.applyDate} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
               </div>

               <div>
                 <InputLabel label="案件類型" required />
                 <select name="caseType" value={formData.caseType} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm">
                   {["一般申請案", "同一產品不同品名", "專供外銷", "許可證有效期限屆至後六個月內重新申請"].map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
               </div>
               <div>
                 <InputLabel label="醫療器材類型" required />
                 <select name="deviceCategory" value={formData.deviceCategory} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm">
                   {["一般醫材", "體外診斷器材(IVD)"].map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
               </div>
               <div>
                 <InputLabel label="案件種類" required />
                 <select name="caseKind" value={formData.caseKind} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm">
                   {["新案", "變更案", "展延案"].map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
               </div>

               <div>
                 <InputLabel label="產地" required />
                 <select name="origin" value={formData.origin} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm">
                   {["國產", "輸入", "陸輸"].map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
               </div>
               <div>
                 <InputLabel label="產品等級" required />
                 <select name="productClass" value={formData.productClass} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm">
                   {["第二等級", "第三等級"].map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
               </div>
               <div>
                 <InputLabel label="有無類似品" required />
                 <select name="similar" value={formData.similar} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm">
                   {["有", "無", "全球首創"].map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
               </div>

               <div className="md:col-span-2 flex flex-col justify-center">
                 <InputLabel label="是否勾選「替代臨床前測試及原廠品質管制資料」？" required />
                 <div className="flex gap-4 mt-1">
                    {["否", "是"].map(o => (
                      <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="replaceFlag" value={o} checked={formData.replaceFlag === o} onChange={handleChange} />
                        {o}
                      </label>
                    ))}
                 </div>
               </div>
               <div>
                 <InputLabel label="（非首次申請）前次申請案號" />
                 <input name="priorAppNo" value={formData.priorAppNo} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
               </div>
            </div>

            {/* 2. Device Info */}
            <SectionHeader title="二、醫療器材基本資訊 (Medical Device Info)" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                 <InputLabel label="醫療器材中文名稱" required />
                 <input name="nameZh" value={formData.nameZh} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div>
                 <InputLabel label="醫療器材英文名稱" required />
                 <input name="nameEn" value={formData.nameEn} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div className="md:col-span-2">
                 <InputLabel label="效能、用途或適應症說明" />
                 <textarea name="indications" value={formData.indications} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm h-20" />
              </div>
              <div className="md:col-span-2">
                 <InputLabel label="型號、規格或主要成分說明" />
                 <textarea name="specComp" value={formData.specComp} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm h-20" />
              </div>
              
              <div className="md:col-span-2 grid grid-cols-3 gap-3 bg-white/30 p-4 rounded-lg">
                 <div className="col-span-3 mb-1 font-bold text-xs opacity-70">分類分級品項</div>
                 <div className="col-span-1">
                   <select name="mainCat" value={formData.mainCat} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-xs">
                     <option value="">主類別...</option>
                     {["A.臨床化學及臨床毒理學","B.血液學及病理學","C.免疫學及微生物學","D.麻醉學","E.心臟血管醫學","F.牙科學","G.耳鼻喉科學","H.胃腸病科學及泌尿科學","I.一般及整形外科手術","J.一般醫院及個人使用裝置","K.神經科學","L.婦產科學","M.眼科學","N.骨科學","O.物理醫學科學","P.放射學科學"].map(o => <option key={o} value={o}>{o.split('.')[0]}</option>)}
                   </select>
                 </div>
                 <div className="col-span-1">
                   <input name="itemCode" value={formData.itemCode} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-xs" placeholder="代碼 (例 A.1225)" />
                 </div>
                 <div className="col-span-1">
                   <input name="itemName" value={formData.itemName} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-xs" placeholder="名稱" />
                 </div>
              </div>
            </div>

            {/* 3. Applicant Info */}
            <SectionHeader title="三、醫療器材商資料 (Applicant Info)" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                 <InputLabel label="統一編號" required />
                 <input name="uniformId" value={formData.uniformId} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div>
                 <InputLabel label="醫療器材商名稱" required />
                 <input name="firmName" value={formData.firmName} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div className="md:col-span-2">
                 <InputLabel label="醫療器材商地址" required />
                 <textarea name="firmAddr" value={formData.firmAddr} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm h-16" />
              </div>
              <div>
                 <InputLabel label="負責人姓名" required />
                 <input name="respName" value={formData.respName} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div>
                 <InputLabel label="聯絡人姓名" required />
                 <input name="contactName" value={formData.contactName} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div>
                 <InputLabel label="電話" required />
                 <input name="contactTel" value={formData.contactTel} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div>
                 <InputLabel label="聯絡人傳真" />
                 <input name="contactFax" value={formData.contactFax} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              <div className="md:col-span-2">
                 <InputLabel label="電子郵件" required />
                 <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
              </div>
              
              <div className="md:col-span-2 mt-2">
                 <label className="flex items-center gap-2 text-sm cursor-pointer bg-white/30 p-2 rounded">
                    <input type="checkbox" name="confirmMatch" checked={formData.confirmMatch} onChange={handleChange} />
                    <span className="font-semibold">我已確認上述資料與最新版醫療器材商證照資訊(名稱、地址、負責人)相符</span>
                 </label>
              </div>
              <div className="md:col-span-2 mt-2 bg-white/30 p-3 rounded">
                 <InputLabel label="其它佐證（承辦人訓練證明等）" />
                 <div className="flex flex-wrap gap-4 mt-2">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="certRaps" checked={formData.certRaps} onChange={handleChange} /> RAPS</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="certAhwp" checked={formData.certAhwp} onChange={handleChange} /> AHWP</label>
                    <input name="certOther" value={formData.certOther} onChange={handleChange} className="flex-1 p-1 rounded bg-white/50 border border-gray-200 text-sm" placeholder="其它，請敘明" />
                 </div>
              </div>
            </div>

            {/* 4. Manufacturer Info */}
            <SectionHeader title="四、製造廠資訊 (Manufacturer)" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="md:col-span-2">
                 <InputLabel label="製造方式" />
                 <div className="flex flex-col md:flex-row gap-4 mt-1">
                    {["單一製造廠", "全部製程委託製造", "委託非全部製程之製造/包裝/貼標/滅菌及最終驗放"].map(o => (
                      <label key={o} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="radio" name="manuType" value={o} checked={formData.manuType === o} onChange={handleChange} />
                        {o}
                      </label>
                    ))}
                 </div>
               </div>
               <div>
                 <InputLabel label="製造廠名稱" required />
                 <input name="manuName" value={formData.manuName} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" />
               </div>
               <div>
                 <InputLabel label="製造國別" required />
                 <select name="manuCountry" value={formData.manuCountry} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm">
                   {["TAIWAN， ROC", "UNITED STATES", "EU (Member State)", "JAPAN", "CHINA", "KOREA， REPUBLIC OF", "OTHER"].map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
               </div>
               <div className="md:col-span-2">
                 <InputLabel label="製造廠地址" required />
                 <textarea name="manuAddr" value={formData.manuAddr} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm h-16" />
               </div>
               <div className="md:col-span-2">
                 <InputLabel label="製造廠相關說明（如(O)/(P)製造、委託範圍）" />
                 <textarea name="manuNote" value={formData.manuNote} onChange={handleChange} className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 text-sm h-16" />
               </div>
            </div>

            {/* 5. Details Collapsible */}
            <div className="mt-8">
               <button 
                 onClick={() => setShowDetails(!showDetails)}
                 className={`w-full flex items-center justify-between p-4 rounded-lg bg-white/40 hover:bg-white/50 transition-all font-bold ${currentStyle.text}`}
               >
                 <span>附件摘要：原廠授權、出產國製售證明、QMS/QSD、技術檔案、臨床資料等</span>
                 {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
               </button>
               
               {showDetails && (
                 <div className="p-4 bg-white/20 rounded-b-lg space-y-4 animate-fade-in border-x border-b border-white/20">
                    <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <InputLabel label="原廠授權登記書" />
                         <select name="authApplicable" value={formData.authApplicable} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm mb-2">
                            {["不適用", "適用"].map(o => <option key={o} value={o}>{o}</option>)}
                         </select>
                         <textarea name="authDesc" value={formData.authDesc} onChange={handleChange} placeholder="說明..." className="w-full p-2 rounded bg-white/50 text-sm h-20" />
                       </div>
                       <div>
                         <InputLabel label="出產國製售證明" />
                         <select name="cfsApplicable" value={formData.cfsApplicable} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm mb-2">
                            {["不適用", "適用"].map(o => <option key={o} value={o}>{o}</option>)}
                         </select>
                         <textarea name="cfsDesc" value={formData.cfsDesc} onChange={handleChange} placeholder="說明..." className="w-full p-2 rounded bg-white/50 text-sm h-20" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between">
                         <InputLabel label="QMS/QSD" />
                         <select name="qmsApplicable" value={formData.qmsApplicable} onChange={handleChange} className="p-1 rounded bg-white/50 text-xs w-32">
                            {["不適用", "適用"].map(o => <option key={o} value={o}>{o}</option>)}
                         </select>
                       </div>
                       <textarea name="qmsDesc" value={formData.qmsDesc} onChange={handleChange} placeholder="QMS/QSD 資料說明（含案號、登錄狀態）" className="w-full p-2 rounded bg-white/50 text-sm h-20 mt-1" />
                    </div>

                    <InputLabel label="類似品與比較表摘要（如無類似品則說明理由）" />
                    <textarea name="similarInfo" value={formData.similarInfo} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm h-20" />

                    <InputLabel label="標籤、說明書或包裝擬稿重點" />
                    <textarea name="labelingInfo" value={formData.labelingInfo} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm h-24" />

                    <InputLabel label="產品結構、材料、規格、性能、用途、圖樣等技術檔案摘要" />
                    <textarea name="techFileInfo" value={formData.techFileInfo} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm h-24" />
                    
                    <InputLabel label="臨床前測試 & 原廠品質管制檢驗摘要" />
                    <textarea name="preclinicalInfo" value={formData.preclinicalInfo} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm h-24" />

                    <InputLabel label="如本案適用「替代臨床前測試及原廠品質管制資料」之說明" />
                    <textarea name="preclinicalReplace" value={formData.preclinicalReplace} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm h-20" />

                    <div>
                       <div className="flex justify-between">
                         <InputLabel label="臨床證據摘要" />
                         <select name="clinicalJust" value={formData.clinicalJust} onChange={handleChange} className="p-1 rounded bg-white/50 text-xs w-32">
                            <option value="不適用">臨床不適用</option>
                            <option value="適用">臨床適用</option>
                         </select>
                       </div>
                       <textarea name="clinicalInfo" value={formData.clinicalInfo} onChange={handleChange} className="w-full p-2 rounded bg-white/50 text-sm h-24 mt-1" />
                    </div>
                 </div>
               )}
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={generateMarkdown}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-white/50 hover:bg-white/70 ${currentStyle.text} transition-all`}
              >
                <FileText size={18} /> Generate Draft MD
              </button>
              <button 
                onClick={handleScreenReview}
                disabled={loading}
                className={`flex-[2] flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-xl transition-all ${
                   loading ? 'bg-gray-400 cursor-not-allowed' : `${currentStyle.accent.replace('text-', 'bg-')} text-white hover:opacity-90`
                }`}
              >
                {loading ? 'Analyzing...' : <><Play size={18} fill="currentColor" /> Run Screen Review Agent</>}
              </button>
            </div>
          </div>
        )}

        {viewMode === 'Draft' && (
           <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-4">
               <h3 className={`text-lg font-bold ${currentStyle.text}`}>Application Draft (Markdown)</h3>
               <button onClick={() => navigator.clipboard.writeText(generatedMd)} className="text-xs bg-white/40 px-3 py-1 rounded hover:bg-white/60">Copy to Clipboard</button>
             </div>
             <textarea 
               value={generatedMd} 
               onChange={(e) => setGeneratedMd(e.target.value)}
               className="w-full h-[600px] p-4 rounded-xl bg-white/60 border border-white/50 font-mono text-sm shadow-inner focus:outline-none"
             />
           </div>
        )}

        {viewMode === 'AI Report' && (
          <div className="animate-fade-in">
             <h3 className={`text-lg font-bold mb-4 ${currentStyle.text}`}>AI Screen Review Report</h3>
             {loading ? (
                <div className="flex flex-col items-center justify-center h-64 opacity-50">
                  <Play size={48} className="animate-pulse mb-4" />
                  <p>Processing application data...</p>
                </div>
             ) : (
                <div className="prose max-w-none text-sm bg-white/60 p-6 rounded-xl overflow-auto max-h-[600px] border border-white/50 shadow-inner">
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed text-gray-800">{result}</pre>
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TwPremarket;
