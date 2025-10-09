import React, { useState, useRef, useCallback, memo } from 'react';

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

const AllegroDescriptionEditor = () => {
  const [sections, setSections] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [productBrand, setProductBrand] = useState('');
  const [productCode, setProductCode] = useState('');
  const fileInputRefs = useRef({});

  const sectionTypes = [
    { id: 'text-only', name: 'Sam opis', icon: '📝' },
    { id: 'image-left', name: 'Zdjęcie po lewej, tekst po prawej', icon: '🖼️' },
    { id: 'image-right', name: 'Zdjęcie po prawej, tekst po lewej', icon: '🖼️' },
    { id: 'image-only', name: 'Samo zdjęcie', icon: '📸' },
    { id: 'two-images', name: 'Dwa zdjęcia obok siebie', icon: '🖼️' },
    { id: 'icons-grid', name: 'Siatka ikon z opisami', icon: '⊞' },
    { id: 'features-grid', name: 'Funkcje produktu 2x2', icon: '🔲' },
    { id: 'comparison-table', name: 'Tabela porównawcza produktów', icon: '📊' },
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
    if (!imageName) return '';
    if (!productBrand || !productCode) return imageName;
    return `/data/include/cms/sportpoland_com/pliki-opisy/${productBrand}/${productCode}/${imageName}`;
  }, [productBrand, productCode]);

  const addSection = useCallback((type) => {
    const newSection = {
      id: Date.now(),
      type,
      text: '',
      image1: '',
      image2: '',
      imagePreview1: '',
      imagePreview2: '',
      icons: type === 'icons-grid' ? [
        { id: 1, icon: '✓', title: 'Tytuł 1', description: 'Opis funkcji 1', image: '', imagePreview: '' }
      ] : undefined,
      features: type === 'features-grid' ? [
        { id: 1, icon: '🔇', title: 'Cisza podczas treningu', description: 'cichy silnik pozwala ćwiczyć o dowolnej porze' },
        { id: 2, icon: '📦', title: 'Oszczędność miejsca', description: 'po złożeniu zajmuje niewiele miejsca' }
      ] : undefined,
      comparisonTable: type === 'comparison-table' ? {
        products: [
          { id: 1, name: 'Produkt 1', image: '', imagePreview: '', backgroundColor: '#ffffff' },
          { id: 2, name: 'Produkt 2', image: '', imagePreview: '', backgroundColor: '#ffffff' }
        ],
        attributes: [
          { id: 1, name: 'Cena', values: [
            { text: '', textAlign: 'left', fontWeight: 'normal' },
            { text: '', textAlign: 'left', fontWeight: 'normal' }
          ]},
          { id: 2, name: 'Waga', values: [
            { text: '', textAlign: 'left', fontWeight: 'normal' },
            { text: '', textAlign: 'left', fontWeight: 'normal' }
          ]}
        ]
      } : undefined,
      youtubeVideo: type === 'youtube-video' ? { url: '', autoplay: false, startTime: 0 } : undefined,
      backgroundColor: '#ffffff'
    };
    setSections(prev => [...prev, newSection]);
  }, []);

  const deleteSection = useCallback((id) => {
    setSections(prev => prev.filter(section => section.id !== id));
  }, []);

  const updateSection = useCallback((id, field, value) => {
    setSections(prev => prev.map(section => section.id === id ? { ...section, [field]: value } : section));
  }, []);

  const handleImageUpload = useCallback((sectionId, imageField, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageURL = e.target.result;
        setSections(prev => prev.map(section => {
          if (section.id === sectionId) {
            const previewField = imageField === 'image1' ? 'imagePreview1' : 'imagePreview2';
            return { ...section, [imageField]: file.name, [previewField]: imageURL };
          }
          return section;
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleProductImageUpload = useCallback((sectionId, productIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageURL = e.target.result;
        setSections(prev => prev.map(section => {
          if (section.id === sectionId && section.comparisonTable) {
            const updatedProducts = section.comparisonTable.products.map((product, index) => 
              index === productIndex ? { ...product, image: file.name, imagePreview: imageURL } : product
            );
            return { ...section, comparisonTable: { ...section.comparisonTable, products: updatedProducts }};
          }
          return section;
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleIconImageUpload = useCallback((sectionId, iconIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageURL = e.target.result;
        setSections(prev => prev.map(section => {
          if (section.id === sectionId && section.icons) {
            const updatedIcons = section.icons.map((icon, index) => 
              index === iconIndex ? { ...icon, image: file.name, imagePreview: imageURL } : icon
            );
            return { ...section, icons: updatedIcons };
          }
          return section;
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFeatureImageUpload = useCallback((sectionId, featureIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageURL = e.target.result;
        setSections(prev => prev.map(section => {
          if (section.id === sectionId && section.features) {
            const updatedFeatures = section.features.map((feature, index) => 
              index === featureIndex ? { ...feature, image: file.name, imagePreview: imageURL } : feature
            );
            return { ...section, features: updatedFeatures };
          }
          return section;
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const updateYoutubeSettings = useCallback((sectionId, field, value) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.youtubeVideo) {
        return { ...section, youtubeVideo: { ...section.youtubeVideo, [field]: value }};
      }
      return section;
    }));
  }, []);

  const addProductToTable = useCallback((sectionId) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const newProduct = { id: Date.now(), name: `Produkt ${section.comparisonTable.products.length + 1}`, image: '', imagePreview: '', backgroundColor: '#ffffff' };
        const updatedAttributes = section.comparisonTable.attributes.map(attr => ({ 
          ...attr, 
          values: [...attr.values, { text: '', textAlign: 'left', fontWeight: 'normal' }] 
        }));
        return { ...section, comparisonTable: { products: [...section.comparisonTable.products, newProduct], attributes: updatedAttributes }};
      }
      return section;
    }));
  }, []);

  const removeProductFromTable = useCallback((sectionId, productIndex) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const updatedProducts = section.comparisonTable.products.filter((_, index) => index !== productIndex);
        const updatedAttributes = section.comparisonTable.attributes.map(attr => ({ 
          ...attr, 
          values: attr.values.filter((_, index) => index !== productIndex) 
        }));
        return { ...section, comparisonTable: { products: updatedProducts, attributes: updatedAttributes }};
      }
      return section;
    }));
  }, []);

  const updateProductName = useCallback((sectionId, productIndex, name) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const updatedProducts = section.comparisonTable.products.map((product, index) => 
          index === productIndex ? { ...product, name } : product
        );
        return { ...section, comparisonTable: { ...section.comparisonTable, products: updatedProducts }};
      }
      return section;
    }));
  }, []);

  const updateProductColor = useCallback((sectionId, productIndex, color) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const updatedProducts = section.comparisonTable.products.map((product, index) => 
          index === productIndex ? { ...product, backgroundColor: color } : product
        );
        return { ...section, comparisonTable: { ...section.comparisonTable, products: updatedProducts }};
      }
      return section;
    }));
  }, []);

  const addAttributeToTable = useCallback((sectionId) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const newAttribute = { 
          id: Date.now(), 
          name: 'Nowy atrybut', 
          values: Array(section.comparisonTable.products.length).fill(null).map(() => ({ 
            text: '', 
            textAlign: 'left', 
            fontWeight: 'normal' 
          }))
        };
        return { ...section, comparisonTable: { ...section.comparisonTable, attributes: [...section.comparisonTable.attributes, newAttribute] }};
      }
      return section;
    }));
  }, []);

  const removeAttributeFromTable = useCallback((sectionId, attributeIndex) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const updatedAttributes = section.comparisonTable.attributes.filter((_, index) => index !== attributeIndex);
        return { ...section, comparisonTable: { ...section.comparisonTable, attributes: updatedAttributes }};
      }
      return section;
    }));
  }, []);

  const updateAttributeName = useCallback((sectionId, attributeIndex, name) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const updatedAttributes = section.comparisonTable.attributes.map((attr, index) => 
          index === attributeIndex ? { ...attr, name } : attr
        );
        return { ...section, comparisonTable: { ...section.comparisonTable, attributes: updatedAttributes }};
      }
      return section;
    }));
  }, []);

  const updateAttributeValue = useCallback((sectionId, attributeIndex, productIndex, field, value) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId && section.comparisonTable) {
        const updatedAttributes = section.comparisonTable.attributes.map((attr, attrIdx) => {
          if (attrIdx === attributeIndex) {
            const updatedValues = attr.values.map((val, valIdx) => 
              valIdx === productIndex ? { ...val, [field]: value } : val
            );
            return { ...attr, values: updatedValues };
          }
          return attr;
        });
        return { ...section, comparisonTable: { ...section.comparisonTable, attributes: updatedAttributes }};
      }
      return section;
    }));
  }, []);

  const generateHTML = useCallback((forPreview = false) => {
    let html = `<style>
.sp-container{background-color:var(--bg-color);margin-bottom:20px;padding:15px;border-radius:15px}
.sp-flex{display:flex;flex-direction:column;gap:15px;width:100%}
.sp-text{line-height:1.4}
.sp-image{width:100%;height:auto;border-radius:10px;max-width:250px}
.sp-image-container{text-align:center}
.sp-image-only{width:100%;height:auto;min-height:200px;max-height:400px;border-radius:10px;object-fit:contain}
.sp-image-only-container{display:flex;justify-content:center}
.sp-icons-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:15px;text-align:center}
.sp-icon-item{width:100%;max-width:180px;min-width:150px;text-align:center;margin:5px;padding:10px;box-sizing:border-box}
.sp-icon-image{width:50px;height:50px;object-fit:cover;border-radius:8px;margin:0 auto 10px;display:block}
.sp-icon-emoji{font-size:40px;margin-bottom:10px;display:block}
.sp-icon-title{margin:5px 0;font-weight:bold;font-size:14px}
.sp-icon-desc{margin:0;font-size:12px;color:#666;line-height:1.3}
.sp-features-grid{display:grid;grid-template-columns:1fr;gap:20px;text-align:left}
.sp-feature-item{display:flex;align-items:flex-start;gap:20px;padding:20px}
.sp-feature-icon{font-size:50px;flex-shrink:0;width:80px;height:80px;display:flex;align-items:center;justify-content:center;border-radius:10px}
.sp-feature-image{width:80px;height:80px;object-fit:cover;border-radius:10px;flex-shrink:0}
.sp-feature-content h4{margin:0 0 10px 0;font-size:18px;font-weight:bold}
.sp-feature-content p{margin:0;font-size:16px;line-height:1.5}
.sp-comparison-table{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
.sp-comparison-table table{width:100%;border-collapse:collapse;min-width:600px}
.sp-comparison-table th,.sp-comparison-table td{padding:12px;text-align:left;border:1px solid #e5e7eb;vertical-align:top}
.sp-comparison-table th{font-weight:bold}
.sp-comparison-table td:first-child{font-weight:600}
.sp-product-header{text-align:center}
.sp-product-image{width:100px;height:100px;object-fit:cover;border-radius:8px;margin:0 auto 8px;display:block}
.sp-youtube-container{position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden}
.sp-youtube-container iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:10px}
@media (min-width:768px){
.sp-container{padding:20px}
.sp-flex{flex-direction:row;align-items:center;gap:20px}
.sp-flex.reverse{flex-direction:row-reverse}
.sp-flex>div{flex:1}
.sp-image{max-width:400px}
.sp-image-only{max-height:500px}
.sp-icon-item{width:auto;min-width:180px;max-width:200px}
.sp-icon-image{width:60px;height:60px}
.sp-icon-emoji{font-size:48px}
.sp-icon-title{font-size:16px}
.sp-icon-desc{font-size:14px}
.sp-features-grid{grid-template-columns:1fr 1fr;gap:25px}
.sp-feature-item{padding:25px;gap:25px}
.sp-feature-icon{font-size:60px;width:100px;height:100px}
.sp-feature-image{width:100px;height:100px}
.sp-feature-content h4{font-size:20px;margin-bottom:12px}
.sp-feature-content p{font-size:17px}
.sp-product-image{width:120px;height:120px}
}
@media (min-width:1024px){
.sp-container{padding:25px}
.sp-flex{gap:25px}
.sp-icon-item{min-width:200px;max-width:220px}
.sp-features-grid{gap:30px}
.sp-feature-item{padding:30px;gap:30px}
.sp-feature-icon{font-size:70px;width:120px;height:120px}
.sp-feature-image{width:120px;height:120px}
.sp-feature-content h4{font-size:22px}
.sp-feature-content p{font-size:18px}
}
</style>`;
    
    sections.forEach(section => {
      const cssVars = `--bg-color: ${section.backgroundColor};`;
      
      if (section.type === 'text-only') {
        html += `<div class="sp-container" style="${cssVars}"><div class="sp-text">${section.text || ''}</div></div>\n`;
      } else if (section.type === 'image-left' || section.type === 'image-right') {
        const alt = generateAltText(section.image1, 'Zdjęcie produktu');
        const imgSrc = forPreview ? section.imagePreview1 : generateImagePath(section.image1);
        const flexClass = section.type === 'image-right' ? 'sp-flex reverse' : 'sp-flex';
        html += `<div class="sp-container" style="${cssVars}"><div class="${flexClass}"><div class="sp-image-container">${section.image1 || section.imagePreview1 ? `<img src="${imgSrc}" class="sp-image" alt="${alt}">` : ''}</div><div><div class="sp-text">${section.text || ''}</div></div></div></div>\n`;
      } else if (section.type === 'image-only') {
        const alt = generateAltText(section.image1, 'Zdjęcie produktu');
        const imgSrc = forPreview ? section.imagePreview1 : generateImagePath(section.image1);
        html += `<div class="sp-container" style="${cssVars}"><div class="sp-image-only-container">${section.image1 || section.imagePreview1 ? `<img src="${imgSrc}" class="sp-image-only" alt="${alt}">` : ''}</div></div>\n`;
      } else if (section.type === 'two-images') {
        const alt1 = generateAltText(section.image1, 'Zdjęcie produktu 1');
        const alt2 = generateAltText(section.image2, 'Zdjęcie produktu 2');
        const imgSrc1 = forPreview ? section.imagePreview1 : generateImagePath(section.image1);
        const imgSrc2 = forPreview ? section.imagePreview2 : generateImagePath(section.image2);
        html += `<div class="sp-container" style="${cssVars}"><div class="sp-flex"><div style="text-align:center">${section.image1 || section.imagePreview1 ? `<img src="${imgSrc1}" class="sp-image" alt="${alt1}">` : ''}</div><div style="text-align:center">${section.image2 || section.imagePreview2 ? `<img src="${imgSrc2}" class="sp-image" alt="${alt2}">` : ''}</div></div></div>\n`;
      } else if (section.type === 'icons-grid' && section.icons) {
        const iconsHtml = section.icons.map(icon => {
          const iconAlt = generateAltText(icon.image, icon.title);
          const iconSrc = forPreview ? icon.imagePreview : generateImagePath(icon.image);
          return `<div class="sp-icon-item">${icon.image || icon.imagePreview ? `<img src="${iconSrc}" class="sp-icon-image" alt="${iconAlt}">` : `<div class="sp-icon-emoji">${icon.icon}</div>`}<h4 class="sp-icon-title">${icon.title}</h4><p class="sp-icon-desc">${icon.description}</p></div>`;
        }).join('');
        html += `<div class="sp-container" style="${cssVars}"><div class="sp-icons-grid">${iconsHtml}</div></div>\n`;
      } else if (section.type === 'features-grid' && section.features) {
        const featuresHtml = section.features.map(feature => {
          const featureAlt = generateAltText(feature.image, feature.title);
          const featureSrc = forPreview ? feature.imagePreview : generateImagePath(feature.image);
          return `<div class="sp-feature-item">${feature.image || feature.imagePreview ? `<img src="${featureSrc}" class="sp-feature-image" alt="${featureAlt}">` : `<div class="sp-feature-icon">${feature.icon}</div>`}<div class="sp-feature-content"><h4>${feature.title}</h4><p>${feature.description}</p></div></div>`;
        }).join('');
        html += `<div class="sp-container" style="${cssVars}"><div class="sp-features-grid">${featuresHtml}</div></div>\n`;
      } else if (section.type === 'comparison-table' && section.comparisonTable && section.comparisonTable.products.length > 0) {
        const tableHtml = `<table><thead><tr><th style="background-color:${section.backgroundColor}"></th>${section.comparisonTable.products.map(product => {
          const productAlt = generateAltText(product.image, product.name);
          const productSrc = forPreview ? product.imagePreview : generateImagePath(product.image);
          return `<th class="sp-product-header" style="background-color:${product.backgroundColor}">${product.image || product.imagePreview ? `<img src="${productSrc}" class="sp-product-image" alt="${productAlt}">` : ''}<div>${product.name}</div></th>`;
        }).join('')}</tr></thead><tbody>${section.comparisonTable.attributes.map(attr => `<tr><td style="background-color:${section.backgroundColor}">${attr.name}</td>${attr.values.map((value, idx) => `<td style="text-align:${value.textAlign};font-weight:${value.fontWeight};background-color:${section.comparisonTable.products[idx].backgroundColor}">${value.text}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
        html += `<div class="sp-container" style="${cssVars}"><div class="sp-comparison-table">${tableHtml}</div></div>\n`;
      } else if (section.type === 'youtube-video' && section.youtubeVideo && section.youtubeVideo.url) {
        let videoId = '';
        try {
          const url = new URL(section.youtubeVideo.url);
          if (url.hostname.includes('youtube.com')) {
            videoId = url.searchParams.get('v') || '';
          } else if (url.hostname.includes('youtu.be')) {
            videoId = url.pathname.slice(1);
          }
        } catch (e) {}
        if (videoId) {
          const params = [];
          if (section.youtubeVideo.autoplay) params.push('autoplay=1');
          if (section.youtubeVideo.startTime > 0) params.push(`start=${section.youtubeVideo.startTime}`);
          const paramString = params.length > 0 ? '?' + params.join('&') : '';
          html += `<div class="sp-container" style="${cssVars}"><div class="sp-youtube-container"><iframe src="https://www.youtube.com/embed/${videoId}${paramString}" allowfullscreen></iframe></div></div>\n`;
        }
      }
    });
    
    return html;
  }, [sections, generateAltText, generateImagePath]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateHTML(false));
      alert('HTML skopiowany do schowka!');
    } catch (err) {
      alert('Błąd kopiowania do schowka');
    }
  }, [generateHTML]);

  const downloadHTML = useCallback(() => {
    const html = generateHTML(false);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opis-produktu.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateHTML]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>Edytor Opisów SportPoland</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Stwórz profesjonalny opis produktu dla sklepu SportPoland</p>
          </div>

          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Konfiguracja produktu:</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Marka produktu:</label>
                <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} placeholder="np. Matrix" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Kod produktu:</label>
                <input type="text" value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="np. 08485" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Dodaj sekcję:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sectionTypes.map(type => (
                <button key={type.id} onClick={() => addSection(type.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>{type.icon} {type.name}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            {sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                <p style={{ fontSize: '18px' }}>Dodaj pierwszą sekcję aby rozpocząć tworzenie opisu</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {sections.map((section) => (
                    <div key={section.id} style={{ border: '1px solid #e5e7eb', borderRadius: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '8px 16px', borderBottom: '1px solid #e5e7eb', borderRadius: '15px 15px 0 0' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{sectionTypes.find(t => t.id === section.type)?.name}</span>
                        <button onClick={() => deleteSection(section.id)} style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '16px' }}>🗑️</button>
                      </div>
                      <div style={{ backgroundColor: '#f9fafb', padding: '8px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: '#6b7280' }}>Kolor tła:</label>
                        <input type="color" value={section.backgroundColor} onChange={(e) => updateSection(section.id, 'backgroundColor', e.target.value)} style={{ width: '32px', height: '32px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }} />
                      </div>
                      <div style={{ backgroundColor: section.backgroundColor, padding: '16px', borderRadius: '0 0 15px 15px' }}>
                        
                        {section.type === 'text-only' && (
                          <TextEditor sectionId={section.id} value={section.text} onChange={(value) => updateSection(section.id, 'text', value)} />
                        )}
                        
                        {(section.type === 'image-left' || section.type === 'image-right') && (
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                              <div style={{ border: '2px dashed #d1d5db', borderRadius: '15px', padding: '16px', textAlign: 'center', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {section.imagePreview1 ? (
                                  <div><img src={section.imagePreview1} alt="" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', marginBottom: '8px' }} /><div style={{ fontSize: '12px' }}>{section.image1}</div></div>
                                ) : (<div><div style={{ fontSize: '48px', marginBottom: '8px' }}>🖼️</div><p style={{ color: '#6b7280', margin: 0 }}>Kliknij aby dodać zdjęcie</p></div>)}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(section.id, 'image1', e)} style={{ display: 'none' }} ref={(el) => { if (el) fileInputRefs.current[`${section.id}-image1`] = el; }} />
                                <button onClick={() => fileInputRefs.current[`${section.id}-image1`]?.click()} style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Wybierz zdjęcie</button>
                              </div>
                            </div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                              <TextEditor sectionId={section.id} value={section.text} onChange={(value) => updateSection(section.id, 'text', value)} />
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'image-only' && (
                          <div style={{ border: '2px dashed #d1d5db', borderRadius: '15px', padding: '16px', textAlign: 'center', minHeight: '200px' }}>
                            {section.imagePreview1 ? (
                              <div><img src={section.imagePreview1} alt="" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', marginBottom: '8px' }} /><div style={{ fontSize: '14px' }}>{section.image1}</div></div>
                            ) : (<div><div style={{ fontSize: '64px', marginBottom: '8px' }}>📸</div><p style={{ color: '#6b7280', margin: 0 }}>Kliknij aby dodać zdjęcie</p></div>)}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(section.id, 'image1', e)} style={{ display: 'none' }} ref={(el) => { if (el) fileInputRefs.current[`${section.id}-image1`] = el; }} />
                            <button onClick={() => fileInputRefs.current[`${section.id}-image1`]?.click()} style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Wybierz zdjęcie</button>
                          </div>
                        )}
                        
                        {section.type === 'two-images' && (
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {[1, 2].map(num => (
                              <div key={num} style={{ flex: '1', minWidth: '200px' }}>
                                <div style={{ border: '2px dashed #d1d5db', borderRadius: '15px', padding: '16px', textAlign: 'center', minHeight: '150px' }}>
                                  {section[`imagePreview${num}`] ? (
                                    <div><img src={section[`imagePreview${num}`]} alt="" style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '8px', marginBottom: '4px' }} /><div style={{ fontSize: '11px' }}>{section[`image${num}`]}</div></div>
                                  ) : (<div><div style={{ fontSize: '32px', marginBottom: '4px' }}>🖼️</div><p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Zdjęcie {num}</p></div>)}
                                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(section.id, `image${num}`, e)} style={{ display: 'none' }} ref={(el) => { if (el) fileInputRefs.current[`${section.id}-image${num}`] = el; }} />
                                  <button onClick={() => fileInputRefs.current[`${section.id}-image${num}`]?.click()} style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Wybierz</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.type === 'youtube-video' && section.youtubeVideo && (
                          <div>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>URL video YouTube:</label>
                              <input type="text" value={section.youtubeVideo.url} onChange={(e) => updateYoutubeSettings(section.id, 'url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" checked={section.youtubeVideo.autoplay} onChange={(e) => updateYoutubeSettings(section.id, 'autoplay', e.target.checked)} />
                                <span style={{ fontSize: '14px' }}>Automatyczne odtwarzanie</span>
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>Zacznij od (sekundy):</label>
                                <input type="number" min="0" value={section.youtubeVideo.startTime} onChange={(e) => updateYoutubeSettings(section.id, 'startTime', parseInt(e.target.value) || 0)} style={{ width: '80px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === 'icons-grid' && section.icons && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
                              {section.icons.map((icon, iconIndex) => (
                                <div key={icon.id} style={{ width: '180px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                                  <div style={{ width: '80px', height: '80px', margin: '0 auto 10px', border: '2px dashed #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {icon.imagePreview ? (
                                      <img src={icon.imagePreview} alt={icon.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <input type="text" value={icon.icon} onChange={(e) => {
                                        setSections(prev => prev.map(s => {
                                          if (s.id === section.id && s.icons) {
                                            const newIcons = s.icons.map((ic, idx) => idx === iconIndex ? { ...ic, icon: e.target.value } : ic);
                                            return { ...s, icons: newIcons };
                                          }
                                          return s;
                                        }));
                                      }} style={{ fontSize: '40px', border: 'none', textAlign: 'center', width: '100%', background: 'transparent', outline: 'none' }} placeholder="📌" />
                                    )}
                                  </div>
                                  <input type="file" accept="image/*" onChange={(e) => handleIconImageUpload(section.id, iconIndex, e)} style={{ display: 'none' }} ref={(el) => { if (el) fileInputRefs.current[`${section.id}-icon-${iconIndex}`] = el; }} />
                                  <button onClick={() => fileInputRefs.current[`${section.id}-icon-${iconIndex}`]?.click()} style={{ width: '100%', padding: '5px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', marginBottom: '8px' }}>📸 {icon.imagePreview ? 'Zmień' : 'Dodaj'}</button>
                                  <input type="text" value={icon.title} onChange={(e) => {
                                    setSections(prev => prev.map(s => {
                                      if (s.id === section.id && s.icons) {
                                        const newIcons = s.icons.map((ic, idx) => idx === iconIndex ? { ...ic, title: e.target.value } : ic);
                                        return { ...s, icons: newIcons };
                                      }
                                      return s;
                                    }));
                                  }} style={{ width: '100%', padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px', fontSize: '13px', boxSizing: 'border-box' }} placeholder="Tytuł" />
                                  <textarea value={icon.description} onChange={(e) => {
                                    setSections(prev => prev.map(s => {
                                      if (s.id === section.id && s.icons) {
                                        const newIcons = s.icons.map((ic, idx) => idx === iconIndex ? { ...ic, description: e.target.value } : ic);
                                        return { ...s, icons: newIcons };
                                      }
                                      return s;
                                    }));
                                  }} style={{ width: '100%', padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical', minHeight: '50px', fontSize: '12px', boxSizing: 'border-box' }} placeholder="Opis" />
                                </div>
                              ))}
                            </div>
                            <button onClick={() => {
                              setSections(prev => prev.map(s => {
                                if (s.id === section.id && s.icons) {
                                  return { ...s, icons: [...s.icons, { id: Date.now(), icon: '📌', title: 'Tytuł', description: 'Opis', image: '', imagePreview: '' }] };
                                }
                                return s;
                              }));
                            }} style={{ padding: '8px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>+ Dodaj ikonę</button>
                          </div>
                        )}

                        {section.type === 'features-grid' && section.features && (
                          <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '15px' }}>
                              {section.features.map((feature, featureIndex) => (
                                <div key={feature.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                                  <div style={{ width: '70px', height: '70px', flexShrink: 0, border: '2px dashed #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {feature.imagePreview ? (
                                      <img src={feature.imagePreview} alt={feature.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <input type="text" value={feature.icon} onChange={(e) => {
                                        setSections(prev => prev.map(s => {
                                          if (s.id === section.id && s.features) {
                                            const newFeatures = s.features.map((f, idx) => idx === featureIndex ? { ...f, icon: e.target.value } : f);
                                            return { ...s, features: newFeatures };
                                          }
                                          return s;
                                        }));
                                      }} style={{ fontSize: '28px', border: 'none', textAlign: 'center', width: '100%', background: 'transparent', outline: 'none' }} placeholder="🔇" />
                                    )}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <input type="text" value={feature.title} onChange={(e) => {
                                      setSections(prev => prev.map(s => {
                                        if (s.id === section.id && s.features) {
                                          const newFeatures = s.features.map((f, idx) => idx === featureIndex ? { ...f, title: e.target.value } : f);
                                          return { ...s, features: newFeatures };
                                        }
                                        return s;
                                      }));
                                    }} style={{ width: '100%', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontWeight: 'bold', marginBottom: '4px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Tytuł" />
                                    <textarea value={feature.description} onChange={(e) => {
                                      setSections(prev => prev.map(s => {
                                        if (s.id === section.id && s.features) {
                                          const newFeatures = s.features.map((f, idx) => idx === featureIndex ? { ...f, description: e.target.value } : f);
                                          return { ...s, features: newFeatures };
                                        }
                                        return s;
                                      }));
                                    }} style={{ width: '100%', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical', minHeight: '45px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '6px' }} placeholder="Opis" />
                                    <input type="file" accept="image/*" onChange={(e) => handleFeatureImageUpload(section.id, featureIndex, e)} style={{ display: 'none' }} ref={(el) => { if (el) fileInputRefs.current[`${section.id}-feature-${featureIndex}`] = el; }} />
                                    <button onClick={() => fileInputRefs.current[`${section.id}-feature-${featureIndex}`]?.click()} style={{ padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>📸 {feature.imagePreview ? 'Zmień' : 'Dodaj'}</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <button onClick={() => {
                                setSections(prev => prev.map(s => {
                                  if (s.id === section.id && s.features) {
                                    return { ...s, features: [...s.features, { id: Date.now(), icon: '📌', title: 'Funkcja', description: 'Opis', image: '', imagePreview: '' }] };
                                  }
                                  return s;
                                }));
                              }} style={{ padding: '8px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>+ Dodaj funkcję</button>
                            </div>
                          </div>
                        )}

                        {section.type === 'comparison-table' && section.comparisonTable && (
                          <div>
                            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Kolor tła całej tabeli:</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input type="color" value={section.backgroundColor} onChange={(e) => updateSection(section.id, 'backgroundColor', e.target.value)} style={{ width: '36px', height: '36px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }} />
                                <button onClick={() => updateSection(section.id, 'backgroundColor', '#ffffff')} style={{ padding: '5px 10px', fontSize: '11px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reset</button>
                              </div>
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Produkty:</h4>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                              {section.comparisonTable.products.map((product, productIndex) => (
                                <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', minWidth: '170px', backgroundColor: 'white' }}>
                                  <div style={{ width: '100px', height: '100px', margin: '0 auto 8px', border: '2px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
                                    {product.imagePreview ? (
                                      <img src={product.imagePreview} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ fontSize: '40px', color: '#d1d5db' }}>📸</div>
                                    )}
                                  </div>
                                  <input type="file" accept="image/*" onChange={(e) => handleProductImageUpload(section.id, productIndex, e)} style={{ display: 'none' }} ref={(el) => { if (el) fileInputRefs.current[`${section.id}-product-${productIndex}`] = el; }} />
                                  <button onClick={() => fileInputRefs.current[`${section.id}-product-${productIndex}`]?.click()} style={{ width: '100%', padding: '5px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', marginBottom: '6px' }}>
                                    📸 {product.imagePreview ? 'Zmień' : 'Dodaj'}
                                  </button>
                                  <input type="text" value={product.name} onChange={(e) => updateProductName(section.id, productIndex, e.target.value)} style={{ width: '100%', padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', fontWeight: '600', textAlign: 'center', boxSizing: 'border-box', marginBottom: '6px' }} placeholder="Nazwa" />
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                    <label style={{ fontSize: '11px', color: '#6b7280' }}>Kolor:</label>
                                    <input type="color" value={product.backgroundColor} onChange={(e) => updateProductColor(section.id, productIndex, e.target.value)} style={{ width: '26px', height: '26px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => addProductToTable(section.id)} style={{ padding: '7px 14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginBottom: '15px' }}>+ Produkt</button>

                            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Atrybuty:</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                              {section.comparisonTable.attributes.map((attr, attrIndex) => (
                                <div key={attr.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', backgroundColor: 'white' }}>
                                  <div style={{ marginBottom: '8px' }}>
                                    <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '3px' }}>Nazwa atrybutu:</label>
                                    <input type="text" value={attr.name} onChange={(e) => updateAttributeName(section.id, attrIndex, e.target.value)} style={{ width: '100%', maxWidth: '280px', padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', fontWeight: '600', boxSizing: 'border-box' }} placeholder="np. Cena" />
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {attr.values.map((value, valueIndex) => (
                                      <div key={valueIndex} style={{ minWidth: '180px', flex: '1', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', backgroundColor: '#f9fafb' }}>
                                        <label style={{ fontSize: '10px', color: '#6b7280', display: 'block', marginBottom: '3px', fontWeight: '600' }}>{section.comparisonTable.products[valueIndex]?.name || `Produkt ${valueIndex + 1}`}:</label>
                                        <textarea value={value.text} onChange={(e) => updateAttributeValue(section.id, attrIndex, valueIndex, 'text', e.target.value)} style={{ width: '100%', padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', minHeight: '50px', resize: 'vertical', marginBottom: '5px' }} placeholder="Wartość" />
                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                          <select value={value.textAlign} onChange={(e) => updateAttributeValue(section.id, attrIndex, valueIndex, 'textAlign', e.target.value)} style={{ padding: '3px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '10px' }}>
                                            <option value="left">⬅️ Lewo</option>
                                            <option value="center">⬌ Środek</option>
                                            <option value="right">➡️ Prawo</option>
                                            <option value="justify">⬌ Justuj</option>
                                          </select>
                                          <button onClick={() => updateAttributeValue(section.id, attrIndex, valueIndex, 'fontWeight', value.fontWeight === 'bold' ? 'normal' : 'bold')} style={{ padding: '3px 7px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: value.fontWeight === 'bold' ? '#3b82f6' : 'white', color: value.fontWeight === 'bold' ? 'white' : 'black', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>B</button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => addAttributeToTable(section.id)} style={{ padding: '7px 14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>+ Atrybut</button>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Eksportuj opis</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setShowPreview(!showPreview)} style={{ padding: '10px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>{showPreview ? 'Ukryj podgląd' : 'Pokaż podgląd'}</button>
                      <button onClick={copyToClipboard} style={{ padding: '10px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Skopiuj HTML</button>
                      <button onClick={downloadHTML} style={{ padding: '10px 16px', backgroundColor: '#f87171', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Pobierz HTML</button>
                    </div>
                  </div>

                  {showPreview && (
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>Podgląd na żywo:</h4>
                      <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '16px', backgroundColor: 'white' }} dangerouslySetInnerHTML={{ __html: generateHTML(true) }} />
                      <h4 style={{ fontWeight: '500', marginBottom: '8px', marginTop: '16px' }}>Kod HTML:</h4>
                      <textarea readOnly value={generateHTML(false)} style={{ width: '100%', height: '160px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
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
};

export default AllegroDescriptionEditor;
