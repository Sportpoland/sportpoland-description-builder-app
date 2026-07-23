import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

// ─── RICH TEXT EDITOR ────────────────────────────────────────────────────────
const TextEditor = memo(({ sectionId, value, onChange, placeholder = "Wprowadź tekst..." }) => {
  const textareaRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  const insertTag = useCallback((openTag, closeTag = null) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const sel = ta.value.substring(s, e);
    const newText = closeTag
      ? ta.value.substring(0, s) + openTag + sel + closeTag + ta.value.substring(e)
      : ta.value.substring(0, s) + openTag + ta.value.substring(e);
    onChange(newText);
    setTimeout(() => {
      ta.setSelectionRange(s + openTag.length, s + openTag.length + (closeTag && sel ? sel.length : 0));
      ta.focus();
    }, 0);
  }, [onChange]);

  const insertList = useCallback((listType) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const lines = ta.value.substring(s, e).split('\n').filter(l => l.trim());
    const tag = listType === 'ul' ? 'ul' : 'ol';
    const html = lines.length
      ? `<${tag}>\n${lines.map(l => `  <li>${l.trim()}</li>`).join('\n')}\n</${tag}>`
      : `<${tag}>\n  <li>Element listy</li>\n</${tag}>`;
    onChange(ta.value.substring(0, s) + html + ta.value.substring(e));
    setTimeout(() => ta.focus(), 0);
  }, [onChange]);

  const btnStyle = (active) => ({
    padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px',
    backgroundColor: active ? '#3b82f6' : 'white', color: active ? 'white' : 'black',
    cursor: 'pointer', fontSize: '12px'
  });

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        {[['B', '<strong>', '</strong>', { fontWeight: 'bold' }], ['I', '<em>', '</em>', { fontStyle: 'italic' }], ['U', '<u>', '</u>', { textDecoration: 'underline' }]].map(([lbl, o, c, st]) => (
          <button key={lbl} type="button" onClick={() => insertTag(o, c)} style={{ ...btnStyle(false), ...st }}>{lbl}</button>
        ))}
        {['H1', 'H2', 'H3'].map(h => (
          <button key={h} type="button" onClick={() => insertTag(`<${h.toLowerCase()}>`, `</${h.toLowerCase()}>`)} style={{ ...btnStyle(false), fontWeight: 'bold' }}>{h}</button>
        ))}
        <button type="button" onClick={() => insertTag('<p>', '</p>')} style={btnStyle(false)}>P</button>
        <button type="button" onClick={() => insertList('ul')} style={btnStyle(false)}>• Lista</button>
        <button type="button" onClick={() => insertList('ol')} style={btnStyle(false)}>1. Lista</button>
        <button type="button" onClick={() => insertTag('<br>')} style={btnStyle(false)}>↵</button>
        <button type="button" onClick={() => setShowPreview(p => !p)} style={btnStyle(showPreview)}>👁️</button>
      </div>
      <textarea
        ref={textareaRef} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', minHeight: '120px', padding: '12px', border: 'none', outline: 'none', lineHeight: 1.4, fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', display: showPreview ? 'none' : 'block' }}
      />
      {showPreview && (
        <div style={{ minHeight: '120px', padding: '12px', lineHeight: 1.4, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', border: '1px solid #e5e7eb', margin: '8px', borderRadius: '4px', backgroundColor: '#f9fafb' }}
          dangerouslySetInnerHTML={{ __html: value || `<span style="color:#9ca3af;font-style:italic">${placeholder}</span>` }} />
      )}
    </div>
  );
});
TextEditor.displayName = 'TextEditor';

// ─── IMAGE UPLOAD FIELD ───────────────────────────────────────────────────────
const ImageUploader = memo(({ label, preview, onUpload, size = 'normal' }) => {
  const ref = useRef(null);
  const h = size === 'large' ? 160 : size === 'usp' ? 200 : 100;
  return (
    <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '12px', textAlign: 'center', minHeight: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fafafa' }}>
      {preview
        ? <img src={preview} alt="" style={{ maxWidth: '100%', maxHeight: h - 20, borderRadius: '6px', objectFit: 'contain' }} />
        : <div style={{ fontSize: size === 'usp' ? 40 : 28, color: '#d1d5db' }}>🖼️</div>
      }
      <input type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} ref={ref} />
      <button onClick={() => ref.current?.click()} style={{ padding: '5px 12px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
        {label || 'Wybierz zdjęcie'}
      </button>
    </div>
  );
});
ImageUploader.displayName = 'ImageUploader';

// ─── USP ITEM EDITOR ──────────────────────────────────────────────────────────
const USPItemEditor = memo(({ item, onUpdate, onDelete, index }) => {
  const fileRef = useRef(null);
  const handleImage = useCallback((e) => {
    const f = e.target.files[0];
    if (!f) return;
    onUpdate({ ...item, image: f.name, imagePreview: URL.createObjectURL(f) });
  }, [item, onUpdate]);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Zaleta {index + 1}</span>
        <button onClick={onDelete} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '13px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ border: '2px dashed #d1d5db', borderRadius: '6px', padding: '8px', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#fafafa' }}>
          {item.imagePreview
            ? <img src={item.imagePreview} alt="" style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '4px', objectFit: 'contain' }} />
            : <div style={{ fontSize: '32px', color: '#d1d5db' }}>🖼️</div>
          }
          <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} ref={fileRef} />
          <button onClick={() => fileRef.current?.click()} style={{ padding: '4px 10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>📸 Zdjęcie</button>
        </div>
        <input type="text" value={item.title} onChange={e => onUpdate({ ...item, title: e.target.value })} placeholder="Tytuł zalety" style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }} />
        <textarea value={item.description} onChange={e => onUpdate({ ...item, description: e.target.value })} placeholder="Opis zalety..." style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', minHeight: '60px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
      </div>
    </div>
  );
});
USPItemEditor.displayName = 'USPItemEditor';

// ─── CSS dla eksportowanego HTML ───────────────────────────────────────────────
const EXPORT_CSS = `
<style>
.sp-container{background-color:var(--bg-color,#f6f6f6);margin-bottom:20px;padding:15px;border-radius:15px}
.sp-flex{display:flex;flex-direction:column;gap:15px;width:100%}
.sp-text{line-height:1.4}
.sp-image{width:100%;height:auto;border-radius:10px;max-width:520px;display:block;margin:0 auto}
.sp-image-container{text-align:center}
.sp-image-only{width:100%;height:auto;max-height:400px;border-radius:10px;object-fit:contain;display:block;margin:0 auto}

/* ===== YOUTUBE INLINE ===== */
.sp-youtube-container{position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden}
.sp-youtube-container iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:10px}

/* ===== SIATKA IKON (styl kart USP) ===== */
.sp-icons-grid{display:grid;grid-template-columns:1fr;gap:15px;width:100%}
.sp-icon-item{background:var(--icon-card-bg, #fff);border-radius:15px;overflow:hidden;display:flex;flex-direction:column}
.sp-icon-media{width:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;line-height:0;padding:10px 10px 0}
.sp-icon-emoji{font-size:40px;display:block;text-align:center;padding:10px 10px 0}
.sp-icon-image{width:auto;height:auto;max-width:100%;max-height:120px;display:block;object-fit:contain;object-position:center}
.sp-icon-text{padding:10px 16px 16px}
.sp-icon-text h4{margin:0 0 8px;font-size:15px;font-weight:bold}
.sp-icon-desc{margin:0;line-height:1.5;font-size:14px}

/* ===== FEATURES ===== */
.sp-features-grid{display:grid;grid-template-columns:1fr;gap:20px}
.sp-feature-item{display:flex;align-items:flex-start;gap:20px;padding:20px}
.sp-feature-icon{font-size:50px;flex-shrink:0;width:80px;height:80px;display:flex;align-items:center;justify-content:center;border-radius:10px}
.sp-feature-image{width:80px;height:80px;object-fit:cover;border-radius:10px;flex-shrink:0}
.sp-feature-content h4{margin:0 0 10px;font-size:18px;font-weight:bold}
.sp-feature-content p{margin:0;font-size:16px;line-height:1.5}

/* ===== TABELA ===== */
.sp-comparison-table{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
.sp-comparison-table table{width:100%;border-collapse:collapse;min-width:600px}
.sp-comparison-table th,.sp-comparison-table td{padding:12px;text-align:left;border:1px solid #e5e7eb;vertical-align:top}
.sp-comparison-table th{font-weight:bold}
.sp-comparison-table td:first-child{font-weight:600}
.sp-product-header{text-align:center}
.sp-product-image{width:100px;height:100px;object-fit:cover;border-radius:8px;margin:0 auto 8px;display:block}

/* ===== USP ===== */
.sp-usp-grid{display:grid;grid-template-columns:1fr;gap:15px}
.sp-usp-item{background:#fff;border-radius:15px;overflow:hidden;display:flex;flex-direction:column}
.sp-usp-media{width:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;line-height:0}
.sp-usp-img{width:100%;height:100%;display:block;object-fit:contain;object-position:center}
.sp-usp-text{padding:16px}
.sp-usp-text h2,.sp-usp-text h3{margin:0 0 8px}
.sp-usp-text p{margin:0;line-height:1.5}

/* ===== PORÓWNANIE WARIANTÓW (upsell/downsell) ===== */
.sp-cmp-comparison{background:var(--bg-color,#f6f6f6);margin-bottom:20px;padding:20px;border-radius:15px}
.sp-cmp-comparison h2{margin:0 0 12px;font-size:24px;line-height:1.25}
.sp-cmp-intro{margin:0 0 20px;line-height:1.5}
.sp-cmp-grid{display:grid;grid-template-columns:1fr;gap:15px}
.sp-cmp-card{position:relative;display:flex;flex-direction:column;background:#fff;padding:20px;border:1px solid #e5e5e5;border-radius:12px}
.sp-cmp-card.is-current{border:2px solid #DA251D}
.sp-cmp-card.is-recommended{border:2px solid #2F2F2F}
.sp-cmp-badge{display:inline-block;align-self:flex-start;margin-bottom:12px;padding:5px 10px;border-radius:20px;background:#eeeeee;font-size:12px;font-weight:700;line-height:1.2}
.sp-cmp-card.is-current .sp-cmp-badge{background:#DA251D;color:#fff}
.sp-cmp-card.is-recommended .sp-cmp-badge{background:#2F2F2F;color:#fff}
.sp-cmp-card h3{margin:0 0 8px;font-size:21px}
.sp-cmp-subtitle{margin:0 0 12px;font-size:16px;font-weight:700}
.sp-cmp-card p{margin:0 0 12px;line-height:1.5}
.sp-cmp-card ul{margin:0 0 18px;padding-left:20px;line-height:1.5}
.sp-cmp-card li{margin-bottom:6px}
.sp-cmp-link{display:inline-flex;justify-content:center;align-items:center;margin-top:auto;padding:11px 16px;border:1px solid #2F2F2F;border-radius:8px;color:#2F2F2F;font-weight:700;text-decoration:none}
.sp-cmp-card.is-current .sp-cmp-link{border-color:#DA251D;background:#DA251D;color:#fff}
.sp-cmp-card.is-recommended .sp-cmp-link{background:#2F2F2F;color:#fff}
.sp-cmp-summary{margin-top:20px;padding:15px;background:#fff;border-radius:10px;line-height:1.5}

@media(max-width:767px){
  .sp-flex{flex-direction:column}
  .sp-flex .sp-image-container{order:1}
  .sp-flex>div:not(.sp-image-container){order:2}
  .sp-icons-grid{grid-template-columns:1fr}
}
@media(min-width:768px){
  .sp-container{padding:20px}
  .sp-flex{flex-direction:row;align-items:center;gap:20px}
  .sp-flex.reverse{flex-direction:row-reverse}
  .sp-flex>div{flex:1}
  .sp-image{max-width:600px;max-height:460px;object-fit:contain}
  .sp-features-grid{grid-template-columns:1fr 1fr;gap:25px}
  .sp-feature-item{padding:25px;gap:25px}
  .sp-feature-icon{font-size:60px;width:100px;height:100px}
  .sp-feature-image{width:100px;height:100px}
  .sp-feature-content h4{font-size:20px}
  .sp-usp-grid{grid-template-columns:1fr 1fr;gap:20px}
  .sp-usp-item{height:380px;display:grid;grid-template-rows:7fr 3fr}
  .sp-usp-text{padding:18px 20px;display:flex;flex-direction:column;justify-content:flex-start}
  .sp-icons-grid{grid-template-columns:1fr 1fr;gap:20px}
  .sp-cmp-grid{grid-template-columns:repeat(auto-fit, minmax(220px, 1fr))}
}
@media(min-width:1024px){
  .sp-container{padding:25px}
  .sp-flex{gap:25px}
  .sp-image{max-width:720px;max-height:520px}
  .sp-features-grid{gap:30px}
  .sp-feature-item{padding:30px;gap:30px}
  .sp-feature-icon{font-size:70px;width:120px;height:120px}
  .sp-usp-item{height:440px}
  .sp-icons-grid{grid-template-columns:repeat(4,1fr);gap:20px}
}
</style>
`;

// ─── GŁÓWNY KOMPONENT ─────────────────────────────────────────────────────────
export default function AllegroDescriptionEditor() {
  const [sections, setSections] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [productBrand, setProductBrand] = useState('');
  const [productCode, setProductCode] = useState('');
  const [history, setHistory] = useState([{ sections: [], productBrand: '', productCode: '' }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRefs = useRef({});
  const importFileRef = useRef(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sp-templates-v2');
      if (saved) setTemplates(JSON.parse(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem('sp-templates-v2', JSON.stringify(templates)); } catch (e) {}
  }, [templates]);

  const sectionTypes = [
    { id: 'text-only',        name: 'Sam tekst',               icon: '📝', group: 'Podstawowe' },
    { id: 'image-left',       name: 'Zdjęcie ← Tekst',        icon: '◧',  group: 'Podstawowe' },
    { id: 'image-right',      name: 'Tekst → Zdjęcie',        icon: '◨',  group: 'Podstawowe' },
    { id: 'image-only',       name: 'Samo zdjęcie',           icon: '🖼️', group: 'Podstawowe' },
    { id: 'two-images',       name: '2 zdjęcia obok siebie',  icon: '▣',  group: 'Podstawowe' },
    { id: 'youtube-video',    name: 'Film YouTube',            icon: '▶️', group: 'Podstawowe' },
    // ── NOWE: video + tekst obok siebie ──
    { id: 'video-left',       name: 'Video ← Tekst',          icon: '▶◧', group: 'Podstawowe' },
    { id: 'video-right',      name: 'Tekst → Video',          icon: '◨▶', group: 'Podstawowe' },
    { id: 'usp-2',            name: 'USP – 2 zalety',         icon: '⬛⬛',group: 'USP' },
    { id: 'usp-4',            name: 'USP – 4 zalety',         icon: '⊞',  group: 'USP' },
    { id: 'usp-6',            name: 'USP – 6 zalet',          icon: '⊟',  group: 'USP' },
    { id: 'icons-grid',       name: 'Siatka ikon',            icon: '✦',  group: 'Zaawansowane' },
    { id: 'features-grid',    name: 'Funkcje 2×2',            icon: '🔲', group: 'Zaawansowane' },
    { id: 'comparison-table', name: 'Tabela porównawcza',     icon: '📊', group: 'Zaawansowane' },
    { id: 'comparison-cards', name: 'Porównanie wariantów (upsell/downsell)', icon: '🗂️', group: 'Zaawansowane' },
  ];

  const makeUSPItems = (count) =>
    Array.from({ length: count }, (_, i) => ({ id: i + 1, image: '', imagePreview: '', title: `Zaleta ${i + 1}`, description: 'Opis zalety produktu...' }));

  const saveToHistory = useCallback((s = sections, pb = productBrand, pc = productCode) => {
    setHistory(prev => {
      const newH = [...prev.slice(0, currentStep + 1), { sections: JSON.parse(JSON.stringify(s)), productBrand: pb, productCode: pc }];
      setCurrentStep(newH.length - 1);
      return newH;
    });
  }, [sections, productBrand, productCode, currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      const prev = history[currentStep - 1];
      setSections(prev.sections);
      setProductBrand(prev.productBrand);
      setProductCode(prev.productCode);
      setCurrentStep(c => c - 1);
    }
  }, [currentStep, history]);

  const addSection = useCallback((type) => {
    const newSec = {
      id: Date.now(), type,
      text: '', image1: '', image2: '', imagePreview1: '', imagePreview2: '',
      backgroundColor: '#f6f6f6',
      icons: type === 'icons-grid' ? [{ id: 1, icon: '✓', title: 'Tytuł', description: 'Opis', image: '', imagePreview: '' }] : undefined,
      iconsCardBackground: type === 'icons-grid' ? true : undefined,
      features: type === 'features-grid' ? [{ id: 1, icon: '🔇', title: 'Funkcja 1', description: 'Opis 1', image: '', imagePreview: '' }] : undefined,
      comparisonTable: type === 'comparison-table' ? {
        tableTitle: '',
        products: [{ id: 1, name: 'Produkt 1', image: '', imagePreview: '', backgroundColor: '#fff', url: '', isHighlighted: false, highlightColor: '#e8f4fd' }],
        attributes: [{ id: 1, name: 'Cecha', values: [{ text: '', textAlign: 'left', fontWeight: 'normal' }] }]
      } : undefined,
      cards: type === 'comparison-cards' ? [
        { id: 1, badge: 'current', title: 'Wariant A', subtitle: '', description: '', bullets: [''], linkUrl: '', linkText: '' },
        { id: 2, badge: 'recommended', title: 'Wariant B', subtitle: '', description: '', bullets: [''], linkUrl: '', linkText: '' }
      ] : undefined,
      heading: type === 'comparison-cards' ? 'Jaką wersję wybrać?' : undefined,
      intro: type === 'comparison-cards' ? '' : undefined,
      summary: type === 'comparison-cards' ? '' : undefined,
      // youtube-video = standalone, video-left/video-right = obok tekstu
      youtubeVideo: (type === 'youtube-video' || type === 'video-left' || type === 'video-right')
        ? { url: '', autoplay: false, startTime: 0 } : undefined,
      uspItems: type.startsWith('usp-') ? makeUSPItems(parseInt(type.split('-')[1])) : undefined,
    };
    setSections(prev => { const ns = [...prev, newSec]; saveToHistory(ns); return ns; });
  }, [saveToHistory]);

  const deleteSection = useCallback((id) => setSections(prev => { const ns = prev.filter(s => s.id !== id); saveToHistory(ns); return ns; }), [saveToHistory]);

  const moveSection = useCallback((id, dir) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === prev.length - 1)) return prev;
      const ns = [...prev];
      const t = dir === 'up' ? idx - 1 : idx + 1;
      [ns[idx], ns[t]] = [ns[t], ns[idx]];
      saveToHistory(ns);
      return ns;
    });
  }, [saveToHistory]);

  const copySection = useCallback((id) => {
    setSections(prev => {
      const s = prev.find(sec => sec.id === id);
      if (!s) return prev;
      const ns = [...prev, { ...JSON.parse(JSON.stringify(s)), id: Date.now(), imagePreview1: '', imagePreview2: '' }];
      saveToHistory(ns);
      return ns;
    });
  }, [saveToHistory]);

  const updateSection = useCallback((id, field, value) => setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s)), []);

  const handleImageUpload = useCallback((sectionId, field, e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const previewField = field === 'image1' ? 'imagePreview1' : 'imagePreview2';
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, [field]: f.name, [previewField]: url } : s));
  }, []);

  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) { alert('Podaj nazwę szablonu!'); return; }
    const tmpl = { id: Date.now(), name: templateName.trim(), sections: JSON.parse(JSON.stringify(sections)), productBrand, productCode, createdAt: new Date().toLocaleString('pl-PL') };
    setTemplates(prev => [...prev, tmpl]);
    setTemplateName('');
  }, [templateName, sections, productBrand, productCode]);

  const loadTemplate = useCallback((t) => {
    const cleanSections = (t.sections || []).map(s => ({
      ...s, imagePreview1: '', imagePreview2: '',
      icons: s.icons?.map(i => ({ ...i, imagePreview: '' })),
      features: s.features?.map(f => ({ ...f, imagePreview: '' })),
      uspItems: s.uspItems?.map(u => ({ ...u, imagePreview: '' })),
      comparisonTable: s.comparisonTable ? {
        ...s.comparisonTable,
        tableTitle: s.comparisonTable.tableTitle || '',
        products: s.comparisonTable.products.map(p => ({
          ...p, imagePreview: '',
          url: p.url || '',
          isHighlighted: p.isHighlighted || false,
          highlightColor: p.highlightColor || '#e8f4fd'
        }))
      } : undefined
    }));
    setHistory(prev => [...prev, { sections: JSON.parse(JSON.stringify(sections)), productBrand, productCode }]);
    setCurrentStep(prev => prev + 1);
    setSections(cleanSections);
    setProductBrand(t.productBrand || '');
    setProductCode(t.productCode || '');
    setShowTemplates(false);
  }, [sections, productBrand, productCode]);

  const deleteTemplate = useCallback((id) => { if (window.confirm('Usunąć szablon?')) setTemplates(prev => prev.filter(t => t.id !== id)); }, []);

  const downloadTemplates = useCallback(() => {
    const blob = new Blob([JSON.stringify(templates, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `sportpoland-szablony-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  }, [templates]);

  const downloadSingleTemplate = useCallback((t) => {
    const blob = new Blob([JSON.stringify([t], null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${t.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click(); URL.revokeObjectURL(url);
  }, []);

  const uploadTemplates = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        const arr = Array.isArray(imported) ? imported : [imported];
        const withIds = arr.map(t => ({ ...t, id: Date.now() + Math.random(), createdAt: `${t.createdAt || ''} (import)` }));
        setTemplates(prev => [...prev, ...withIds]);
        alert(`✅ Wczytano ${withIds.length} ${withIds.length === 1 ? 'szablon' : 'szablony/szablonów'}!`);
      } catch (err) { alert('❌ Błąd odczytu pliku JSON!'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const generateImagePath = useCallback((imageName) => {
    if (!imageName || !productBrand || !productCode) return imageName || '';
    return `/data/include/cms/sportpoland_com/pliki-opisy/${productBrand}/${productCode}/${imageName}`;
  }, [productBrand, productCode]);

  const generateAltText = useCallback((imageName) => {
    if (!imageName) return '';
    let alt = imageName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    if (productBrand && productCode) alt = `${productBrand} ${productCode} ${alt}`;
    return alt;
  }, [productBrand, productCode]);

  const generateUSPHtml = useCallback((s, preview) => {
    const items = (s.uspItems || []).map(item => {
      const src = preview ? item.imagePreview : generateImagePath(item.image);
      const imgHtml = (item.image || item.imagePreview) ? `<img class="sp-usp-img" src="${src}" alt="${item.title}" border="0">` : '';
      return `<div class="sp-usp-item">\n  <div class="sp-usp-media">${imgHtml}</div>\n  <div class="sp-usp-text"><h3>${item.title}</h3><p>${item.description}</p></div>\n</div>`;
    }).join('\n');
    return `<div class="sp-container sp-usp" style="--bg-color:${s.backgroundColor};">\n<div class="sp-usp-grid">${items}</div>\n</div>\n`;
  }, [generateImagePath]);

  const generateComparisonCardsHtml = useCallback((s) => {
    const cmpCardsHtml = (s.cards || []).map(card => {
      const badgeClass = card.badge === 'current' ? ' is-current' : card.badge === 'recommended' ? ' is-recommended' : '';
      const badgeLabel = card.badge === 'current' ? 'Aktualnie oglądasz' : card.badge === 'recommended' ? 'Polecany wariant' : '';
      const bulletsHtml = (card.bullets || []).filter(b => b.trim()).map(b => `<li>${b}</li>`).join('');
      return `<article class="sp-cmp-card${badgeClass}">${badgeLabel ? `<span class="sp-cmp-badge">${badgeLabel}</span>` : ''}<h3>${card.title}</h3>${card.subtitle ? `<p class="sp-cmp-subtitle">${card.subtitle}</p>` : ''}${card.description ? `<p>${card.description}</p>` : ''}${bulletsHtml ? `<ul>${bulletsHtml}</ul>` : ''}${card.linkUrl ? `<a class="sp-cmp-link" href="${card.linkUrl}">${card.linkText || 'Zobacz produkt'}</a>` : ''}</article>`;
    }).join('\n');
    return `<section class="sp-cmp-comparison" style="--bg-color:${s.backgroundColor};">\n${s.heading ? `<h2>${s.heading}</h2>` : ''}\n${s.intro ? `<p class="sp-cmp-intro">${s.intro}</p>` : ''}\n<div class="sp-cmp-grid">${cmpCardsHtml}</div>\n${s.summary ? `<div class="sp-cmp-summary">${s.summary}</div>` : ''}\n</section>\n`;
  }, []);

  // ─── helper: wyciąga video ID z URL YouTube ───────────────────────────────
  const extractYouTubeId = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      return u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v') || '';
    } catch (e) { return ''; }
  };

  const generateHTML = useCallback((preview = false) => {
    let html = EXPORT_CSS;
    sections.forEach(s => {
      const bg = `--bg-color:${s.backgroundColor};`;

      if (s.type === 'text-only') {
        html += `<div class="sp-container" style="${bg}">\n<div class="sp-text">${s.text || ''}</div>\n</div>\n`;

      } else if (s.type === 'image-left' || s.type === 'image-right') {
        const src = preview ? s.imagePreview1 : generateImagePath(s.image1);
        const cls = s.type === 'image-right' ? 'sp-flex reverse' : 'sp-flex';
        html += `<div class="sp-container" style="${bg}">\n<div class="${cls}">\n<div class="sp-image-container">${(s.image1 || s.imagePreview1) ? `<img class="sp-image" src="${src}" alt="${generateAltText(s.image1)}" border="0">` : ''}</div>\n<div><div class="sp-text">${s.text || ''}</div></div>\n</div>\n</div>\n`;

      } else if (s.type === 'image-only') {
        const src = preview ? s.imagePreview1 : generateImagePath(s.image1);
        html += `<div class="sp-container" style="${bg}">${(s.image1 || s.imagePreview1) ? `<img class="sp-image-only" src="${src}" alt="${generateAltText(s.image1)}" border="0">` : ''}</div>\n`;

      } else if (s.type === 'two-images') {
        const s1 = preview ? s.imagePreview1 : generateImagePath(s.image1);
        const s2 = preview ? s.imagePreview2 : generateImagePath(s.image2);
        html += `<div class="sp-container" style="${bg}">\n<div class="sp-flex">\n<div style="text-align:center">${(s.image1 || s.imagePreview1) ? `<img class="sp-image" style="max-width:none;width:100%" src="${s1}" alt="${generateAltText(s.image1)}" border="0">` : ''}</div>\n<div style="text-align:center">${(s.image2 || s.imagePreview2) ? `<img class="sp-image" style="max-width:none;width:100%" src="${s2}" alt="${generateAltText(s.image2)}" border="0">` : ''}</div>\n</div>\n</div>\n`;

      } else if (s.type === 'youtube-video' && s.youtubeVideo?.url) {
        const vid = extractYouTubeId(s.youtubeVideo.url);
        if (vid) {
          const params = [s.youtubeVideo.autoplay && 'autoplay=1', s.youtubeVideo.startTime > 0 && `start=${s.youtubeVideo.startTime}`].filter(Boolean).join('&');
          html += `<div class="sp-container" style="${bg}">\n<div class="sp-youtube-container"><iframe title="YouTube video player" src="https://www.youtube.com/embed/${vid}${params ? '?' + params : ''}" allowfullscreen="allowfullscreen"></iframe></div>\n</div>\n`;
        }

      // ── NOWE: video-left i video-right ──────────────────────────────────────
      } else if ((s.type === 'video-left' || s.type === 'video-right') && s.youtubeVideo) {
        const vid = extractYouTubeId(s.youtubeVideo.url);
        const cls = s.type === 'video-right' ? 'sp-flex reverse' : 'sp-flex';
        const videoHtml = vid
          ? `<div class="sp-youtube-container"><iframe title="YouTube video player" src="https://www.youtube.com/embed/${vid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="allowfullscreen"></iframe></div>`
          : '';
        html += `<div class="sp-container" style="${bg}">\n<div class="${cls}">\n<div class="sp-image-container">${videoHtml}</div>\n<div><div class="sp-text">${s.text || ''}</div></div>\n</div>\n</div>\n`;

      } else if (s.type.startsWith('usp-')) {
        html += generateUSPHtml(s, preview);

      } else if (s.type === 'icons-grid' && s.icons) {
        const icons = s.icons.map(i => {
          const src = preview ? i.imagePreview : generateImagePath(i.image);
          const media = (i.image || i.imagePreview)
            ? `<div class="sp-icon-media"><img class="sp-icon-image" src="${src}" alt="${i.title}" border="0"></div>`
            : `<span class="sp-icon-emoji">${i.icon}</span>`;
          return `<div class="sp-icon-item">${media}<div class="sp-icon-text"><h4>${i.title}</h4><p class="sp-icon-desc">${i.description}</p></div></div>`;
        }).join('\n');
        const iconCardBg = s.iconsCardBackground === false ? 'transparent' : '#fff';
        html += `<div class="sp-container" style="${bg} --icon-card-bg:${iconCardBg};">\n<div class="sp-icons-grid">${icons}</div>\n</div>\n`;

      } else if (s.type === 'features-grid' && s.features) {
        const feats = s.features.map(f => {
          const src = preview ? f.imagePreview : generateImagePath(f.image);
          return `<div class="sp-feature-item">${(f.image || f.imagePreview) ? `<img src="${src}" class="sp-feature-image" alt="${f.title}">` : `<div class="sp-feature-icon">${f.icon}</div>`}<div class="sp-feature-content"><h4>${f.title}</h4><p>${f.description}</p></div></div>`;
        }).join('');
        html += `<div class="sp-container" style="${bg}">\n<div class="sp-features-grid">${feats}</div>\n</div>\n`;

      } else if (s.type === 'comparison-table' && s.comparisonTable) {
        const t = s.comparisonTable;
        // tytuł tabeli
        const titleHtml = t.tableTitle
          ? `<h2 style="margin-top:0;text-align:left;">${t.tableTitle}</h2>\n`
          : '';
        // nagłówki produktów z linkami i wyróżnieniem
        const headers = t.products.map(p => {
          const src = preview ? p.imagePreview : generateImagePath(p.image);
          const bgColor = p.isHighlighted ? (p.highlightColor || '#e8f4fd') : (p.backgroundColor || '#fff');
          const imgTag = (p.image || p.imagePreview)
            ? `<img style="margin:0 auto;" class="sp-product-image" src="${src}" alt="${p.name}" border="0">`
            : '';
          const imgWrapped = p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${imgTag}</a>` : imgTag;
          const nameWrapped = p.url
            ? `<a href="${p.url}" target="_blank" rel="noopener"><strong>${p.name}</strong></a>`
            : `<strong>${p.name}</strong>`;
          const badge = p.isHighlighted ? '<br>(wybrany)' : '';
          return `<th class="sp-product-header" style="background-color:${bgColor};text-align:center;">${imgWrapped}<div>${nameWrapped}${badge}</div></th>`;
        }).join('');
        // wiersze – uwzględniają kolor wyróżnienia
        const rows = t.attributes.map(a =>
          `<tr><td>${a.name}</td>${a.values.map((v, i) => {
            const p = t.products[i];
            const bgColor = p?.isHighlighted ? (p?.highlightColor || '#e8f4fd') : (p?.backgroundColor || '#fff');
            return `<td style="text-align:${v.textAlign};font-weight:${v.fontWeight};background-color:${bgColor}">${v.text}</td>`;
          }).join('')}</tr>`
        ).join('');
        html += `<div class="sp-container" style="${bg}">\n${titleHtml}<div class="sp-comparison-table"><table><thead><tr><th style="background-color:${s.backgroundColor}"></th>${headers}</tr></thead><tbody>${rows}</tbody></table></div>\n</div>\n`;

      } else if (s.type === 'comparison-cards' && s.cards) {
        html += generateComparisonCardsHtml(s);
      }
    });
    return html;
  }, [sections, generateImagePath, generateAltText, generateUSPHtml, generateComparisonCardsHtml]);

  const copyHTML = useCallback(async () => {
    try { await navigator.clipboard.writeText(generateHTML()); alert('✅ Skopiowano HTML!'); }
    catch (e) { alert('❌ Błąd kopiowania.'); }
  }, [generateHTML]);

  const downloadHTML = useCallback(() => {
    const blob = new Blob([generateHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'opis.html'; a.click(); URL.revokeObjectURL(url);
  }, [generateHTML]);

  const updateUSPItem = useCallback((sectionId, itemId, updated) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, uspItems: s.uspItems.map(item => item.id === itemId ? updated : item) } : s));
  }, []);

  const deleteUSPItem = useCallback((sectionId, itemId) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, uspItems: s.uspItems.filter(item => item.id !== itemId) } : s));
  }, []);

  const addUSPItem = useCallback((sectionId) => {
    setSections(prev => prev.map(s => s.id === sectionId
      ? { ...s, uspItems: [...(s.uspItems || []), { id: Date.now(), image: '', imagePreview: '', title: 'Nowa zaleta', description: 'Opis...' }] } : s));
  }, []);

  const updateComparisonCard = useCallback((sectionId, cardIndex, field, value) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newCards = [...s.cards];
      newCards[cardIndex] = { ...newCards[cardIndex], [field]: value };
      return { ...s, cards: newCards };
    }));
  }, []);

  const addComparisonCard = useCallback((sectionId) => {
    setSections(prev => prev.map(s => s.id === sectionId
      ? { ...s, cards: [...s.cards, { id: Date.now(), badge: 'none', title: 'Nowy wariant', subtitle: '', description: '', bullets: [''], linkUrl: '', linkText: '' }] }
      : s));
  }, []);

  const removeComparisonCard = useCallback((sectionId, cardIndex) => {
    setSections(prev => prev.map(s => s.id === sectionId
      ? { ...s, cards: s.cards.filter((_, i) => i !== cardIndex) }
      : s));
  }, []);

  const updateComparisonBullet = useCallback((sectionId, cardIndex, bulletIndex, value) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newCards = [...s.cards];
      const newBullets = [...newCards[cardIndex].bullets];
      newBullets[bulletIndex] = value;
      newCards[cardIndex] = { ...newCards[cardIndex], bullets: newBullets };
      return { ...s, cards: newCards };
    }));
  }, []);

  const addComparisonBullet = useCallback((sectionId, cardIndex) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newCards = [...s.cards];
      newCards[cardIndex] = { ...newCards[cardIndex], bullets: [...newCards[cardIndex].bullets, ''] };
      return { ...s, cards: newCards };
    }));
  }, []);

  const removeComparisonBullet = useCallback((sectionId, cardIndex, bulletIndex) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newCards = [...s.cards];
      newCards[cardIndex] = { ...newCards[cardIndex], bullets: newCards[cardIndex].bullets.filter((_, i) => i !== bulletIndex) };
      return { ...s, cards: newCards };
    }));
  }, []);

  const btn = (color, small) => ({
    padding: small ? '6px 12px' : '8px 16px',
    backgroundColor: color, color: 'white', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontSize: small ? '12px' : '13px', fontWeight: 500
  });

  const groupColors = { Podstawowe: '#3b82f6', USP: '#8b5cf6', Zaawansowane: '#10b981' };
  const groups = [...new Set(sectionTypes.map(t => t.group))];

  // ─── helper: inline preview iframe YT ────────────────────────────────────
  const renderYTPreview = (url) => {
    const vid = extractYouTubeId(url);
    if (!vid) return null;
    return (
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
        <iframe src={`https://www.youtube.com/embed/${vid}`} title="YouTube video preview"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen />
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,.1)', border: '1px solid #e5e7eb' }}>

          {/* NAGŁÓWEK */}
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Edytor opisów SportPoland</h1>
              <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>Tworzenie opisów HTML do Allegro, IdoSell, Decathlon…</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {currentStep > 0 && <button onClick={goBack} style={btn('#6b7280', true)}>⬅️ Cofnij</button>}
              <button onClick={() => setShowTemplates(p => !p)} style={btn(showTemplates ? '#1d4ed8' : '#3b82f6', true)}>
                📁 Szablony {templates.length > 0 && `(${templates.length})`}
              </button>
            </div>
          </div>

          {/* PANEL SZABLONÓW */}
          {showTemplates && (
            <div style={{ borderBottom: '1px solid #e5e7eb', padding: 16, backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>📁 Zarządzanie szablonami</h3>
              <div style={{ marginBottom: 12, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, backgroundColor: 'white' }}>
                <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#374151' }}>💾 Zapisz bieżący stan jako szablon:</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveTemplate()} placeholder="Nazwa szablonu np. Bieżnia standard..." style={{ flex: 1, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
                  <button onClick={saveTemplate} style={btn('#10b981', true)}>💾 Zapisz</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ padding: 10, border: '1px solid #bfdbfe', borderRadius: 8, backgroundColor: '#eff6ff', flex: 1, minWidth: 200 }}>
                  <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#1e40af' }}>📤 Eksport na laptop:</p>
                  <button onClick={downloadTemplates} disabled={templates.length === 0} style={{ ...btn('#2563eb', true), opacity: templates.length === 0 ? 0.5 : 1, width: '100%' }}>⬇️ Pobierz wszystkie szablony (.json)</button>
                </div>
                <div style={{ padding: 10, border: '1px solid #bbf7d0', borderRadius: 8, backgroundColor: '#f0fdf4', flex: 1, minWidth: 200 }}>
                  <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#166534' }}>📥 Import z laptopa:</p>
                  <input type="file" accept=".json" onChange={uploadTemplates} style={{ display: 'none' }} ref={importFileRef} />
                  <button onClick={() => importFileRef.current?.click()} style={{ ...btn('#16a34a', true), width: '100%' }}>⬆️ Wczytaj plik .json z laptopa</button>
                </div>
              </div>
              {templates.length === 0
                ? <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 16 }}>Brak zapisanych szablonów.</p>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {templates.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 6 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                          <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>{t.createdAt}</span>
                          {(t.productBrand || t.productCode) && <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>({t.productBrand} {t.productCode})</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => loadTemplate(t)} style={btn('#3b82f6', true)}>📂 Wczytaj</button>
                          <button onClick={() => downloadSingleTemplate(t)} style={btn('#10b981', true)}>⬇️</button>
                          <button onClick={() => deleteTemplate(t.id)} style={btn('#ef4444', true)}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* DANE PRODUKTU */}
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#374151' }}>Dane produktu</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input type="text" value={productBrand} onChange={e => setProductBrand(e.target.value)} placeholder="Marka (np. Kettler)" style={{ flex: 1, minWidth: 150, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
              <input type="text" value={productCode} onChange={e => setProductCode(e.target.value)} placeholder="Kod produktu (np. 08971)" style={{ flex: 1, minWidth: 150, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
            </div>
            {productBrand && productCode && <p style={{ margin: '6px 0 0', fontSize: 11, color: '#6b7280' }}>Ścieżka: /data/include/cms/sportpoland_com/pliki-opisy/{productBrand}/{productCode}/</p>}
          </div>

          {/* DODAJ SEKCJĘ */}
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: 16 }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 600, color: '#374151' }}>Dodaj sekcję</h3>
            {groups.map(group => (
              <div key={group} style={{ marginBottom: 10 }}>
                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sectionTypes.filter(t => t.group === group).map(t => (
                    <button key={t.id} onClick={() => addSection(t.id)} style={{ padding: '7px 12px', backgroundColor: groupColors[group], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                      {t.icon} {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* SEKCJE */}
          <div style={{ padding: 16 }}>
            {sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
                <div style={{ fontSize: 56 }}>📝</div>
                <p style={{ margin: '8px 0 0', fontSize: 15 }}>Kliknij przycisk powyżej, aby dodać pierwszą sekcję</p>
              </div>
            ) : (
              <>
                {sections.map((s, i) => {
                  const typeMeta = sectionTypes.find(t => t.id === s.type);
                  return (
                    <div key={s.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{typeMeta?.icon} {typeMeta?.name}</span>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <button onClick={() => moveSection(s.id, 'up')} disabled={i === 0} style={{ padding: '3px 7px', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: 4, cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.3 : 1, fontSize: 12 }}>⬆️</button>
                          <button onClick={() => moveSection(s.id, 'down')} disabled={i === sections.length - 1} style={{ padding: '3px 7px', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: 4, cursor: i === sections.length - 1 ? 'not-allowed' : 'pointer', opacity: i === sections.length - 1 ? 0.3 : 1, fontSize: 12 }}>⬇️</button>
                          <button onClick={() => copySection(s.id)} style={{ padding: '3px 7px', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: 4, cursor: 'pointer', fontSize: 12 }} title="Duplikuj sekcję">📋</button>
                          <button onClick={() => deleteSection(s.id)} style={{ padding: '3px 7px', border: '1px solid #fca5a5', backgroundColor: '#fff1f2', borderRadius: 4, cursor: 'pointer', fontSize: 12, color: '#dc2626' }}>🗑️</button>
                        </div>
                      </div>
                      <div style={{ padding: '6px 12px', backgroundColor: '#fafafa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label style={{ fontSize: 12, color: '#6b7280' }}>Kolor tła:</label>
                        <input type="color" value={s.backgroundColor === 'transparent' ? '#ffffff' : s.backgroundColor} onChange={e => updateSection(s.id, 'backgroundColor', e.target.value)} style={{ width: 32, height: 24, borderRadius: 4, border: '1px solid #d1d5db', cursor: 'pointer', padding: 0 }} />
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{s.backgroundColor}</span>
                        <button onClick={() => updateSection(s.id, 'backgroundColor', 'transparent')} style={{ padding: '4px 10px', fontSize: 11, backgroundColor: s.backgroundColor === 'transparent' ? '#4b5563' : '#9ca3af', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500 }}>
                          Brak tła
                        </button>
                      </div>

                      <div style={{ padding: 12, backgroundColor: s.backgroundColor }}>

                        {s.type === 'text-only' && <TextEditor sectionId={s.id} value={s.text} onChange={v => updateSection(s.id, 'text', v)} />}

                        {(s.type === 'image-left' || s.type === 'image-right') && (
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <ImageUploader preview={s.imagePreview1} onUpload={e => handleImageUpload(s.id, 'image1', e)} />
                              {s.image1 && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6b7280' }}>📄 {s.image1}</p>}
                            </div>
                            <div style={{ flex: 2, minWidth: 200 }}>
                              <TextEditor sectionId={s.id} value={s.text} onChange={v => updateSection(s.id, 'text', v)} />
                            </div>
                          </div>
                        )}

                        {s.type === 'image-only' && (
                          <div>
                            <ImageUploader preview={s.imagePreview1} onUpload={e => handleImageUpload(s.id, 'image1', e)} size="large" />
                            {s.image1 && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6b7280' }}>📄 {s.image1}</p>}
                          </div>
                        )}

                        {s.type === 'two-images' && (
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {[1, 2].map(n => (
                              <div key={n} style={{ flex: 1, minWidth: 160 }}>
                                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 500, color: '#374151' }}>Zdjęcie {n}:</p>
                                <ImageUploader preview={s[`imagePreview${n}`]} onUpload={e => handleImageUpload(s.id, `image${n}`, e)} />
                                {s[`image${n}`] && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6b7280' }}>📄 {s[`image${n}`]}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {s.type === 'youtube-video' && s.youtubeVideo && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input type="text" value={s.youtubeVideo.url} onChange={e => updateSection(s.id, 'youtubeVideo', { ...s.youtubeVideo, url: e.target.value })} placeholder="URL YouTube (np. https://www.youtube.com/watch?v=...)" style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
                            {s.youtubeVideo.url && renderYTPreview(s.youtubeVideo.url)}
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                              <input type="checkbox" checked={s.youtubeVideo.autoplay} onChange={e => updateSection(s.id, 'youtubeVideo', { ...s.youtubeVideo, autoplay: e.target.checked })} />
                              Autoplay
                            </label>
                          </div>
                        )}

                        {/* ── NOWE: video-left i video-right ─────────────────────────────── */}
                        {(s.type === 'video-left' || s.type === 'video-right') && s.youtubeVideo && (
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {/* kolumna z video */}
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#374151' }}>
                                {s.type === 'video-left' ? '◀ Film YouTube (lewa strona)' : 'Film YouTube (prawa strona) ▶'}
                              </p>
                              <input
                                type="text" value={s.youtubeVideo.url}
                                onChange={e => updateSection(s.id, 'youtubeVideo', { ...s.youtubeVideo, url: e.target.value })}
                                placeholder="URL YouTube (np. https://www.youtube.com/watch?v=...)"
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', marginBottom: 8 }}
                              />
                              {s.youtubeVideo.url && renderYTPreview(s.youtubeVideo.url)}
                            </div>
                            {/* kolumna z tekstem */}
                            <div style={{ flex: 2, minWidth: 200 }}>
                              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#374151' }}>Tekst obok:</p>
                              <TextEditor sectionId={s.id} value={s.text} onChange={v => updateSection(s.id, 'text', v)} />
                            </div>
                          </div>
                        )}

                        {s.type.startsWith('usp-') && s.uspItems && (
                          <div>
                            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6b7280' }}>Na desktopie: 2 kafelki obok siebie, układ 7/10 zdjęcie + 3/10 tekst.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 12 }}>
                              {s.uspItems.map((item, idx) => (
                                <USPItemEditor key={item.id} item={item} index={idx}
                                  onUpdate={updated => updateUSPItem(s.id, item.id, updated)}
                                  onDelete={() => deleteUSPItem(s.id, item.id)} />
                              ))}
                            </div>
                            <button onClick={() => addUSPItem(s.id)} style={btn('#8b5cf6', true)}>+ Dodaj zaletę</button>
                          </div>
                        )}

                        {/* ─── SIATKA IKON – nowy styl kart ─── */}
                        {s.type === 'icons-grid' && s.icons && (
                          <div>
                            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6b7280' }}>
                              Karty: obrazek u góry, tekst poniżej. Mobile: 1 kolumna · Tablet: 2 · Desktop: 4.
                            </p>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151', marginBottom: 10, cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={s.iconsCardBackground !== false}
                                onChange={e => updateSection(s.id, 'iconsCardBackground', e.target.checked)}
                              />
                              Białe tło pod każdą ikoną
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 10 }}>
                              {s.icons.map((icon, idx) => (
                                <div key={icon.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, backgroundColor: 'white', overflow: 'hidden', position: 'relative' }}>
                                  <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.filter((_, i) => i !== idx) } : sec))} style={{ position: 'absolute', top: 6, right: 6, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 13, lineHeight: 1, zIndex: 1 }}>×</button>
                                  <div style={{ backgroundColor: '#f9fafb', padding: '14px 14px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
                                    {icon.imagePreview
                                      ? <img src={icon.imagePreview} alt="" style={{ maxWidth: '100%', maxHeight: 80, objectFit: 'contain' }} />
                                      : <input type="text" value={icon.icon} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, icon: e.target.value } : ic) } : sec))} style={{ fontSize: 36, textAlign: 'center', width: '100%', border: 'none', background: 'transparent', cursor: 'text' }} />
                                    }
                                  </div>
                                  <div style={{ padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, image: f.name, imagePreview: url } : ic) } : sec)); }}} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-icon-${idx}`] = el; }} />
                                    <button onClick={() => fileInputRefs.current[`${s.id}-icon-${idx}`]?.click()} style={{ padding: '3px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 10 }}>📸 Zmień zdjęcie</button>
                                    <input type="text" value={icon.title} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, title: e.target.value } : ic) } : sec))} placeholder="Tytuł" style={{ width: '100%', padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12, fontWeight: 600, boxSizing: 'border-box' }} />
                                    <textarea value={icon.description} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, description: e.target.value } : ic) } : sec))} placeholder="Opis" style={{ width: '100%', padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 11, minHeight: 50, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: [...sec.icons, { id: Date.now(), icon: '📌', title: 'Tytuł', description: 'Opis', image: '', imagePreview: '' }] } : sec))} style={btn('#10b981', true)}>+ Dodaj ikonę</button>
                          </div>
                        )}

                        {s.type === 'features-grid' && s.features && (
                          <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 10, marginBottom: 10 }}>
                              {s.features.map((feat, idx) => (
                                <div key={feat.id} style={{ display: 'flex', gap: 10, padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, backgroundColor: 'white', position: 'relative' }}>
                                  <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.filter((_, i) => i !== idx) } : sec))} style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                                  <div style={{ width: 50, height: 50, flexShrink: 0 }}>
                                    {feat.imagePreview
                                      ? <img src={feat.imagePreview} alt="" style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover' }} />
                                      : <input type="text" value={feat.icon} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((f, i) => i === idx ? { ...f, icon: e.target.value } : f) } : sec))} style={{ fontSize: 24, textAlign: 'center', width: 50, border: 'none', background: 'transparent' }} />
                                    }
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <input type="text" value={feat.title} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((f, i) => i === idx ? { ...f, title: e.target.value } : f) } : sec))} placeholder="Tytuł" style={{ width: '100%', padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, fontWeight: 600, marginBottom: 4, boxSizing: 'border-box' }} />
                                    <textarea value={feat.description} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((f, i) => i === idx ? { ...f, description: e.target.value } : f) } : sec))} placeholder="Opis" style={{ width: '100%', padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12, minHeight: 40, resize: 'vertical', boxSizing: 'border-box', marginBottom: 4 }} />
                                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((ft, i) => i === idx ? { ...ft, image: f.name, imagePreview: url } : ft) } : sec)); }}} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-feat-${idx}`] = el; }} />
                                    <button onClick={() => fileInputRefs.current[`${s.id}-feat-${idx}`]?.click()} style={{ padding: '3px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 10 }}>📸 Zdjęcie</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: [...sec.features, { id: Date.now(), icon: '📌', title: 'Funkcja', description: 'Opis', image: '', imagePreview: '' }] } : sec))} style={btn('#10b981', true)}>+ Dodaj funkcję</button>
                          </div>
                        )}

                        {/* ── TABELA PORÓWNAWCZA – rozbudowana wersja ─────────────────────── */}
                        {s.type === 'comparison-table' && s.comparisonTable && (
                          <div>
                            {/* Tytuł tabeli */}
                            <div style={{ marginBottom: 12 }}>
                              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Tytuł tabeli (H2, opcjonalny):</label>
                              <input
                                type="text"
                                value={s.comparisonTable.tableTitle || ''}
                                onChange={e => setSections(prev => prev.map(sec => sec.id === s.id
                                  ? { ...sec, comparisonTable: { ...sec.comparisonTable, tableTitle: e.target.value } }
                                  : sec))}
                                placeholder="np. Porównanie wariantów produktu…"
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', fontWeight: 600 }}
                              />
                            </div>

                            <h4 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px', color: '#374151' }}>Produkty:</h4>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                              {s.comparisonTable.products.map((prod, pIdx) => (
                                <div key={prod.id} style={{
                                  width: 150, padding: 8, border: `2px solid ${prod.isHighlighted ? (prod.highlightColor || '#e8f4fd') : '#e5e7eb'}`,
                                  borderRadius: 6, backgroundColor: prod.isHighlighted ? (prod.highlightColor || '#e8f4fd') : 'white', position: 'relative'
                                }}>
                                  {prod.isHighlighted && (
                                    <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f59e0b', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10, whiteSpace: 'nowrap' }}>
                                      ★ WYBRANY
                                    </div>
                                  )}
                                  {s.comparisonTable.products.length > 1 && (
                                    <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.filter((_, i) => i !== pIdx), attributes: sec.comparisonTable.attributes.map(a => ({ ...a, values: a.values.filter((_, i) => i !== pIdx) })) }} : sec))}
                                      style={{ position: 'absolute', top: 3, right: 3, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 16, height: 16, cursor: 'pointer', fontSize: 11, lineHeight: 1 }}>×</button>
                                  )}
                                  {/* miniaturka */}
                                  <div style={{ width: 70, height: 70, margin: '0 auto 6px', border: '2px dashed #d1d5db', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {prod.imagePreview ? <img src={prod.imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 24, color: '#d1d5db' }}>📸</span>}
                                  </div>
                                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, image: f.name, imagePreview: url } : p) }} : sec)); }}} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-prod-${pIdx}`] = el; }} />
                                  <button onClick={() => fileInputRefs.current[`${s.id}-prod-${pIdx}`]?.click()} style={{ width: '100%', padding: 3, backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 10, marginBottom: 4 }}>📸 Zdjęcie</button>
                                  {/* nazwa produktu */}
                                  <input type="text" value={prod.name} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, name: e.target.value } : p) }} : sec))} placeholder="Nazwa" style={{ width: '100%', padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 11, textAlign: 'center', boxSizing: 'border-box', marginBottom: 4 }} />
                                  {/* link do produktu */}
                                  <input type="text" value={prod.url || ''} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, url: e.target.value } : p) }} : sec))} placeholder="URL produktu (opcjonalnie)" style={{ width: '100%', padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 10, boxSizing: 'border-box', marginBottom: 4 }} />
                                  {/* wyróżnij produkt */}
                                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer', marginBottom: 4 }}>
                                    <input type="checkbox" checked={prod.isHighlighted || false} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, isHighlighted: e.target.checked } : p) }} : sec))} />
                                    <span style={{ fontWeight: 600 }}>★ Wyróżniony</span>
                                  </label>
                                  {/* kolor wyróżnienia */}
                                  {prod.isHighlighted && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                                      <label style={{ fontSize: 10 }}>Kolor:</label>
                                      <input type="color" value={prod.highlightColor || '#e8f4fd'} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, highlightColor: e.target.value } : p) }} : sec))} style={{ width: 28, height: 20, border: '1px solid #d1d5db', borderRadius: 3, cursor: 'pointer', padding: 0 }} />
                                      <span style={{ fontSize: 9, color: '#6b7280' }}>{prod.highlightColor || '#e8f4fd'}</span>
                                    </div>
                                  )}
                                  {/* kolor tła (gdy nie wyróżniony) */}
                                  {!prod.isHighlighted && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                                      <label style={{ fontSize: 10 }}>Kolor tła:</label>
                                      <input type="color" value={prod.backgroundColor || '#fff'} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, backgroundColor: e.target.value } : p) }} : sec))} style={{ width: 22, height: 18, border: '1px solid #d1d5db', borderRadius: 3, cursor: 'pointer', padding: 0 }} />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: [...sec.comparisonTable.products, { id: Date.now(), name: `Produkt ${sec.comparisonTable.products.length + 1}`, image: '', imagePreview: '', backgroundColor: '#fff', url: '', isHighlighted: false, highlightColor: '#e8f4fd' }], attributes: sec.comparisonTable.attributes.map(a => ({ ...a, values: [...a.values, { text: '', textAlign: 'left', fontWeight: 'normal' }] })) }} : sec))}
                              style={{ ...btn('#3b82f6', true), marginBottom: 12 }}>+ Dodaj produkt</button>

                            <h4 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px', color: '#374151' }}>Atrybuty:</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                              {s.comparisonTable.attributes.map((attr, aIdx) => (
                                <div key={attr.id} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 8, backgroundColor: 'white', position: 'relative' }}>
                                  <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.filter((_, i) => i !== aIdx) }} : sec))} style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 16, height: 16, cursor: 'pointer', fontSize: 11, lineHeight: 1 }}>×</button>
                                  <input type="text" value={attr.name} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, name: e.target.value } : a) }} : sec))} placeholder="Nazwa atrybutu" style={{ padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12, fontWeight: 600, marginBottom: 6, boxSizing: 'border-box', maxWidth: 200 }} />
                                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {attr.values.map((val, vIdx) => {
                                      const prod = s.comparisonTable.products[vIdx];
                                      const isHL = prod?.isHighlighted;
                                      return (
                                        <div key={vIdx} style={{ flex: 1, minWidth: 130, border: `1px solid ${isHL ? (prod?.highlightColor || '#e8f4fd') : '#e5e7eb'}`, borderRadius: 4, padding: 4, backgroundColor: isHL ? (prod?.highlightColor || '#e8f4fd') : '#f9fafb' }}>
                                          <label style={{ fontSize: 9, fontWeight: 600, display: 'block', marginBottom: 2, color: isHL ? '#92400e' : '#6b7280' }}>
                                            {isHL ? '★ ' : ''}{prod?.name || `P${vIdx + 1}`}
                                          </label>
                                          <textarea value={val.text} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, values: a.values.map((v, j) => j === vIdx ? { ...v, text: e.target.value } : v) } : a) }} : sec))} placeholder="Wartość" style={{ width: '100%', padding: 3, border: '1px solid #d1d5db', borderRadius: 3, fontSize: 11, minHeight: 35, resize: 'vertical', boxSizing: 'border-box', marginBottom: 3 }} />
                                          <div style={{ display: 'flex', gap: 2 }}>
                                            <select value={val.textAlign} onChange={e => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, values: a.values.map((v, j) => j === vIdx ? { ...v, textAlign: e.target.value } : v) } : a) }} : sec))} style={{ padding: 2, border: '1px solid #d1d5db', borderRadius: 3, fontSize: 9 }}>
                                              <option value="left">⬅️</option><option value="center">⬌</option><option value="right">➡️</option>
                                            </select>
                                            <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, values: a.values.map((v, j) => j === vIdx ? { ...v, fontWeight: v.fontWeight === 'bold' ? 'normal' : 'bold' } : v) } : a) }} : sec))} style={{ padding: '2px 5px', border: '1px solid #d1d5db', borderRadius: 3, backgroundColor: val.fontWeight === 'bold' ? '#3b82f6' : 'white', color: val.fontWeight === 'bold' ? 'white' : 'black', cursor: 'pointer', fontSize: 9, fontWeight: 'bold' }}>B</button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: [...sec.comparisonTable.attributes, { id: Date.now(), name: 'Atrybut', values: Array(sec.comparisonTable.products.length).fill(null).map(() => ({ text: '', textAlign: 'left', fontWeight: 'normal' })) }] }} : sec))} style={btn('#3b82f6', true)}>+ Dodaj atrybut</button>
                          </div>
                        )}

                        {/* ── PORÓWNANIE WARIANTÓW (upsell/downsell) ─────────────────────── */}
                        {s.type === 'comparison-cards' && s.cards && (
                          <div>
                            <div style={{ marginBottom: 12 }}>
                              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Nagłówek sekcji:</label>
                              <input
                                type="text"
                                value={s.heading || ''}
                                onChange={e => updateSection(s.id, 'heading', e.target.value)}
                                placeholder="np. Jaką wersję wybrać?"
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', fontWeight: 600 }}
                              />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Wstęp (opcjonalnie):</label>
                              <textarea
                                value={s.intro || ''}
                                onChange={e => updateSection(s.id, 'intro', e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, minHeight: 50, boxSizing: 'border-box' }}
                              />
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                              {s.cards.map((card, cardIndex) => (
                                <div key={card.id} style={{ flex: 1, minWidth: 260, border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, backgroundColor: 'white' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Wariant {cardIndex + 1}</span>
                                    <button onClick={() => removeComparisonCard(s.id, cardIndex)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>🗑️</button>
                                  </div>

                                  <select
                                    value={card.badge}
                                    onChange={e => updateComparisonCard(s.id, cardIndex, 'badge', e.target.value)}
                                    style={{ width: '100%', padding: 6, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 8, fontSize: 12 }}
                                  >
                                    <option value="none">Brak etykiety</option>
                                    <option value="current">Aktualnie oglądasz</option>
                                    <option value="recommended">Polecany wariant</option>
                                  </select>

                                  <input
                                    type="text" value={card.title}
                                    onChange={e => updateComparisonCard(s.id, cardIndex, 'title', e.target.value)}
                                    placeholder="Tytuł (np. Siatka PP 4)"
                                    style={{ width: '100%', padding: 6, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 8, fontSize: 12, boxSizing: 'border-box' }}
                                  />
                                  <input
                                    type="text" value={card.subtitle}
                                    onChange={e => updateComparisonCard(s.id, cardIndex, 'subtitle', e.target.value)}
                                    placeholder="Podtytuł (np. Linka 4 mm)"
                                    style={{ width: '100%', padding: 6, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 8, fontSize: 12, boxSizing: 'border-box' }}
                                  />
                                  <textarea
                                    value={card.description}
                                    onChange={e => updateComparisonCard(s.id, cardIndex, 'description', e.target.value)}
                                    placeholder="Krótki opis"
                                    style={{ width: '100%', padding: 6, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 8, fontSize: 12, minHeight: 50, resize: 'vertical', boxSizing: 'border-box' }}
                                  />

                                  {card.bullets.map((bullet, bulletIndex) => (
                                    <div key={bulletIndex} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                      <input
                                        type="text" value={bullet}
                                        onChange={e => updateComparisonBullet(s.id, cardIndex, bulletIndex, e.target.value)}
                                        placeholder="Punkt listy"
                                        style={{ flex: 1, padding: 6, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12 }}
                                      />
                                      <button onClick={() => removeComparisonBullet(s.id, cardIndex, bulletIndex)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>×</button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => addComparisonBullet(s.id, cardIndex)}
                                    style={{ fontSize: 11, padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 8 }}
                                  >
                                    + Dodaj punkt
                                  </button>

                                  <input
                                    type="text" value={card.linkUrl}
                                    onChange={e => updateComparisonCard(s.id, cardIndex, 'linkUrl', e.target.value)}
                                    placeholder="Link URL (opcjonalnie)"
                                    style={{ width: '100%', padding: 6, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 8, fontSize: 12, boxSizing: 'border-box' }}
                                  />
                                  <input
                                    type="text" value={card.linkText}
                                    onChange={e => updateComparisonCard(s.id, cardIndex, 'linkText', e.target.value)}
                                    placeholder="Tekst linku (np. Zobacz siatkę PP 4)"
                                    style={{ width: '100%', padding: 6, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, boxSizing: 'border-box' }}
                                  />
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => addComparisonCard(s.id)}
                              style={{ ...btn('#10b981', true), marginTop: 12 }}
                            >
                              + Dodaj wariant
                            </button>

                            <div style={{ marginTop: 16 }}>
                              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Podsumowanie na dole (opcjonalnie):</label>
                              <textarea
                                value={s.summary || ''}
                                onChange={e => updateSection(s.id, 'summary', e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, minHeight: 50, boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

                {/* EKSPORT */}
                <div style={{ marginTop: 24, borderTop: '2px solid #e5e7eb', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Eksport HTML</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setShowPreview(p => !p)} style={btn('#6b7280', true)}>{showPreview ? '👁️ Ukryj podgląd' : '👁️ Pokaż podgląd'}</button>
                      <button onClick={copyHTML} style={btn('#f87171', false)}>📋 Kopiuj HTML</button>
                      <button onClick={downloadHTML} style={btn('#f87171', false)}>⬇️ Pobierz .html</button>
                    </div>
                  </div>
                  {showPreview && (
                    <div>
                      <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, backgroundColor: 'white', marginBottom: 12, maxHeight: 600, overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: generateHTML(true) }} />
                      <textarea readOnly value={generateHTML()} style={{ width: '100%', height: 140, padding: 8, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 11, fontFamily: 'monospace', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
