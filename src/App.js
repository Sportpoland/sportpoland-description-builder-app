import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

// Optymalizowany edytor tekstu z React.memo
const TextEditor = memo(({ sectionId, value, onChange, placeholder = "Wprowadź tekst..." }) => {
  const textareaRef = useRef(null);

  const insertTag = useCallback((openTag, closeTag = null) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText;
    if (closeTag) {
      newText = textarea.value.substring(0, start) + 
               openTag + selectedText + closeTag + 
               textarea.value.substring(end);
    } else {
      newText = textarea.value.substring(0, start) + 
               openTag + 
               textarea.value.substring(end);
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
    
    setTimeout(() => {
      textarea.focus();
    }, 0);
  }, [onChange]);

  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}>
      {/* Panel narzędzi formatowania */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '4px', 
        padding: '8px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        <button
          type="button"
          onClick={() => insertTag('<strong>', '</strong>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          title="Pogrubienie"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertTag('<em>', '</em>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontStyle: 'italic'
          }}
          title="Kursywa"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertTag('<u>', '</u>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            textDecoration: 'underline'
          }}
          title="Podkreślenie"
        >
          U
        </button>
        <div style={{ width: '1px', backgroundColor: '#d1d5db', margin: '0 4px' }}></div>
        <button
          type="button"
          onClick={() => insertTag('<h1>', '</h1>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          title="Nagłówek H1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertTag('<h2>', '</h2>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          title="Nagłówek H2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertTag('<h3>', '</h3>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          title="Nagłówek H3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => insertTag('<p>', '</p>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Paragraf"
        >
          P
        </button>
        <div style={{ width: '1px', backgroundColor: '#d1d5db', margin: '0 4px' }}></div>
        <button
          type="button"
          onClick={() => insertList('ul')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Lista punktowana"
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => insertList('ol')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Lista numerowana"
        >
          1. Lista
        </button>
        <div style={{ width: '1px', backgroundColor: '#d1d5db', margin: '0 4px' }}></div>
        <button
          type="button"
          onClick={() => insertTag('<br>')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Nowa linia"
        >
          ↵
        </button>
        <select
          onChange={(e) => {
            if (e.target.value) {
              insertTag(`<span style="font-size: ${e.target.value}">`, '</span>');
              e.target.value = '';
            }
          }}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Rozmiar czcionki"
        >
          <option value="">Rozmiar</option>
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
      </div>
      
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          border: 'none',
          outline: 'none',
          lineHeight: '1.4',
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
});

TextEditor.displayName = 'TextEditor';

const AllegroDescriptionEditor = () => {
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
    const savedTemplatesStr = window.sessionStorage?.getItem('sportpoland-templates');
    if (savedTemplatesStr) {
      try {
        setTemplates(JSON.parse(savedTemplatesStr));
      } catch (error) {
        console.error('Błąd wczytywania:', error);
      }
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
    { id: 'features-grid', name: 'Funkcje produktu 2x2', icon: '🔲' }
  ];

  const generateAltText = useCallback((imageName, context = '') => {
    if (!imageName) return '';
    
    let altText = imageName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ');
    
    if (context) {
      altText = `${context} - ${altText}`;
    }
    
    if (productBrand && productCode) {
      altText = `${productBrand} ${productCode} ${altText}`;
    }
    
    return altText;
  }, [productBrand, productCode]);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({
      sections: JSON.parse(JSON.stringify(sections)),
      productBrand,
      productCode
    });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }, [history, currentStep, sections, productBrand, productCode]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      const previousState = history[currentStep - 1];
      setSections(previousState.sections);
      setProductBrand(previousState.productBrand);
      setProductCode(previousState.productCode);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, history]);

  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      alert('Podaj nazwę szablonu!');
      return;
    }
    
    const template = {
      id: Date.now(),
      name: templateName,
      sections: JSON.parse(JSON.stringify(sections)),
      productBrand,
      productCode,
      createdAt: new Date().toLocaleString()
    };
    
    setTemplates(prev => [...prev, template]);
    setTemplateName('');
    alert('Szablon został zapisany!');
  }, [templateName, sections, productBrand, productCode]);

  const loadTemplate = useCallback((template) => {
    saveToHistory();
    setSections(template.sections);
    setProductBrand(template.productBrand);
    setProductCode(template.productCode);
    alert(`Szablon "${template.name}" został wczytany!`);
  }, [saveToHistory]);

  const deleteTemplate = useCallback((templateId) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten szablon?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  }, []);

  const exportTemplates = useCallback(() => {
    try {
      const dataStr = JSON.stringify(templates, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sportpoland-templates-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Błąd eksportu:', error);
      alert('Błąd eksportowania szablonów!');
    }
  }, [templates]);

  const importTemplates = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTemplates = JSON.parse(e.target.result);
        if (!Array.isArray(importedTemplates)) {
          throw new Error('Nieprawidłowy format pliku');
        }

        const templatesWithNewIds = importedTemplates.map(template => ({
          ...template,
          id: Date.now() + Math.random(),
          createdAt: `${template.createdAt} (importowany)`
        }));

        setTemplates(prev => [...prev, ...templatesWithNewIds]);
        alert(`Zaimportowano ${templatesWithNewIds.length} szablonów!`);
      } catch (error) {
        console.error('Błąd importu:', error);
        alert('Błąd importowania szablonów! Sprawdź czy plik jest prawidłowy.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, []);

  const addSection = useCallback((type) => {
    saveToHistory();
    const newSection = {
      id: Date.now(),
      type,
      text: '',
      image1: '',
      image2: '',
      imagePreview1: '',
      imagePreview2: '',
      icons: type === 'icons-grid' ? [
        { id: 1, icon: '✓', title: 'Tytuł 1', description: 'Opis funkcji 1', image: '', imagePreview: '' },
        { id: 2, icon: '⚡', title: 'Tytuł 2', description: 'Opis funkcji 2', image: '', imagePreview: '' },
        { id: 3, icon: '🔒', title: 'Tytuł 3', description: 'Opis funkcji 3', image: '', imagePreview: '' }
      ] : undefined,
      features: type === 'features-grid' ? [
        { id: 1, icon: '🔇', title: 'Cisza podczas treningu', description: 'cichy silnik pozwala ćwiczyć o dowolnej porze – bez zakłócania spokoju domowników.' },
        { id: 2, icon: '📦', title: 'Oszczędność miejsca i mobilność', description: 'po złożeniu zajmuje niewiele miejsca, a dzięki rolkom łatwo ją przestawić w inne miejsce.' },
        { id: 3, icon: '🎯', title: 'Trening dopasowany do Twoich możliwości', description: 'regulacja prędkości i nachylenia pozwala dostosować intensywność biegu – od spaceru po intensywny trening interwałowy.' },
        { id: 4, icon: '🦶', title: 'Komfort i bezpieczeństwo', description: 'system amortyzacji zmniejsza obciążenie stawów, co pozwala ćwiczyć częściej i dłużej bez ryzyka przeciążeń.' }
      ] : undefined,
      backgroundColor: '#ffffff'
    };
    setSections(prev => [...prev, newSection]);
  }, [saveToHistory]);

  const deleteSection = useCallback((id) => {
    saveToHistory();
    setSections(prev => {
      const sectionToDelete = prev.find(section => section.id === id);
      if (sectionToDelete) {
        if (sectionToDelete.imagePreview1) {
          URL.revokeObjectURL(sectionToDelete.imagePreview1);
        }
        if (sectionToDelete.imagePreview2) {
          URL.revokeObjectURL(sectionToDelete.imagePreview2);
        }
        if (sectionToDelete.icons) {
          sectionToDelete.icons.forEach(icon => {
            if (icon.imagePreview) {
              URL.revokeObjectURL(icon.imagePreview);
            }
          });
        }
        if (sectionToDelete.features) {
          sectionToDelete.features.forEach(feature => {
            if (feature.imagePreview) {
              URL.revokeObjectURL(feature.imagePreview);
            }
          });
        }
      }
      return prev.filter(section => section.id !== id);
    });
  }, [saveToHistory]);

  const moveSection = useCallback((id, direction) => {
    setSections(prev => {
      const currentIndex = prev.findIndex(section => section.id === id);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === prev.length - 1)
      ) return prev;

      saveToHistory();
      const newSections = [...prev];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newSections[currentIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[currentIndex]];
      return newSections;
    });
  }, [saveToHistory]);

  const copySection = useCallback((id) => {
    saveToHistory();
    setSections(prev => {
      const sectionToCopy = prev.find(section => section.id === id);
      if (sectionToCopy) {
        const copiedSection = {
          ...sectionToCopy,
          id: Date.now(),
          imagePreview1: '',
          imagePreview2: '',
          icons: sectionToCopy.icons ? sectionToCopy.icons.map(icon => ({
            ...icon,
            id: Date.now() + Math.random(),
            imagePreview: ''
          })) : undefined,
          features: sectionToCopy.features ? sectionToCopy.features.map(feature => ({
            ...feature,
            id: Date.now() + Math.random(),
            imagePreview: ''
          })) : undefined
        };
        return [...prev, copiedSection];
      }
      return prev;
    });
  }, [saveToHistory]);

  const updateSection = useCallback((id, field, value) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  }, []);

  const handleTextChange = useCallback((sectionId, value) => {
    updateSection(sectionId, 'text', value);
  }, [updateSection]);

  const updateFeaturesGrid = useCallback((sectionId, featureIndex, field, value) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newFeatures = [...section.features];
        newFeatures[featureIndex] = { ...newFeatures[featureIndex], [field]: value };
        return { ...section, features: newFeatures };
      }
      return section;
    }));
  }, []);

  const addFeatureToGrid = useCallback((sectionId) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newFeature = {
          id: Date.now(),
          icon: '📌',
          title: 'Nowa funkcja',
          description: 'Opis nowej funkcji',
          image: '',
          imagePreview: ''
        };
        return { ...section, features: [...section.features, newFeature] };
      }
      return section;
    }));
  }, []);

  const removeFeatureFromGrid = useCallback((sectionId, featureIndex) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const featureToRemove = section.features[featureIndex];
        if (featureToRemove && featureToRemove.imagePreview) {
          URL.revokeObjectURL(featureToRemove.imagePreview);
        }
        const newFeatures = section.features.filter((_, index) => index !== featureIndex);
        return { ...section, features: newFeatures };
      }
      return section;
    }));
  }, []);

  const handleFeatureImageUpload = useCallback((sectionId, featureIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageName = file.name;
      const imageURL = URL.createObjectURL(file);
      
      setSections(prev => prev.map(section => {
        if (section.id === sectionId) {
          const updatedFeatures = section.features.map((feature, index) => 
            index === featureIndex 
              ? { ...feature, image: imageName, imagePreview: imageURL }
              : feature
          );
          return { ...section, features: updatedFeatures };
        }
        return section;
      }));
    }
  }, []);

  const removeFeatureImage = useCallback((sectionId, featureIndex) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const updatedFeatures = section.features.map((feature, index) => {
          if (index === featureIndex) {
            if (feature.imagePreview) {
              URL.revokeObjectURL(feature.imagePreview);
            }
            return { ...feature, image: '', imagePreview: '' };
          }
          return feature;
        });
        return { ...section, features: updatedFeatures };
      }
      return section;
    }));
  }, []);

  const updateIconsGrid = useCallback((sectionId, iconIndex, field, value) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newIcons = [...section.icons];
        newIcons[iconIndex] = { ...newIcons[iconIndex], [field]: value };
        return { ...section, icons: newIcons };
      }
      return section;
    }));
  }, []);

  const addIconToGrid = useCallback((sectionId) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newIcon = {
          id: Date.now(),
          icon: '📌',
          title: 'Nowy tytuł',
          description: 'Nowy opis',
          image: '',
          imagePreview: ''
        };
        return { ...section, icons: [...section.icons, newIcon] };
      }
      return section;
    }));
  }, []);

  const removeIconFromGrid = useCallback((sectionId, iconIndex) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const iconToRemove = section.icons[iconIndex];
        if (iconToRemove && iconToRemove.imagePreview) {
          URL.revokeObjectURL(iconToRemove.imagePreview);
        }
        const newIcons = section.icons.filter((_, index) => index !== iconIndex);
        return { ...section, icons: newIcons };
      }
      return section;
    }));
  }, []);

  const handleIconImageUpload = useCallback((sectionId, iconIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageName = file.name;
      const imageURL = URL.createObjectURL(file);
      
      setSections(prev => prev.map(section => {
        if (section.id === sectionId) {
          const updatedIcons = section.icons.map((icon, index) => 
            index === iconIndex 
              ? { ...icon, image: imageName, imagePreview: imageURL }
              : icon
          );
          return { ...section, icons: updatedIcons };
        }
        return section;
      }));
    }
  }, []);

  const removeIconImage = useCallback((sectionId, iconIndex) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const updatedIcons = section.icons.map((icon, index) => {
          if (index === iconIndex) {
            if (icon.imagePreview) {
              URL.revokeObjectURL(icon.imagePreview);
            }
            return { ...icon, image: '', imagePreview: '' };
          }
          return icon;
        });
        return { ...section, icons: updatedIcons };
      }
      return section;
    }));
  }, []);

  const handleImageUpload = useCallback((sectionId, imageField, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageName = file.name;
      const imageURL = URL.createObjectURL(file);
      
      setSections(prev => prev.map(section => {
        if (section.id === sectionId) {
          const previewField = imageField === 'image1' ? 'imagePreview1' : 'imagePreview2';
          return {
            ...section,
            [imageField]: imageName,
            [previewField]: imageURL
          };
        }
        return section;
      }));
    }
  }, []);

  const generateImagePath = useCallback((imageName) => {
    if (!imageName) return '';
    if (!productBrand || !productCode) {
      return imageName;
    }
    return `/data/include/cms/sportpoland_com/pliki-opisy/${productBrand}/${productCode}/${imageName}`;
  }, [productBrand, productCode]);

  const generatePreviewHTML = useCallback(() => {
    let html = `<style>
      .sp-container {
        background-color: var(--bg-color);
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 15px;
      }
      
      .sp-flex {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
      }
      
      .sp-text {
        line-height: 1.4;
      }
      
      .sp-image {
        width: 100%;
        height: auto;
        border-radius: 10px;
        max-width: 250px;
      }
      
      .sp-image-container {
        text-align: center;
      }
      
      .sp-image-only {
        width: 100%;
        height: auto;
        min-height: 200px;
        max-height: 400px;
        border-radius: 10px;
        object-fit: contain;
      }
      
      .sp-image-only-container {
        display: flex;
        justify-content: center;
      }
      
      .sp-icons-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        text-align: center;
      }
      
      .sp-features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
        text-align: left;
      }
      
      .sp-feature-item {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
      }
      
      .sp-feature-icon {
        font-size: 50px;
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
      }
      
      .sp-feature-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
        flex-shrink: 0;
      }
      
      .sp-feature-content h4 {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: bold;
        color: #1f2937;
      }
      
      .sp-feature-content p {
        margin: 0;
        font-size: 16px;
        color: #6b7280;
        line-height: 1.5;
      }
      
      .sp-icon-item {
        width: 100%;
        max-width: 180px;
        min-width: 150px;
        text-align: center;
        margin: 5px;
        padding: 10px;
        box-sizing: border-box;
      }
      
      .sp-icon-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 8px;
        margin: 0 auto 10px;
        display: block;
      }
      
      .sp-icon-emoji {
        font-size: 40px;
        margin-bottom: 10px;
        display: block;
      }
      
      .sp-icon-title {
        margin: 5px 0;
        font-weight: bold;
        font-size: 14px;
      }
      
      .sp-icon-desc {
        margin: 0;
        font-size: 12px;
        color: #666;
        line-height: 1.3;
      }
      
      @media (min-width: 768px) {
        .sp-container {
          padding: 20px;
        }
        
        .sp-flex {
          flex-direction: row;
          align-items: center;
          gap: 20px;
        }
        
        .sp-flex.reverse {
          flex-direction: row-reverse;
        }
        
        .sp-flex > div {
          flex: 1;
        }
        
        .sp-image {
          max-width: 400px;
        }
        
        .sp-image-only {
          max-height: 500px;
        }
        
        .sp-icon-item {
          width: auto;
          min-width: 180px;
          max-width: 200px;
        }
        
        .sp-icon-image {
          width: 60px;
          height: 60px;
        }
        
        .sp-icon-emoji {
          font-size: 48px;
        }
        
        .sp-icon-title {
          font-size: 16px;
        }
        
        .sp-icon-desc {
          font-size: 14px;
        }
        
        .sp-features-grid {
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }
        
        .sp-feature-item {
          padding: 25px;
          gap: 25px;
        }
        
        .sp-feature-icon {
          font-size: 60px;
          width: 100px;
          height: 100px;
        }
        
        .sp-feature-image {
          width: 100px;
          height: 100px;
        }
        
        .sp-feature-content h4 {
          font-size: 20px;
          margin-bottom: 12px;
        }
        
        .sp-feature-content p {
          font-size: 17px;
        }
      }
      
      @media (min-width: 1024px) {
        .sp-container {
          padding: 25px;
        }
        
        .sp-flex {
          gap: 25px;
        }
        
        .sp-icon-item {
          min-width: 200px;
          max-width: 220px;
        }
        
        .sp-features-grid {
          gap: 30px;
        }
        
        .sp-feature-item {
          padding: 30px;
          gap: 30px;
        }
        
        .sp-feature-icon {
          font-size: 70px;
          width: 120px;
          height: 120px;
        }
        
        .sp-feature-image {
          width: 120px;
          height: 120px;
        }
        
        .sp-feature-content h4 {
          font-size: 22px;
        }
        
        .sp-feature-content p {
          font-size: 18px;
        }
      }
    </style>`;
    
    sections.forEach(section => {
      const cssVars = `--bg-color: ${section.backgroundColor};`;
      
      switch (section.type) {
        case 'text-only':
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-text">${section.text || ''}</div>
          </div>\n`;
          break;
          
        case 'image-left':
          const altLeft = generateAltText(section.image1, 'Zdjęcie produktu');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-flex">
              <div class="sp-image-container">
                ${section.imagePreview1 ? `<img src="${section.imagePreview1}" class="sp-image" alt="${altLeft}">` : ''}
              </div>
              <div>
                <div class="sp-text">${section.text || ''}</div>
              </div>
            </div>
          </div>\n`;
          break;
          
        case 'image-right':
          const altRight = generateAltText(section.image1, 'Zdjęcie produktu');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-flex reverse">
              <div class="sp-image-container">
                ${section.imagePreview1 ? `<img src="${section.imagePreview1}" class="sp-image" alt="${altRight}">` : ''}
              </div>
              <div>
                <div class="sp-text">${section.text || ''}</div>
              </div>
            </div>
          </div>\n`;
          break;
          
        case 'image-only':
          const altOnly = generateAltText(section.image1, 'Zdjęcie produktu');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-image-only-container">
              ${section.imagePreview1 ? `<img src="${section.imagePreview1}" class="sp-image-only" alt="${altOnly}">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'two-images':
          const altTwo1 = generateAltText(section.image1, 'Zdjęcie produktu 1');
          const altTwo2 = generateAltText(section.image2, 'Zdjęcie produktu 2');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-flex">
              <div style="text-align: center;">
                ${section.imagePreview1 ? `<img src="${section.imagePreview1}" class="sp-image" alt="${altTwo1}">` : ''}
              </div>
              <div style="text-align: center;">
                ${section.imagePreview2 ? `<img src="${section.imagePreview2}" class="sp-image" alt="${altTwo2}">` : ''}
              </div>
            </div>
          </div>\n`;
          break;
          
        case 'icons-grid':
          const iconsHtml = section.icons?.map(icon => {
            const iconAlt = generateAltText(icon.image, icon.title);
            return `
            <div class="sp-icon-item">
              ${icon.imagePreview 
                ? `<img src="${icon.imagePreview}" class="sp-icon-image" alt="${iconAlt}">`
                : `<div class="sp-icon-emoji">${icon.icon}</div>`
              }
              <h4 class="sp-icon-title">${icon.title}</h4>
              <p class="sp-icon-desc">${icon.description}</p>
            </div>
          `;}).join('') || '';
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-icons-grid">
              ${iconsHtml}
            </div>
          </div>\n`;
          break;
          
        case 'features-grid':
          const featuresHtml = section.features?.map(feature => {
            const featureAlt = generateAltText(feature.image, feature.title);
            return `
            <div class="sp-feature-item">
              ${feature.imagePreview 
                ? `<img src="${feature.imagePreview}" class="sp-feature-image" alt="${featureAlt}">`
                : `<div class="sp-feature-icon">${feature.icon}</div>`
              }
              <div class="sp-feature-content">
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
              </div>
            </div>
          `;}).join('') || '';
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-features-grid">
              ${featuresHtml}
            </div>
          </div>\n`;
          break;
          
        default:
          break;
      }
    });
    
    return html;
  }, [sections, generateAltText]);

  const generateHTML = useCallback(() => {
    let html = `<style>
      .sp-container {
        background-color: var(--bg-color);
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 15px;
      }
      
      .sp-flex {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
      }
      
      .sp-text {
        line-height: 1.4;
      }
      
      .sp-image {
        width: 100%;
        height: auto;
        border-radius: 10px;
        max-width: 250px;
      }
      
      .sp-image-container {
        text-align: center;
      }
      
      .sp-image-only {
        width: 100%;
        height: auto;
        min-height: 200px;
        max-height: 400px;
        border-radius: 10px;
        object-fit: contain;
      }
      
      .sp-image-only-container {
        display: flex;
        justify-content: center;
      }
      
      .sp-icons-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        text-align: center;
      }
      
      .sp-features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
        text-align: left;
      }
      
      .sp-feature-item {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
      }
      
      .sp-feature-icon {
        font-size: 50px;
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
      }
      
      .sp-feature-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
        flex-shrink: 0;
      }
      
      .sp-feature-content h4 {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: bold;
        color: #1f2937;
      }
      
      .sp-feature-content p {
        margin: 0;
        font-size: 16px;
        color: #6b7280;
        line-height: 1.5;
      }
      
      .sp-icon-item {
        width: 100%;
        max-width: 180px;
        min-width: 150px;
        text-align: center;
        margin: 5px;
        padding: 10px;
        box-sizing: border-box;
      }
      
      .sp-icon-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 8px;
        margin: 0 auto 10px;
        display: block;
      }
      
      .sp-icon-emoji {
        font-size: 40px;
        margin-bottom: 10px;
        display: block;
      }
      
      .sp-icon-title {
        margin: 5px 0;
        font-weight: bold;
        font-size: 14px;
      }
      
      .sp-icon-desc {
        margin: 0;
        font-size: 12px;
        color: #666;
        line-height: 1.3;
      }
      
      @media (min-width: 768px) {
        .sp-container {
          padding: 20px;
        }
        
        .sp-flex {
          flex-direction: row;
          align-items: center;
          gap: 20px;
        }
        
        .sp-flex.reverse {
          flex-direction: row-reverse;
        }
        
        .sp-flex > div {
          flex: 1;
        }
        
        .sp-image {
          max-width: 400px;
        }
        
        .sp-image-only {
          max-height: 500px;
        }
        
        .sp-icon-item {
          width: auto;
          min-width: 180px;
          max-width: 200px;
        }
        
        .sp-icon-image {
          width: 60px;
          height: 60px;
        }
        
        .sp-icon-emoji {
          font-size: 48px;
        }
        
        .sp-icon-title {
          font-size: 16px;
        }
        
        .sp-icon-desc {
          font-size: 14px;
        }
        
        .sp-features-grid {
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }
        
        .sp-feature-item {
          padding: 25px;
          gap: 25px;
        }
        
        .sp-feature-icon {
          font-size: 60px;
          width: 100px;
          height: 100px;
        }
        
        .sp-feature-image {
          width: 100px;
          height: 100px;
        }
        
        .sp-feature-content h4 {
          font-size: 20px;
          margin-bottom: 12px;
        }
        
        .sp-feature-content p {
          font-size: 17px;
        }
      }
      
      @media (min-width: 1024px) {
        .sp-container {
          padding: 25px;
        }
        
        .sp-flex {
          gap: 25px;
        }
        
        .sp-icon-item {
          min-width: 200px;
          max-width: 220px;
        }
        
        .sp-features-grid {
          gap: 30px;
        }
        
        .sp-feature-item {
          padding: 30px;
          gap: 30px;
        }
        
        .sp-feature-icon {
          font-size: 70px;
          width: 120px;
          height: 120px;
        }
        
        .sp-feature-image {
          width: 120px;
          height: 120px;
        }
        
        .sp-feature-content h4 {
          font-size: 22px;
        }
        
        .sp-feature-content p {
          font-size: 18px;
        }
      }
    </style>`;
    
    sections.forEach(section => {
      const cssVars = `--bg-color: ${section.backgroundColor};`;
      
      switch (section.type) {
        case 'text-only':
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-text">${section.text || ''}</div>
          </div>\n`;
          break;
          
        case 'image-left':
          const altLeft = generateAltText(section.image1, 'Zdjęcie produktu');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-flex">
              <div class="sp-image-container">
                ${section.image1 ? `<img src="${generateImagePath(section.image1)}" class="sp-image" alt="${altLeft}">` : ''}
              </div>
              <div>
                <div class="sp-text">${section.text || ''}</div>
              </div>
            </div>
          </div>\n`;
          break;
          
        case 'image-right':
          const altRight = generateAltText(section.image1, 'Zdjęcie produktu');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-flex reverse">
              <div class="sp-image-container">
                ${section.image1 ? `<img src="${generateImagePath(section.image1)}" class="sp-image" alt="${altRight}">` : ''}
              </div>
              <div>
                <div class="sp-text">${section.text || ''}</div>
              </div>
            </div>
          </div>\n`;
          break;
          
        case 'image-only':
          const altOnly = generateAltText(section.image1, 'Zdjęcie produktu');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-image-only-container">
              ${section.image1 ? `<img src="${generateImagePath(section.image1)}" class="sp-image-only" alt="${altOnly}">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'two-images':
          const altTwo1 = generateAltText(section.image1, 'Zdjęcie produktu 1');
          const altTwo2 = generateAltText(section.image2, 'Zdjęcie produktu 2');
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-flex">
              <div style="text-align: center;">
                ${section.image1 ? `<img src="${generateImagePath(section.image1)}" class="sp-image" alt="${altTwo1}">` : ''}
              </div>
              <div style="text-align: center;">
                ${section.image2 ? `<img src="${generateImagePath(section.image2)}" class="sp-image" alt="${altTwo2}">` : ''}
              </div>
            </div>
          </div>\n`;
          break;
          
        case 'icons-grid':
          const iconsHtml = section.icons?.map(icon => {
            const iconAlt = generateAltText(icon.image, icon.title);
            return `
            <div class="sp-icon-item">
              ${icon.image 
                ? `<img src="${generateImagePath(icon.image)}" class="sp-icon-image" alt="${iconAlt}">`
                : `<div class="sp-icon-emoji">${icon.icon}</div>`
              }
              <h4 class="sp-icon-title">${icon.title}</h4>
              <p class="sp-icon-desc">${icon.description}</p>
            </div>
          `;}).join('') || '';
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-icons-grid">
              ${iconsHtml}
            </div>
          </div>\n`;
          break;
          
        case 'features-grid':
          const featuresHtml = section.features?.map(feature => {
            const featureAlt = generateAltText(feature.image, feature.title);
            return `
            <div class="sp-feature-item">
              ${feature.image 
                ? `<img src="${generateImagePath(feature.image)}" class="sp-feature-image" alt="${featureAlt}">`
                : `<div class="sp-feature-icon">${feature.icon}</div>`
              }
              <div class="sp-feature-content">
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
              </div>
            </div>
          `;}).join('') || '';
          html += `<div class="sp-container" style="${cssVars}">
            <div class="sp-features-grid">
              ${featuresHtml}
            </div>
          </div>\n`;
          break;
          
        default:
          break;
      }
    });
    
    return html;
  }, [sections, generateAltText, generateImagePath]);

  const copyToClipboard = useCallback(async () => {
    const html = generateHTML();
    try {
      await navigator.clipboard.writeText(html);
      alert('HTML skopiowany do schowka!');
    } catch (err) {
      console.error('Błąd kopiowania:', err);
      alert('Błąd kopiowania do schowka');
    }
  }, [generateHTML]);

  const downloadHTML = useCallback(() => {
    const html = generateHTML();
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Edytor Opisów Produktów SportPoland
              </h1>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  📁 {showTemplates ? 'Ukryj szablony' : 'Szablony'}
                </button>
                {currentStep > 0 && (
                  <button
                    onClick={goBack}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(107, 114, 128, 0.2)'
                    }}
                  >
                    ⬅️ Cofnij
                  </button>
                )}
              </div>
            </div>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Stwórz profesjonalny opis produktu dla sklepu SportPoland
            </p>
          </div>

          {/* Sekcja szablonów */}
          {showTemplates && (
            <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px', backgroundColor: '#f9fafb' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Zarządzanie szablonami:</h3>
              
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Zapisz aktualny szablon:</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Nazwa szablonu..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={saveTemplate}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    💾 Zapisz szablon
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>Zarządzanie plikami szablonów:</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importTemplates}
                      style={{ display: 'none' }}
                      id="import-templates"
                    />
                    <button
                      onClick={() => document.getElementById('import-templates').click()}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      title="Importuj szablony z pliku JSON"
                    >
                      📥 Import
                    </button>
                    <button
                      onClick={exportTemplates}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      title="Eksportuj wszystkie szablony do pliku JSON"
                    >
                      📤 Eksport
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Importuj szablony z pliku JSON lub eksportuj aktualne szablony do kopii zapasowej.
                </p>
              </div>

              {templates.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Zapisane szablony:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {templates.map(template => (
                      <div key={template.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px', 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '6px' 
                      }}>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '14px' }}>{template.name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {template.sections.length} sekcji • {template.createdAt}
                            {template.productBrand && template.productCode && 
                              ` • ${template.productBrand}/${template.productCode}`
                            }
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => loadTemplate(template)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            📂 Wczytaj
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            🗑️ Usuń
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sekcja konfiguracji produktu */}
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Konfiguracja produktu:</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Marka produktu:
                </label>
                <input
                  type="text"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  placeholder="np. Matrix"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Kod produktu:
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="np. 08485"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            {productBrand && productCode && (
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '4px', fontSize: '12px', color: '#0369a1' }}>
                Ścieżka do zdjęć: /data/include/cms/sportpoland_com/pliki-opisy/{productBrand}/{productCode}/[nazwa-zdjęcia]
              </div>
            )}
          </div>

          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Dodaj sekcję:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sectionTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => addSection(type.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: '#f87171',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(248, 113, 113, 0.2)'
                  }}
                >
                  <span>{type.icon}</span>
                  {type.name}
                </button>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sections.map((section, index) => (
                  <div key={section.id} style={{ border: '1px solid #e5e7eb', borderRadius: '15px' }}>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: '#f9fafb', 
                      padding: '8px 16px', 
                      borderBottom: '1px solid #e5e7eb',
                      borderRadius: '15px 15px 0 0'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        {sectionTypes.find(t => t.id === section.type)?.name}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={index === 0}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            color: index === 0 ? '#ccc' : '#6b7280',
                            fontSize: '16px'
                          }}
                          title="Przesuń w górę"
                        >
                          ⬆️
                        </button>
                        <button
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={index === sections.length - 1}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: index === sections.length - 1 ? 'not-allowed' : 'pointer',
                            color: index === sections.length - 1 ? '#ccc' : '#6b7280',
                            fontSize: '16px'
                          }}
                          title="Przesuń w dół"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => copySection(section.id)}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: '16px'
                          }}
                          title="Kopiuj sekcję"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            fontSize: '16px'
                          }}
                          title="Usuń sekcję"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ 
                      backgroundColor: '#f9fafb', 
                      padding: '8px 16px', 
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <label style={{ fontSize: '14px', color: '#6b7280' }}>Kolor tła:</label>
                      <input
                        type="color"
                        value={section.backgroundColor}
                        onChange={(e) => updateSection(section.id, 'backgroundColor', e.target.value)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      />
                      <button
                        onClick={() => updateSection(section.id, 'backgroundColor', '#ffffff')}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Reset
                      </button>
                    </div>

                    <div style={{ backgroundColor: section.backgroundColor, padding: '16px', borderRadius: '0 0 15px 15px' }}>
                      {section.type === 'text-only' && (
                        <TextEditor
                          sectionId={section.id}
                          value={section.text}
                          onChange={(value) => handleTextChange(section.id, value)}
                          placeholder="Wprowadź tekst..."
                        />
                      )}
                      
                      {section.type === 'image-left' && (
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ 
                              border: '2px dashed #d1d5db', 
                              borderRadius: '15px', 
                              padding: '16px', 
                              textAlign: 'center',
                              minHeight: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}>
                              {section.imagePreview1 ? (
                                <div style={{ position: 'relative' }}>
                                  <button
                                    onClick={() => {
                                      URL.revokeObjectURL(section.imagePreview1);
                                      updateSection(section.id, 'image1', '');
                                      updateSection(section.id, 'imagePreview1', '');
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '0px',
                                      right: '0px',
                                      background: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '24px',
                                      height: '24px',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      zIndex: 10
                                    }}
                                  >
                                    ×
                                  </button>
                                  <img 
                                    src={section.imagePreview1} 
                                    alt={generateAltText(section.image1, 'Zdjęcie produktu')}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '120px', 
                                      borderRadius: '8px',
                                      marginBottom: '8px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                                    {section.image1}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                    Ścieżka: {generateImagePath(section.image1)}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🖼️</div>
                                  <p style={{ color: '#6b7280', margin: 0 }}>Kliknij aby dodać zdjęcie</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(section.id, 'image1', e)}
                                style={{ display: 'none' }}
                                ref={(el) => {
                                  if (el) fileInputRefs.current[`${section.id}-image1`] = el;
                                }}
                              />
                              <button
                                onClick={() => fileInputRefs.current[`${section.id}-image1`]?.click()}
                                style={{
                                  marginTop: '8px',
                                  padding: '8px 16px',
                                  backgroundColor: '#f87171',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'all 0.2s ease',
                                  boxShadow: '0 2px 4px rgba(248, 113, 113, 0.2)'
                                }}
                              >
                                Wybierz zdjęcie
                              </button>
                            </div>
                          </div>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <TextEditor
                              sectionId={section.id}
                              value={section.text}
                              onChange={(value) => handleTextChange(section.id, value)}
                              placeholder="Wprowadź tekst..."
                            />
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'image-right' && (
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <TextEditor
                              sectionId={section.id}
                              value={section.text}
                              onChange={(value) => handleTextChange(section.id, value)}
                              placeholder="Wprowadź tekst..."
                            />
                          </div>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ 
                              border: '2px dashed #d1d5db', 
                              borderRadius: '15px', 
                              padding: '16px', 
                              textAlign: 'center',
                              minHeight: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}>
                              {section.imagePreview1 ? (
                                <div style={{ position: 'relative' }}>
                                  <button
                                    onClick={() => {
                                      URL.revokeObjectURL(section.imagePreview1);
                                      updateSection(section.id, 'image1', '');
                                      updateSection(section.id, 'imagePreview1', '');
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '0px',
                                      right: '0px',
                                      background: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '24px',
                                      height: '24px',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      zIndex: 10
                                    }}
                                  >
                                    ×
                                  </button>
                                  <img 
                                    src={section.imagePreview1} 
                                    alt={generateAltText(section.image1, 'Zdjęcie produktu')}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '120px', 
                                      borderRadius: '8px',
                                      marginBottom: '8px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                                    {section.image1}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                    Ścieżka: {generateImagePath(section.image1)}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🖼️</div>
                                  <p style={{ color: '#6b7280', margin: 0 }}>Kliknij aby dodać zdjęcie</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(section.id, 'image1', e)}
                                style={{ display: 'none' }}
                                ref={(el) => {
                                  if (el) fileInputRefs.current[`${section.id}-image1`] = el;
                                }}
                              />
                              <button
                                onClick={() => fileInputRefs.current[`${section.id}-image1`]?.click()}
                                style={{
                                  marginTop: '8px',
                                  padding: '8px 16px',
                                  backgroundColor: '#f87171',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'all 0.2s ease',
                                  boxShadow: '0 2px 4px rgba(248, 113, 113, 0.2)'
                                }}
                              >
                                Wybierz zdjęcie
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'image-only' && (
                        <div style={{ 
                          border: '2px dashed #d1d5db', 
                          borderRadius: '15px', 
                          padding: '16px', 
                          textAlign: 'center',
                          minHeight: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          {section.imagePreview1 ? (
                            <div style={{ position: 'relative' }}>
                              <button
                                onClick={() => {
                                  URL.revokeObjectURL(section.imagePreview1);
                                  updateSection(section.id, 'image1', '');
                                  updateSection(section.id, 'imagePreview1', '');
                                }}
                                style={{
                                  position: 'absolute',
                                  top: '0px',
                                  right: '0px',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  zIndex: 10
                                }}
                              >
                                ×
                              </button>
                              <img 
                                src={section.imagePreview1} 
                                alt={generateAltText(section.image1, 'Zdjęcie produktu')}
                                style={{ 
                                  maxWidth: '100%', 
                                  maxHeight: '160px', 
                                  borderRadius: '8px',
                                  marginBottom: '8px',
                                  objectFit: 'cover'
                                }} 
                              />
                              <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                                {section.image1}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Ścieżka: {generateImagePath(section.image1)}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontSize: '64px', marginBottom: '8px' }}>📸</div>
                              <p style={{ color: '#6b7280', margin: 0 }}>Kliknij aby dodać zdjęcie</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(section.id, 'image1', e)}
                            style={{ display: 'none' }}
                            ref={(el) => {
                              if (el) fileInputRefs.current[`${section.id}-image1`] = el;
                            }}
                          />
                          <button
                            onClick={() => fileInputRefs.current[`${section.id}-image1`]?.click()}
                            style={{
                              marginTop: '8px',
                              padding: '8px 16px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Wybierz zdjęcie
                          </button>
                        </div>
                      )}
                      
                      {section.type === 'two-images' && (
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ 
                              border: '2px dashed #d1d5db', 
                              borderRadius: '15px', 
                              padding: '16px', 
                              textAlign: 'center',
                              minHeight: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}>
                              {section.imagePreview1 ? (
                                <div style={{ position: 'relative' }}>
                                  <button
                                    onClick={() => {
                                      URL.revokeObjectURL(section.imagePreview1);
                                      updateSection(section.id, 'image1', '');
                                      updateSection(section.id, 'imagePreview1', '');
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '0px',
                                      right: '0px',
                                      background: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '20px',
                                      height: '20px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      zIndex: 10
                                    }}
                                  >
                                    ×
                                  </button>
                                  <img 
                                    src={section.imagePreview1} 
                                    alt={generateAltText(section.image1, 'Zdjęcie produktu 1')}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '100px', 
                                      borderRadius: '8px',
                                      marginBottom: '4px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '11px', color: '#374151', marginBottom: '2px' }}>
                                    {section.image1}
                                  </div>
                                  <div style={{ fontSize: '9px', color: '#6b7280' }}>
                                    {generateImagePath(section.image1)}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ fontSize: '32px', marginBottom: '4px' }}>🖼️</div>
                                  <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Zdjęcie 1</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(section.id, 'image1', e)}
                                style={{ display: 'none' }}
                                ref={(el) => {
                                  if (el) fileInputRefs.current[`${section.id}-image1`] = el;
                                }}
                              />
                              <button
                                onClick={() => fileInputRefs.current[`${section.id}-image1`]?.click()}
                                style={{
                                  marginTop: '8px',
                                  padding: '6px 12px',
                                  backgroundColor: '#f87171',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Wybierz
                              </button>
                            </div>
                          </div>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ 
                              border: '2px dashed #d1d5db', 
                              borderRadius: '15px', 
                              padding: '16px', 
                              textAlign: 'center',
                              minHeight: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }}>
                              {section.imagePreview2 ? (
                                <div style={{ position: 'relative' }}>
                                  <button
                                    onClick={() => {
                                      URL.revokeObjectURL(section.imagePreview2);
                                      updateSection(section.id, 'image2', '');
                                      updateSection(section.id, 'imagePreview2', '');
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '0px',
                                      right: '0px',
                                      background: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '20px',
                                      height: '20px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      zIndex: 10
                                    }}
                                  >
                                    ×
                                  </button>
                                  <img 
                                    src={section.imagePreview2} 
                                    alt={generateAltText(section.image2, 'Zdjęcie produktu 2')}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '100px', 
                                      borderRadius: '8px',
                                      marginBottom: '4px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '11px', color: '#374151', marginBottom: '2px' }}>
                                    {section.image2}
                                  </div>
                                  <div style={{ fontSize: '9px', color: '#6b7280' }}>
                                    {generateImagePath(section.image2)}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ fontSize: '32px', marginBottom: '4px' }}>🖼️</div>
                                  <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Zdjęcie 2</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(section.id, 'image2', e)}
                                style={{ display: 'none' }}
                                ref={(el) => {
                                  if (el) fileInputRefs.current[`${section.id}-image2`] = el;
                                }}
                              />
                              <button
                                onClick={() => fileInputRefs.current[`${section.id}-image2`]?.click()}
                                style={{
                                  marginTop: '8px',
                                  padding: '6px 12px',
                                  backgroundColor: '#f87171',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Wybierz
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.type === 'icons-grid' && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'center',
                            gap: '20px',
                            marginBottom: '20px'
                          }}>
                            {section.icons?.map((icon, iconIndex) => (
                              <div key={icon.id} style={{ 
                                width: '200px', 
                                padding: '15px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                position: 'relative'
                              }}>
                                <button
                                  onClick={() => removeIconFromGrid(section.id, iconIndex)}
                                  style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  ×
                                </button>
                                
                                <div style={{ marginBottom: '10px', position: 'relative' }}>
                                  {icon.imagePreview ? (
                                    <div style={{ position: 'relative' }}>
                                      <img 
                                        src={icon.imagePreview} 
                                        alt={generateAltText(icon.image, icon.title)}
                                        style={{ 
                                          width: '60px', 
                                          height: '60px', 
                                          objectFit: 'cover', 
                                          borderRadius: '8px',
                                          margin: '0 auto',
                                          display: 'block'
                                        }} 
                                      />
                                      <button
                                        onClick={() => removeIconImage(section.id, iconIndex)}
                                        style={{
                                          position: 'absolute',
                                          top: '-5px',
                                          right: 'calc(50% - 35px)',
                                          background: '#ef4444',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '50%',
                                          width: '16px',
                                          height: '16px',
                                          cursor: 'pointer',
                                          fontSize: '10px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={icon.icon}
                                      onChange={(e) => updateIconsGrid(section.id, iconIndex, 'icon', e.target.value)}
                                      style={{
                                        fontSize: '48px',
                                        border: 'none',
                                        textAlign: 'center',
                                        width: '100%',
                                        background: 'transparent',
                                        outline: 'none'
                                      }}
                                      placeholder="📌"
                                    />
                                  )}
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleIconImageUpload(section.id, iconIndex, e)}
                                    style={{ display: 'none' }}
                                    ref={(el) => {
                                      if (el) fileInputRefs.current[`${section.id}-icon-${iconIndex}`] = el;
                                    }}
                                  />
                                  <button
                                    onClick={() => fileInputRefs.current[`${section.id}-icon-${iconIndex}`]?.click()}
                                    style={{
                                      padding: '4px 8px',
                                      backgroundColor: icon.imagePreview ? '#6b7280' : '#10b981',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '10px',
                                      fontWeight: '500',
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    {icon.imagePreview ? '🔄 Zmień zdjęcie' : '📸 Dodaj zdjęcie'}
                                  </button>
                                </div>
                                
                                <input
                                  type="text"
                                  value={icon.title}
                                  onChange={(e) => updateIconsGrid(section.id, iconIndex, 'title', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '5px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: '5px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                  }}
                                  placeholder="Tytuł"
                                />
                                
                                <textarea
                                  value={icon.description}
                                  onChange={(e) => updateIconsGrid(section.id, iconIndex, 'description', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '5px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    resize: 'vertical',
                                    minHeight: '60px',
                                    fontSize: '12px',
                                    boxSizing: 'border-box'
                                  }}
                                  placeholder="Opis funkcji"
                                />

                                {icon.image && (
                                  <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>
                                    Ścieżka: {generateImagePath(icon.image)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => addIconToGrid(section.id)}
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#f87171',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(248, 113, 113, 0.2)'
                            }}
                          >
                            + Dodaj ikonę
                          </button>
                        </div>
                      )}

                      {section.type === 'features-grid' && (
                        <div>
                          <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '15px',
                            marginBottom: '20px'
                          }}>
                            {section.features?.map((feature, featureIndex) => (
                              <div key={feature.id} style={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '15px',
                                padding: '15px',
                                position: 'relative'
                              }}>
                                <button
                                  onClick={() => removeFeatureFromGrid(section.id, featureIndex)}
                                  style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  ×
                                </button>

                                <div style={{ 
                                  flexShrink: 0,
                                  width: '60px',
                                  height: '60px',
                                  position: 'relative'
                                }}>
                                  {feature.imagePreview ? (
                                    <div style={{ position: 'relative' }}>
                                      <img 
                                        src={feature.imagePreview} 
                                        alt={generateAltText(feature.image, feature.title)}
                                        style={{ 
                                          width: '60px', 
                                          height: '60px', 
                                          objectFit: 'cover', 
                                          borderRadius: '8px'
                                        }} 
                                      />
                                      <button
                                        onClick={() => removeFeatureImage(section.id, featureIndex)}
                                        style={{
                                          position: 'absolute',
                                          top: '-5px',
                                          right: '-5px',
                                          background: '#ef4444',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '50%',
                                          width: '16px',
                                          height: '16px',
                                          cursor: 'pointer',
                                          fontSize: '10px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ) : (
                                    <div style={{
                                      width: '60px',
                                      height: '60px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderRadius: '8px',
                                      position: 'relative'
                                    }}>
                                      <input
                                        type="text"
                                        value={feature.icon}
                                        onChange={(e) => updateFeaturesGrid(section.id, featureIndex, 'icon', e.target.value)}
                                        style={{
                                          fontSize: '24px',
                                          border: 'none',
                                          textAlign: 'center',
                                          width: '50px',
                                          background: 'transparent',
                                          outline: 'none'
                                        }}
                                        placeholder="🔇"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div style={{ flex: 1 }}>
                                  <input
                                    type="text"
                                    value={feature.title}
                                    onChange={(e) => updateFeaturesGrid(section.id, featureIndex, 'title', e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '5px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '4px',
                                      fontWeight: 'bold',
                                      marginBottom: '5px',
                                      fontSize: '16px',
                                      boxSizing: 'border-box'
                                    }}
                                    placeholder="Tytuł funkcji"
                                  />
                                  
                                  <textarea
                                    value={feature.description}
                                    onChange={(e) => updateFeaturesGrid(section.id, featureIndex, 'description', e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '5px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '4px',
                                      resize: 'vertical',
                                      minHeight: '60px',
                                      fontSize: '14px',
                                      boxSizing: 'border-box'
                                    }}
                                    placeholder="Opis funkcji"
                                  />

                                  <div style={{ marginTop: '10px' }}>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFeatureImageUpload(section.id, featureIndex, e)}
                                      style={{ display: 'none' }}
                                      ref={(el) => {
                                        if (el) fileInputRefs.current[`${section.id}-feature-${featureIndex}`] = el;
                                      }}
                                    />
                                    <button
                                      onClick={() => fileInputRefs.current[`${section.id}-feature-${featureIndex}`]?.click()}
                                      style={{
                                        padding: '4px 8px',
                                        backgroundColor: feature.imagePreview ? '#6b7280' : '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                        marginRight: '8px',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      {feature.imagePreview ? '🔄 Zmień zdjęcie' : '📸 Dodaj zdjęcie'}
                                    </button>
                                  </div>

                                  {feature.image && (
                                    <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>
                                      Ścieżka: {generateImagePath(feature.image)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => addFeatureToGrid(section.id)}
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#f87171',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(248, 113, 113, 0.2)'
                              }}
                            >
                              + Dodaj funkcję
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sections.length > 0 && (
              <div style={{ marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Eksportuj opis</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(107, 114, 128, 0.2)'
                      }}
                    >
                      👁️ {showPreview ? 'Ukryj podgląd' : 'Pokaż podgląd'}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#f87171',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(248, 113, 113, 0.2)'
                      }}
                    >
                      📋 Skopiuj HTML
                    </button>
                    <button
                      onClick={downloadHTML}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#f87171',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(248, 113, 113, 0.2)'
                      }}
                    >
                      💾 Pobierz HTML
                    </button>
                  </div>
                </div>

                {showPreview && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>Podgląd na żywo:</h4>
                    <div 
                      style={{ 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px', 
                        padding: '16px', 
                        backgroundColor: 'white' 
                      }}
                      dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }} 
                    />
                    
                    <h4 style={{ fontWeight: '500', marginBottom: '8px', marginTop: '16px' }}>Kod HTML (z właściwymi ścieżkami):</h4>
                    <textarea
                      readOnly
                      value={generateHTML()}
                      style={{
                        width: '100%',
                        height: '160px',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: '#f9fafb',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllegroDescriptionEditor;
