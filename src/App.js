import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

const TextEditor = memo(({ sectionId, value, onChange, placeholder = "Wprowadź tekst..." }) => {
  const textareaRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  const insertTag = useCallback((openTag, closeTag = null) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText;
    if (closeTag) {
      newText = textarea.value.substring(0, start) + openTag + selectedText + closeTag + textarea.value.substring(end);
    } else {
      newText = textarea.value.substring(0, start) + openTag + textarea.value.substring(end);
    }
    onChange(newText);
    setTimeout(() => {
      if (closeTag && selectedText) {
        textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + openTag.length, start + openTag.length);
      }
      textarea.focus();
    }, 0);
  }, [onChange]);

  const insertList = useCallback((listType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const lines = selectedText.split('\n').filter(line => line.trim());
    let listHtml = '';
    if (listType === 'ul') {
      listHtml = '<ul>\n' + lines.map(line => `  <li>${line.trim()}</li>`).join('\n') + '\n</ul>';
    } else {
      listHtml = '<ol>\n' + lines.map(line => `  <li>${line.trim()}</li>`).join('\n') + '\n</ol>';
    }
    if (lines.length === 0) {
      listHtml = listType === 'ul' ? '<ul>\n  <li>Element listy</li>\n</ul>' : '<ol>\n  <li>Element listy</li>\n</ol>';
    }
    const newText = textarea.value.substring(0, start) + listHtml + textarea.value.substring(end);
    onChange(newText);
    setTimeout(() => textarea.focus(), 0);
  }, [onChange]);

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <button type="button" onClick={() => insertTag('<strong>', '</strong>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>B</button>
        <button type="button" onClick={() => insertTag('<em>', '</em>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px', fontStyle: 'italic' }}>I</button>
        <button type="button" onClick={() => insertTag('<u>', '</u>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>U</button>
        <button type="button" onClick={() => insertTag('<h1>', '</h1>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>H1</button>
        <button type="button" onClick={() => insertTag('<h2>', '</h2>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>H2</button>
        <button type="button" onClick={() => insertTag('<h3>', '</h3>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>H3</button>
        <button type="button" onClick={() => insertTag('<p>', '</p>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px' }}>P</button>
        <button type="button" onClick={() => insertList('ul')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px' }}>• Lista</button>
        <button type="button" onClick={() => insertList('ol')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px' }}>1. Lista</button>
        <button type="button" onClick={() => insertTag('<br>')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '12px' }}>↵</button>
        <button type="button" onClick={() => setShowPreview(!showPreview)} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: showPreview ? '#3b82f6' : 'white', color: showPreview ? 'white' : 'black', cursor: 'pointer', fontSize: '12px' }}>👁️</button>
      </div>
      <textarea ref={textareaRef} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', minHeight: '120px', padding: '12px', border: 'none', outline: 'none', lineHeight: '1.4', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', display: showPreview ? 'none' : 'block' }} />
      {showPreview && <div style={{ minHeight: '120px', padding: '12px', lineHeight: '1.4', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', border: '1px solid #e5e7eb', margin: '8px', borderRadius: '4px', backgroundColor: '#f9fafb' }} dangerouslySetInnerHTML={{ __html: value || `<span style="color: #9ca3af; font-style: italic;">${placeholder}</span>` }} />}
    </div>
  );
});

TextEditor.displayName = 'TextEditor';

export default function AllegroDescriptionEditor() {
  const [sections, setSections] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [productBrand, setProductBrand] = useState('');
  const [productCode, setProductCode] = useState('');
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRefs = useRef({});

  useEffect(() => {
    const saved = window.sessionStorage?.getItem('sportpoland-templates');
    if (saved) {
      try { setTemplates(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('sportpoland-templates', JSON.stringify(templates));
    }
  }, [templates]);

  const sectionTypes = [
    { id: 'text-only', name: 'Sam opis', icon: '📝' },
    { id: 'image-left', name: 'Zdjęcie po lewej, tekst po prawej', icon: '🖼️' },
    { id: 'image-right', name: 'Zdjęcie po prawej, tekst po lewej', icon: '🖼️' },
    { id: 'image-only', name: 'Samo zdjęcie', icon: '📸' },
    { id: 'two-images', name: 'Dwa zdjęcia obok siebie', icon: '🖼️' },
    { id: 'icons-grid', name: 'Siatka ikon z opisami', icon: '⊞' },
    { id: 'features-grid', name: 'Funkcje produktu 2x2', icon: '🔲' },
    { id: 'comparison-table', name: 'Tabela porównawcza', icon: '📊' },
    { id: 'youtube-video', name: 'Video YouTube', icon: '▶️' }
  ];

  const generateAltText = useCallback((imageName, context = '') => {
    if (!imageName) return '';
    let altText = imageName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ');
    if (context) altText = `${context} - ${altText}`;
    if (productBrand && productCode) altText = `${productBrand} ${productCode} ${altText}`;
    return altText;
  }, [productBrand, productCode]);

  const generateImagePath = useCallback((imageName) => {
    if (!imageName || !productBrand || !productCode) return imageName;
    return `/data/include/cms/sportpoland_com/pliki-opisy/${productBrand}/${productCode}/${imageName}`;
  }, [productBrand, productCode]);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({ sections: JSON.parse(JSON.stringify(sections)), productBrand, productCode });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }, [history, currentStep, sections, productBrand, productCode]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      const prev = history[currentStep - 1];
      setSections(prev.sections);
      setProductBrand(prev.productBrand);
      setProductCode(prev.productCode);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, history]);

  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) return alert('Podaj nazwę!');
    setTemplates(prev => [...prev, { id: Date.now(), name: templateName, sections: JSON.parse(JSON.stringify(sections)), productBrand, productCode, createdAt: new Date().toLocaleString() }]);
    setTemplateName('');
    alert('Zapisano!');
  }, [templateName, sections, productBrand, productCode]);

  const loadTemplate = useCallback((t) => {
    saveToHistory();
    setSections(t.sections);
    setProductBrand(t.productBrand);
    setProductCode(t.productCode);
    alert(`Wczytano "${t.name}"!`);
  }, [saveToHistory]);

  const deleteTemplate = useCallback((id) => {
    if (window.confirm('Usunąć?')) setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  const exportTemplates = useCallback(() => {
    const blob = new Blob([JSON.stringify(templates, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `templates-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [templates]);

  const importTemplates = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        setTemplates(prev => [...prev, ...imported.map(t => ({ ...t, id: Date.now() + Math.random(), createdAt: `${t.createdAt} (import)` }))]);
        alert(`Zaimportowano ${imported.length}!`);
      } catch (err) { alert('Błąd!'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const addSection = useCallback((type) => {
    saveToHistory();
    setSections(prev => [...prev, {
      id: Date.now(), type, text: '', image1: '', image2: '', imagePreview1: '', imagePreview2: '',
      icons: type === 'icons-grid' ? [{ id: 1, icon: '✓', title: 'Tytuł', description: 'Opis', image: '', imagePreview: '' }] : undefined,
      features: type === 'features-grid' ? [{ id: 1, icon: '🔇', title: 'Funkcja 1', description: 'Opis 1' }] : undefined,
      comparisonTable: type === 'comparison-table' ? { products: [{ id: 1, name: 'Produkt 1', image: '', imagePreview: '', backgroundColor: '#fff' }], attributes: [{ id: 1, name: 'Cena', values: [{ text: '', textAlign: 'left', fontWeight: 'normal' }] }] } : undefined,
      youtubeVideo: type === 'youtube-video' ? { url: '', autoplay: false, startTime: 0 } : undefined,
      backgroundColor: '#ffffff'
    }]);
  }, [saveToHistory]);

  const deleteSection = useCallback((id) => { saveToHistory(); setSections(prev => prev.filter(s => s.id !== id)); }, [saveToHistory]);
  
  const moveSection = useCallback((id, dir) => {
    const idx = sections.findIndex(s => s.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === sections.length - 1)) return;
    saveToHistory();
    const newSec = [...sections];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    [newSec[idx], newSec[target]] = [newSec[target], newSec[idx]];
    setSections(newSec);
  }, [sections, saveToHistory]);

  const copySection = useCallback((id) => {
    saveToHistory();
    const s = sections.find(sec => sec.id === id);
    if (s) setSections(prev => [...prev, { ...s, id: Date.now(), imagePreview1: '', imagePreview2: '' }]);
  }, [sections, saveToHistory]);

  const updateSection = useCallback((id, field, value) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const handleImageUpload = useCallback((sectionId, imageField, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, [imageField]: file.name, [imageField === 'image1' ? 'imagePreview1' : 'imagePreview2']: url } : s));
  }, []);

  const generateHTML = useCallback((preview = false) => {
    let html = `<style>.sp-container{background-color:var(--bg-color);margin-bottom:20px;padding:15px;border-radius:15px}.sp-flex{display:flex;flex-direction:column;gap:15px}.sp-text{line-height:1.4}.sp-image{width:100%;height:auto;border-radius:10px;max-width:250px}.sp-image-container{text-align:center}.sp-image-only{width:100%;max-height:400px;border-radius:10px;object-fit:contain}.sp-icons-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:15px}.sp-icon-item{width:180px;text-align:center}.sp-icon-emoji{font-size:40px}.sp-icon-image{width:50px;height:50px;border-radius:8px}.sp-features-grid{display:grid;gap:20px}.sp-feature-item{display:flex;gap:20px;padding:20px}.sp-feature-icon{font-size:50px;width:80px;height:80px;display:flex;align-items:center;justify-content:center}.sp-feature-image{width:80px;height:80px;border-radius:10px}.sp-comparison-table{overflow-x:auto}.sp-comparison-table table{width:100%;border-collapse:collapse}.sp-comparison-table th,.sp-comparison-table td{padding:12px;border:1px solid #e5e7eb}.sp-product-image{width:100px;height:100px;border-radius:8px}.sp-youtube-container{position:relative;padding-bottom:56.25%;height:0}.sp-youtube-container iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}@media(min-width:768px){.sp-flex{flex-direction:row}.sp-flex.reverse{flex-direction:row-reverse}.sp-features-grid{grid-template-columns:1fr 1fr}}</style>`;
    
    sections.forEach(s => {
      const css = `--bg-color:${s.backgroundColor};`;
      if (s.type === 'text-only') {
        html += `<div class="sp-container" style="${css}"><div class="sp-text">${s.text||''}</div></div>\n`;
      } else if (s.type === 'image-left' || s.type === 'image-right') {
        const src = preview ? s.imagePreview1 : generateImagePath(s.image1);
        const cls = s.type === 'image-right' ? 'sp-flex reverse' : 'sp-flex';
        html += `<div class="sp-container" style="${css}"><div class="${cls}"><div class="sp-image-container">${s.image1||s.imagePreview1?`<img src="${src}" class="sp-image" alt="${generateAltText(s.image1)}">`:''}</div><div><div class="sp-text">${s.text||''}</div></div></div></div>\n`;
      } else if (s.type === 'image-only') {
        const src = preview ? s.imagePreview1 : generateImagePath(s.image1);
        html += `<div class="sp-container" style="${css}">${s.image1||s.imagePreview1?`<img src="${src}" class="sp-image-only" alt="${generateAltText(s.image1)}">`:''}</div>\n`;
      } else if (s.type === 'two-images') {
        const src1 = preview ? s.imagePreview1 : generateImagePath(s.image1);
        const src2 = preview ? s.imagePreview2 : generateImagePath(s.image2);
        html += `<div class="sp-container" style="${css}"><div class="sp-flex"><div>${s.image1||s.imagePreview1?`<img src="${src1}" class="sp-image" alt="${generateAltText(s.image1)}">`:''}</div><div>${s.image2||s.imagePreview2?`<img src="${src2}" class="sp-image" alt="${generateAltText(s.image2)}">`:''}</div></div></div>\n`;
      } else if (s.type === 'icons-grid' && s.icons) {
        const icons = s.icons.map(i => {
          const src = preview ? i.imagePreview : generateImagePath(i.image);
          return `<div class="sp-icon-item">${i.image||i.imagePreview?`<img src="${src}" class="sp-icon-image" alt="${i.title}">`:` <div class="sp-icon-emoji">${i.icon}</div>`}<h4>${i.title}</h4><p>${i.description}</p></div>`;
        }).join('');
        html += `<div class="sp-container" style="${css}"><div class="sp-icons-grid">${icons}</div></div>\n`;
      } else if (s.type === 'features-grid' && s.features) {
        const feats = s.features.map(f => {
          const src = preview ? f.imagePreview : generateImagePath(f.image);
          return `<div class="sp-feature-item">${f.image||f.imagePreview?`<img src="${src}" class="sp-feature-image" alt="${f.title}">`:` <div class="sp-feature-icon">${f.icon}</div>`}<div><h4>${f.title}</h4><p>${f.description}</p></div></div>`;
        }).join('');
        html += `<div class="sp-container" style="${css}"><div class="sp-features-grid">${feats}</div></div>\n`;
      } else if (s.type === 'comparison-table' && s.comparisonTable) {
        const t = s.comparisonTable;
        let table = `<table><thead><tr><th></th>${t.products.map(p => {
          const src = preview ? p.imagePreview : generateImagePath(p.image);
          return `<th style="background-color:${p.backgroundColor}">${p.image||p.imagePreview?`<img src="${src}" class="sp-product-image" alt="${p.name}">`:''}<div>${p.name}</div></th>`;
        }).join('')}</tr></thead><tbody>${t.attributes.map(a => `<tr><td>${a.name}</td>${a.values.map((v,i) => `<td style="text-align:${v.textAlign};font-weight:${v.fontWeight};background-color:${t.products[i].backgroundColor}">${v.text}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
        html += `<div class="sp-container" style="${css}"><div class="sp-comparison-table">${table}</div></div>\n`;
      } else if (s.type === 'youtube-video' && s.youtubeVideo?.url) {
        let vid = '';
        try {
          const url = new URL(s.youtubeVideo.url);
          vid = url.hostname.includes('youtube.com') ? url.searchParams.get('v') : url.pathname.slice(1);
        } catch (e) {}
        if (vid) {
          const params = [];
          if (s.youtubeVideo.autoplay) params.push('autoplay=1');
          if (s.youtubeVideo.startTime > 0) params.push(`start=${s.youtubeVideo.startTime}`);
          html += `<div class="sp-container" style="${css}"><div class="sp-youtube-container"><iframe src="https://www.youtube.com/embed/${vid}${params.length?'?'+params.join('&'):''}" allowfullscreen></iframe></div></div>\n`;
        }
      }
    });
    return html;
  }, [sections, generateAltText, generateImagePath]);

  const copyHTML = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateHTML());
      alert('Skopiowano!');
    } catch (e) { alert('Błąd!'); }
  }, [generateHTML]);

  const downloadHTML = useCallback(() => {
    const blob = new Blob([generateHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opis.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [generateHTML]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Edytor SportPoland</h1>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowTemplates(!showTemplates)} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>📁</button>
                {currentStep > 0 && <button onClick={goBack} style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>⬅️</button>}
              </div>
            </div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Edytor opisów produktów</p>
          </div>

          {showTemplates && (
            <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px', backgroundColor: '#f9fafb' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Szablony</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Nazwa..." style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                  <button onClick={saveTemplate} style={{ padding: '8px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>💾</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input type="file" accept=".json" onChange={importTemplates} style={{ display: 'none' }} id="import" />
                <button onClick={() => document.getElementById('import').click()} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>📥 Import</button>
                <button onClick={exportTemplates} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>📤 Eksport</button>
              </div>
              {templates.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '4px' }}>
                  <div style={{ fontSize: '14px' }}>{t.name}</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => loadTemplate(t)} style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>📂</button>
                    <button onClick={() => deleteTemplate(t.id)} style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Produkt</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} placeholder="Marka" style={{ flex: 1, minWidth: '150px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
              <input type="text" value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Kod" style={{ flex: 1, minWidth: '150px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Dodaj sekcję</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {sectionTypes.map(t => (
                <button key={t.id} onClick={() => addSection(t.id)} style={{ padding: '8px 12px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>{t.icon} {t.name}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            {sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                <div style={{ fontSize: '64px' }}>📝</div>
                <p>Dodaj sekcję</p>
              </div>
            ) : (
              <>
                {sections.map((s, i) => (
                  <div key={s.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', borderRadius: '12px 12px 0 0' }}>
                      <span style={{ fontSize: '14px' }}>{sectionTypes.find(t => t.id === s.type)?.name}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => moveSection(s.id, 'up')} disabled={i === 0} style={{ padding: '2px 6px', backgroundColor: 'transparent', border: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.3 : 1 }}>⬆️</button>
                        <button onClick={() => moveSection(s.id, 'down')} disabled={i === sections.length - 1} style={{ padding: '2px 6px', backgroundColor: 'transparent', border: 'none', cursor: i === sections.length - 1 ? 'not-allowed' : 'pointer', opacity: i === sections.length - 1 ? 0.3 : 1 }}>⬇️</button>
                        <button onClick={() => copySection(s.id)} style={{ padding: '2px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>📋</button>
                        <button onClick={() => deleteSection(s.id)} style={{ padding: '2px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                      </div>
                    </div>
                    <div style={{ padding: '8px 12px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <label style={{ fontSize: '12px' }}>Kolor:</label>
                      <input type="color" value={s.backgroundColor} onChange={(e) => updateSection(s.id, 'backgroundColor', e.target.value)} style={{ width: '32px', height: '24px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }} />
                    </div>
                    <div style={{ backgroundColor: s.backgroundColor, padding: '12px', borderRadius: '0 0 12px 12px' }}>
                      {s.type === 'text-only' && <TextEditor sectionId={s.id} value={s.text} onChange={(v) => updateSection(s.id, 'text', v)} />}
                      {(s.type === 'image-left' || s.type === 'image-right') && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              {s.imagePreview1 ? <img src={s.imagePreview1} alt="" style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '8px', marginBottom: '8px' }} /> : <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>}
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(s.id, 'image1', e)} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-1`] = el; }} />
                              <button onClick={() => fileInputRefs.current[`${s.id}-1`]?.click()} style={{ padding: '6px 12px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Wybierz</button>
                            </div>
                          </div>
                          <div style={{ flex: 1, minWidth: '200px' }}><TextEditor sectionId={s.id} value={s.text} onChange={(v) => updateSection(s.id, 'text', v)} /></div>
                        </div>
                      )}
                      {s.type === 'image-only' && (
                        <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '150px' }}>
                          {s.imagePreview1 ? <img src={s.imagePreview1} alt="" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px' }} /> : <div style={{ fontSize: '48px' }}>📸</div>}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(s.id, 'image1', e)} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-1`] = el; }} />
                          <button onClick={() => fileInputRefs.current[`${s.id}-1`]?.click()} style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Wybierz</button>
                        </div>
                      )}
                      {s.type === 'two-images' && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {[1, 2].map(n => (
                            <div key={n} style={{ flex: 1, minWidth: '150px' }}>
                              <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '12px', textAlign: 'center', minHeight: '100px' }}>
                                {s[`imagePreview${n}`] ? <img src={s[`imagePreview${n}`]} alt="" style={{ maxWidth: '100%', maxHeight: '80px', borderRadius: '8px' }} /> : <div style={{ fontSize: '32px' }}>🖼️</div>}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(s.id, `image${n}`, e)} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-${n}`] = el; }} />
                                <button onClick={() => fileInputRefs.current[`${s.id}-${n}`]?.click()} style={{ marginTop: '6px', padding: '4px 8px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Wybierz</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {s.type === 'icons-grid' && s.icons && (
                        <div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
                            {s.icons.map((icon, idx) => (
                              <div key={icon.id} style={{ width: '160px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', position: 'relative' }}>
                                <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.filter((_, i) => i !== idx) } : sec))} style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                  {icon.imagePreview ? <img src={icon.imagePreview} alt="" style={{ width: '50px', height: '50px', borderRadius: '6px' }} /> : <input type="text" value={icon.icon} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, icon: e.target.value } : ic) } : sec))} placeholder="📌" style={{ fontSize: '32px', textAlign: 'center', width: '100%', border: 'none', background: 'transparent' }} />}
                                </div>
                                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, image: f.name, imagePreview: url } : ic) } : sec)); }}} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-icon-${idx}`] = el; }} />
                                <button onClick={() => fileInputRefs.current[`${s.id}-icon-${idx}`]?.click()} style={{ width: '100%', padding: '4px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', marginBottom: '6px' }}>📸</button>
                                <input type="text" value={icon.title} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, title: e.target.value } : ic) } : sec))} placeholder="Tytuł" style={{ width: '100%', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', marginBottom: '4px', boxSizing: 'border-box' }} />
                                <textarea value={icon.description} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: sec.icons.map((ic, i) => i === idx ? { ...ic, description: e.target.value } : ic) } : sec))} placeholder="Opis" style={{ width: '100%', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '11px', minHeight: '40px', resize: 'vertical', boxSizing: 'border-box' }} />
                              </div>
                            ))}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, icons: [...sec.icons, { id: Date.now(), icon: '📌', title: 'Tytuł', description: 'Opis', image: '', imagePreview: '' }] } : sec))} style={{ padding: '8px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>+ Dodaj ikonę</button>
                          </div>
                        </div>
                      )}
                      {s.type === 'features-grid' && s.features && (
                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                            {s.features.map((feat, idx) => (
                              <div key={feat.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', position: 'relative' }}>
                                <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.filter((_, i) => i !== idx) } : sec))} style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                                <div style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                                  {feat.imagePreview ? <img src={feat.imagePreview} alt="" style={{ width: '50px', height: '50px', borderRadius: '6px' }} /> : <input type="text" value={feat.icon} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((f, i) => i === idx ? { ...f, icon: e.target.value } : f) } : sec))} placeholder="🔇" style={{ fontSize: '24px', textAlign: 'center', width: '50px', border: 'none', background: 'transparent' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <input type="text" value={feat.title} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((f, i) => i === idx ? { ...f, title: e.target.value } : f) } : sec))} placeholder="Tytuł" style={{ width: '100%', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', boxSizing: 'border-box' }} />
                                  <textarea value={feat.description} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((f, i) => i === idx ? { ...f, description: e.target.value } : f) } : sec))} placeholder="Opis" style={{ width: '100%', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', minHeight: '40px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '4px' }} />
                                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: sec.features.map((ft, i) => i === idx ? { ...ft, image: f.name, imagePreview: url } : ft) } : sec)); }}} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-feat-${idx}`] = el; }} />
                                  <button onClick={() => fileInputRefs.current[`${s.id}-feat-${idx}`]?.click()} style={{ padding: '3px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>📸</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, features: [...sec.features, { id: Date.now(), icon: '📌', title: 'Funkcja', description: 'Opis', image: '', imagePreview: '' }] } : sec))} style={{ padding: '8px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>+ Dodaj funkcję</button>
                          </div>
                        </div>
                      )}
                      {s.type === 'comparison-table' && s.comparisonTable && (
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Produkty:</h4>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            {s.comparisonTable.products.map((prod, pIdx) => (
                              <div key={prod.id} style={{ width: '140px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: 'white', position: 'relative' }}>
                                {s.comparisonTable.products.length > 1 && <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.filter((_, i) => i !== pIdx), attributes: sec.comparisonTable.attributes.map(a => ({ ...a, values: a.values.filter((_, i) => i !== pIdx) })) }} : sec))} style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '11px' }}>×</button>}
                                <div style={{ width: '80px', height: '80px', margin: '0 auto 6px', border: '2px dashed #d1d5db', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {prod.imagePreview ? <img src={prod.imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} /> : <div style={{ fontSize: '32px', color: '#d1d5db' }}>📸</div>}
                                </div>
                                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, image: f.name, imagePreview: url } : p) }} : sec)); }}} style={{ display: 'none' }} ref={el => { if (el) fileInputRefs.current[`${s.id}-prod-${pIdx}`] = el; }} />
                                <button onClick={() => fileInputRefs.current[`${s.id}-prod-${pIdx}`]?.click()} style={{ width: '100%', padding: '3px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', marginBottom: '4px' }}>📸</button>
                                <input type="text" value={prod.name} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, name: e.target.value } : p) }} : sec))} placeholder="Nazwa" style={{ width: '100%', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '11px', textAlign: 'center', marginBottom: '4px', boxSizing: 'border-box' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                  <label style={{ fontSize: '10px' }}>Kolor:</label>
                                  <input type="color" value={prod.backgroundColor} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: sec.comparisonTable.products.map((p, i) => i === pIdx ? { ...p, backgroundColor: e.target.value } : p) }} : sec))} style={{ width: '24px', height: '20px', border: '1px solid #d1d5db', borderRadius: '3px', cursor: 'pointer' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, products: [...sec.comparisonTable.products, { id: Date.now(), name: `Produkt ${sec.comparisonTable.products.length + 1}`, image: '', imagePreview: '', backgroundColor: '#fff' }], attributes: sec.comparisonTable.attributes.map(a => ({ ...a, values: [...a.values, { text: '', textAlign: 'left', fontWeight: 'normal' }] })) }} : sec))} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', marginBottom: '12px' }}>+ Produkt</button>
                          
                          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Atrybuty:</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                            {s.comparisonTable.attributes.map((attr, aIdx) => (
                              <div key={attr.id} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px', backgroundColor: 'white', position: 'relative' }}>
                                <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.filter((_, i) => i !== aIdx) }} : sec))} style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '11px' }}>×</button>
                                <input type="text" value={attr.name} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, name: e.target.value } : a) }} : sec))} placeholder="Nazwa atrybutu" style={{ width: '100%', maxWidth: '200px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', fontWeight: '600', marginBottom: '6px', boxSizing: 'border-box' }} />
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  {attr.values.map((val, vIdx) => (
                                    <div key={vIdx} style={{ flex: 1, minWidth: '140px', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px', backgroundColor: '#f9fafb' }}>
                                      <label style={{ fontSize: '9px', fontWeight: '600', display: 'block', marginBottom: '2px' }}>{s.comparisonTable.products[vIdx]?.name || `P${vIdx + 1}`}</label>
                                      <textarea value={val.text} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, values: a.values.map((v, j) => j === vIdx ? { ...v, text: e.target.value } : v) } : a) }} : sec))} placeholder="Wartość" style={{ width: '100%', padding: '3px', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '11px', minHeight: '35px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '3px' }} />
                                      <div style={{ display: 'flex', gap: '2px' }}>
                                        <select value={val.textAlign} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, values: a.values.map((v, j) => j === vIdx ? { ...v, textAlign: e.target.value } : v) } : a) }} : sec))} style={{ padding: '2px', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '9px' }}>
                                          <option value="left">⬅️</option>
                                          <option value="center">⬌</option>
                                          <option value="right">➡️</option>
                                        </select>
                                        <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: sec.comparisonTable.attributes.map((a, i) => i === aIdx ? { ...a, values: a.values.map((v, j) => j === vIdx ? { ...v, fontWeight: v.fontWeight === 'bold' ? 'normal' : 'bold' } : v) } : a) }} : sec))} style={{ padding: '2px 5px', border: '1px solid #d1d5db', borderRadius: '3px', backgroundColor: val.fontWeight === 'bold' ? '#3b82f6' : 'white', color: val.fontWeight === 'bold' ? 'white' : 'black', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}>B</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, comparisonTable: { ...sec.comparisonTable, attributes: [...sec.comparisonTable.attributes, { id: Date.now(), name: 'Atrybut', values: Array(sec.comparisonTable.products.length).fill(null).map(() => ({ text: '', textAlign: 'left', fontWeight: 'normal' })) }] }} : sec))} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>+ Atrybut</button>
                        </div>
                      )}
                      {s.type === 'youtube-video' && s.youtubeVideo && (
                        <div>
                          <input type="text" value={s.youtubeVideo.url} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, youtubeVideo: { ...sec.youtubeVideo, url: e.target.value }} : sec))} placeholder="URL YouTube" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box' }} />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            <input type="checkbox" checked={s.youtubeVideo.autoplay} onChange={(e) => setSections(prev => prev.map(sec => sec.id === s.id ? { ...sec, youtubeVideo: { ...sec.youtubeVideo, autoplay: e.target.checked }} : sec))} />
                            Autoplay
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Eksport</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setShowPreview(!showPreview)} style={{ padding: '8px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>{showPreview ? 'Ukryj' : 'Podgląd'}</button>
                      <button onClick={copyHTML} style={{ padding: '8px 12px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Kopiuj</button>
                      <button onClick={downloadHTML} style={{ padding: '8px 12px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Pobierz</button>
                    </div>
                  </div>
                  {showPreview && (
                    <div>
                      <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '12px', backgroundColor: 'white', marginBottom: '12px' }} dangerouslySetInnerHTML={{ __html: generateHTML(true) }} />
                      <textarea readOnly value={generateHTML()} style={{ width: '100%', height: '120px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
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
