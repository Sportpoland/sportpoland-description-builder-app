import React, { useState, useRef } from 'react';

const AllegroDescriptionEditor = () => {
  const [sections, setSections] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [productBrand, setProductBrand] = useState('');
  const [productCode, setProductCode] = useState('');
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRefs = useRef({});

  const sectionTypes = [
    { id: 'text-only', name: 'Sam opis', icon: '📝' },
    { id: 'image-left', name: 'Zdjęcie po lewej, tekst po prawej', icon: '🖼️' },
    { id: 'image-right', name: 'Zdjęcie po prawej, tekst po lewej', icon: '🖼️' },
    { id: 'image-only', name: 'Samo zdjęcie', icon: '📸' },
    { id: 'two-images', name: 'Dwa zdjęcia obok siebie', icon: '🖼️' },
    { id: 'icons-grid', name: 'Siatka ikon z opisami', icon: '⊞' }
  ];

  // Historia dla przycisku wstecz
  const saveToHistory = () => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({
      sections: JSON.parse(JSON.stringify(sections)),
      productBrand,
      productCode
    });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const goBack = () => {
    if (currentStep > 0) {
      const previousState = history[currentStep - 1];
      setSections(previousState.sections);
      setProductBrand(previousState.productBrand);
      setProductCode(previousState.productCode);
      setCurrentStep(currentStep - 1);
    }
  };

  const addSection = (type) => {
    saveToHistory();
    const newSection = {
      id: Date.now(),
      type,
      text: '',
      image1: '',
      image2: '',
      imagePreview1: '', // Dla podglądu na żywo
      imagePreview2: '', // Dla podglądu na żywo
      icons: type === 'icons-grid' ? [
        { id: 1, icon: '✓', title: 'Tytuł 1', description: 'Opis funkcji 1' },
        { id: 2, icon: '⚡', title: 'Tytuł 2', description: 'Opis funkcji 2' },
        { id: 3, icon: '🔒', title: 'Tytuł 3', description: 'Opis funkcji 3' }
      ] : undefined,
      textFormatting: {
        fontSize: '14',
        textAlign: 'left'
      },
      backgroundColor: '#ffffff'
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (id) => {
    saveToHistory();
    // Wyczyść blob URLs aby uniknąć wycieków pamięci
    const sectionToDelete = sections.find(section => section.id === id);
    if (sectionToDelete) {
      if (sectionToDelete.imagePreview1) {
        URL.revokeObjectURL(sectionToDelete.imagePreview1);
      }
      if (sectionToDelete.imagePreview2) {
        URL.revokeObjectURL(sectionToDelete.imagePreview2);
      }
    }
    setSections(sections.filter(section => section.id !== id));
  };

  const moveSection = (id, direction) => {
    const currentIndex = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) return;

    saveToHistory();
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newSections[currentIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[currentIndex]];
    setSections(newSections);
  };

  const copySection = (id) => {
    saveToHistory();
    const sectionToCopy = sections.find(section => section.id === id);
    if (sectionToCopy) {
      const copiedSection = {
        ...sectionToCopy,
        id: Date.now(),
        // Nie kopiujemy blob URLs - użytkownik będzie musiał ponownie dodać zdjęcia
        imagePreview1: '',
        imagePreview2: ''
      };
      setSections([...sections, copiedSection]);
    }
  };

  const updateSection = (id, field, value) => {
    console.log('🔄 updateSection wywołane:', id, field, value);
    setSections(sections.map(section => {
      if (section.id === id) {
        const updated = { ...section, [field]: value };
        console.log('📝 Sekcja po aktualizacji:', updated);
        return updated;
      }
      return section;
    }));
  };

  const updateIconsGrid = (sectionId, iconIndex, field, value) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newIcons = [...section.icons];
        newIcons[iconIndex] = { ...newIcons[iconIndex], [field]: value };
        return { ...section, icons: newIcons };
      }
      return section;
    }));
  };

  const addIconToGrid = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newIcon = {
          id: Date.now(),
          icon: '📌',
          title: 'Nowy tytuł',
          description: 'Nowy opis'
        };
        return { ...section, icons: [...section.icons, newIcon] };
      }
      return section;
    }));
  };

  const removeIconFromGrid = (sectionId, iconIndex) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newIcons = section.icons.filter((_, index) => index !== iconIndex);
        return { ...section, icons: newIcons };
      }
      return section;
    }));
  };

  const updateTextFormatting = (id, property, value) => {
    setSections(sections.map(section => 
      section.id === id 
        ? { 
            ...section, 
            textFormatting: { ...section.textFormatting, [property]: value }
          } 
        : section
    ));
  };

  const handleImageUpload = (sectionId, imageField, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageName = file.name;
      const imageURL = URL.createObjectURL(file);
      
      console.log('📸 Dodaję zdjęcie:', imageName, 'do sekcji:', sectionId, 'pole:', imageField);
      
      // Aktualizujemy sekcję jednym setState
      setSections(prevSections => {
        const newSections = prevSections.map(section => {
          if (section.id === sectionId) {
            const previewField = imageField === 'image1' ? 'imagePreview1' : 'imagePreview2';
            const updatedSection = {
              ...section,
              [imageField]: imageName,
              [previewField]: imageURL
            };
            console.log('✅ Sekcja zaktualizowana:', {
              id: updatedSection.id,
              image1: updatedSection.image1,
              image2: updatedSection.image2,
              imagePreview1: updatedSection.imagePreview1 ? 'JEST' : 'BRAK',
              imagePreview2: updatedSection.imagePreview2 ? 'JEST' : 'BRAK'
            });
            return updatedSection;
          }
          return section;
        });
        console.log('🔄 Wszystkie sekcje po aktualizacji:', newSections.map(s => ({
          id: s.id,
          type: s.type,
          image1: s.image1,
          image2: s.image2
        })));
        return newSections;
      });
    }
  };

  const formatText = (sectionId, command, value = null) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById(`editor-${sectionId}`);
    if (editor) {
      updateSection(sectionId, 'text', editor.innerHTML);
    }
  };

  // Funkcja do wklejania czystego tekstu
  const handlePaste = (e, sectionId) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    const editor = document.getElementById(`editor-${sectionId}`);
    if (editor) {
      updateSection(sectionId, 'text', editor.innerHTML);
    }
  };

  const handleTextChange = (sectionId, content) => {
    updateSection(sectionId, 'text', content);
  };

  const generateImagePath = (imageName) => {
    if (!imageName) return '';
    if (!productBrand || !productCode) {
      console.warn('Marka produktu lub kod produktu nie są wypełnione. Używam tylko nazwy pliku:', imageName);
      return imageName;
    }
    return `/data/include/cms/sportpoland_com/pliki-opisy/${productBrand}/${productCode}/${imageName}`;
  };

  // Funkcja do generowania HTML z podglądem na żywo (dla podglądu w interfejsie)
  const generatePreviewHTML = () => {
    let html = '';
    
    sections.forEach(section => {
      const containerStyle = `background-color: ${section.backgroundColor}; margin-bottom: 20px; padding: 20px; border-radius: 15px;`;
      
      switch (section.type) {
        case 'text-only':
          html += `<div style="${containerStyle}">
            <div style="font-size: ${section.textFormatting.fontSize}px; text-align: ${section.textFormatting.textAlign};">${section.text}</div>
          </div>\n`;
          break;
          
        case 'image-left':
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
              ${section.imagePreview1 ? `<img src="${section.imagePreview1}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 10px;">
              <div style="font-size: ${section.textFormatting.fontSize}px; text-align: ${section.textFormatting.textAlign};">${section.text}</div>
            </div>
          </div>\n`;
          break;
          
        case 'image-right':
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
              <div style="font-size: ${section.textFormatting.fontSize}px; text-align: ${section.textFormatting.textAlign};">${section.text}</div>
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 10px;">
              ${section.imagePreview1 ? `<img src="${section.imagePreview1}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'image-only':
          html += `<div style="text-align: center; ${containerStyle}">
            ${section.imagePreview1 ? `<img src="${section.imagePreview1}" style="max-width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
          </div>\n`;
          break;
          
        case 'two-images':
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 5px; text-align: center;">
              ${section.imagePreview1 ? `<img src="${section.imagePreview1}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 5px; text-align: center;">
              ${section.imagePreview2 ? `<img src="${section.imagePreview2}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'icons-grid':
          const iconsHtml = section.icons.map(icon => `
            <div style="display: inline-block; width: 200px; text-align: center; margin: 10px; vertical-align: top;">
              <div style="font-size: 48px; margin-bottom: 10px;">${icon.icon}</div>
              <h4 style="margin: 5px 0; font-weight: bold;">${icon.title}</h4>
              <p style="margin: 0; font-size: 14px; color: #666;">${icon.description}</p>
            </div>
          `).join('');
          html += `<div style="text-align: center; ${containerStyle}">
            ${iconsHtml}
          </div>\n`;
          break;
          
        default:
          break;
      }
    });
    
    return html;
  };

  // Funkcja do generowania finalnego HTML (dla eksportu z właściwymi ścieżkami)
  const generateHTML = () => {
    let html = '';
    
    sections.forEach(section => {
      console.log('Przetwarzam sekcję:', section.type, 'image1:', section.image1, 'image2:', section.image2);
      
      const containerStyle = `background-color: ${section.backgroundColor}; margin-bottom: 20px; padding: 20px; border-radius: 15px;`;
      
      switch (section.type) {
        case 'text-only':
          html += `<div style="${containerStyle}">
            <div style="font-size: ${section.textFormatting.fontSize}px; text-align: ${section.textFormatting.textAlign};">${section.text}</div>
          </div>\n`;
          break;
          
        case 'image-left':
          const imagePath1 = generateImagePath(section.image1);
          console.log('Ścieżka obrazu 1:', imagePath1);
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
              ${section.image1 ? `<img src="${imagePath1}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 10px;">
              <div style="font-size: ${section.textFormatting.fontSize}px; text-align: ${section.textFormatting.textAlign};">${section.text}</div>
            </div>
          </div>\n`;
          break;
          
        case 'image-right':
          const imagePath2 = generateImagePath(section.image1);
          console.log('Ścieżka obrazu 2:', imagePath2);
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
              <div style="font-size: ${section.textFormatting.fontSize}px; text-align: ${section.textFormatting.textAlign};">${section.text}</div>
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 10px;">
              ${section.image1 ? `<img src="${imagePath2}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'image-only':
          const imagePath3 = generateImagePath(section.image1);
          console.log('Ścieżka obrazu 3:', imagePath3);
          html += `<div style="text-align: center; ${containerStyle}">
            ${section.image1 ? `<img src="${imagePath3}" style="max-width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
          </div>\n`;
          break;
          
        case 'two-images':
          const imagePath4 = generateImagePath(section.image1);
          const imagePath5 = generateImagePath(section.image2);
          console.log('Ścieżka obrazu 4:', imagePath4, 'Ścieżka obrazu 5:', imagePath5);
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 5px; text-align: center;">
              ${section.image1 ? `<img src="${imagePath4}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 5px; text-align: center;">
              ${section.image2 ? `<img src="${imagePath5}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'icons-grid':
          const iconsHtml = section.icons.map(icon => `
            <div style="display: inline-block; width: 200px; text-align: center; margin: 10px; vertical-align: top;">
              <div style="font-size: 48px; margin-bottom: 10px;">${icon.icon}</div>
              <h4 style="margin: 5px 0; font-weight: bold;">${icon.title}</h4>
              <p style="margin: 0; font-size: 14px; color: #666;">${icon.description}</p>
            </div>
          `).join('');
          html += `<div style="text-align: center; ${containerStyle}">
            ${iconsHtml}
          </div>\n`;
          break;
          
        default:
          break;
      }
    });
    
    return html;
  };

  const copyToClipboard = async () => {
    console.log('Sekcje przed eksportem:', sections);
    const html = generateHTML();
    console.log('Wygenerowany HTML:', html);
    try {
      await navigator.clipboard.writeText(html);
      alert('HTML skopiowany do schowka!');
    } catch (err) {
      console.error('Błąd kopiowania:', err);
      alert('Błąd kopiowania do schowka');
    }
  };

  const downloadHTML = () => {
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
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Edytor Opisów Produktów
              </h1>
              {currentStep > 0 && (
                <button
                  onClick={goBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ⬅️ Cofnij
                </button>
              )}
            </div>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Stwórz profesjonalny opis produktu w stylu Allegro
            </p>
          </div>

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
                    padding: '8px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
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

                    {['text-only', 'image-left', 'image-right'].includes(section.type) && (
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '8px 16px', 
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <button
                          onClick={() => formatText(section.id, 'bold')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          B
                        </button>
                        
                        <button
                          onClick={() => formatText(section.id, 'italic')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontStyle: 'italic'
                          }}
                        >
                          I
                        </button>

                        <button
                          onClick={() => formatText(section.id, 'underline')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          U
                        </button>

                        <button
                          onClick={() => formatText(section.id, 'insertUnorderedList')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          • Lista
                        </button>

                        <button
                          onClick={() => formatText(section.id, 'formatBlock', 'h1')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          H1
                        </button>

                        <button
                          onClick={() => formatText(section.id, 'formatBlock', 'h2')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          H2
                        </button>

                        <button
                          onClick={() => formatText(section.id, 'formatBlock', 'p')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          P
                        </button>
                        
                        <select
                          value={section.textFormatting.fontSize}
                          onChange={(e) => updateTextFormatting(section.id, 'fontSize', e.target.value)}
                          style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                        >
                          <option value="12">12px</option>
                          <option value="14">14px</option>
                          <option value="16">16px</option>
                          <option value="18">18px</option>
                          <option value="20">20px</option>
                          <option value="24">24px</option>
                        </select>
                        
                        <select
                          value={section.textFormatting.textAlign}
                          onChange={(e) => updateTextFormatting(section.id, 'textAlign', e.target.value)}
                          style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                        >
                          <option value="left">Do lewej</option>
                          <option value="center">Na środek</option>
                          <option value="right">Do prawej</option>
                          <option value="justify">Wyjustuj</option>
                        </select>
                      </div>
                    )}

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
                          padding: '4px 8px',
                          fontSize: '12px',
                          backgroundColor: '#e5e7eb',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>

                    <div style={{ backgroundColor: section.backgroundColor, padding: '16px', borderRadius: '0 0 15px 15px' }}>
                      {section.type === 'text-only' && (
                        <div style={{ position: 'relative' }}>
                          <div
                            id={`editor-${section.id}`}
                            contentEditable
                            onInput={(e) => handleTextChange(section.id, e.target.innerHTML)}
                            onPaste={(e) => handlePaste(e, section.id)}
                            style={{
                              minHeight: '120px',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: `${section.textFormatting.fontSize}px`,
                              textAlign: section.textFormatting.textAlign,
                              outline: 'none',
                              backgroundColor: 'white'
                            }}
                            dangerouslySetInnerHTML={{ __html: section.text }}
                          />
                          {!section.text && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                color: '#9ca3af',
                                pointerEvents: 'none',
                                fontSize: `${section.textFormatting.fontSize}px`,
                                padding: '8px'
                              }}
                            >
                              Wprowadź tekst...
                            </div>
                          )}
                        </div>
                      )}
                      
                      {section.type === 'image-left' && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '50%' }}>
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
                                    alt={section.image1}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '120px', 
                                      borderRadius: '8px',
                                      marginBottom: '8px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                                    Plik: {section.image1 || 'BRAK NAZWY PLIKU'}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                    Ścieżka: {generateImagePath(section.image1) || 'BRAK ŚCIEŻKI'}
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
                                  padding: '6px 12px',
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
                          </div>
                          <div style={{ width: '50%' }}>
                            <div style={{ position: 'relative' }}>
                              <div
                                id={`editor-${section.id}`}
                                contentEditable
                                onInput={(e) => handleTextChange(section.id, e.target.innerHTML)}
                                onPaste={(e) => handlePaste(e, section.id)}
                                style={{
                                  minHeight: '150px',
                                  padding: '8px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: `${section.textFormatting.fontSize}px`,
                                  textAlign: section.textFormatting.textAlign,
                                  outline: 'none',
                                  backgroundColor: 'white'
                                }}
                                dangerouslySetInnerHTML={{ __html: section.text }}
                              />
                              {!section.text && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    color: '#9ca3af',
                                    pointerEvents: 'none',
                                    fontSize: `${section.textFormatting.fontSize}px`,
                                    padding: '8px'
                                  }}
                                >
                                  Wprowadź tekst...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'image-right' && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '50%' }}>
                            <div style={{ position: 'relative' }}>
                              <div
                                id={`editor-${section.id}`}
                                contentEditable
                                onInput={(e) => handleTextChange(section.id, e.target.innerHTML)}
                                onPaste={(e) => handlePaste(e, section.id)}
                                style={{
                                  minHeight: '150px',
                                  padding: '8px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: `${section.textFormatting.fontSize}px`,
                                  textAlign: section.textFormatting.textAlign,
                                  outline: 'none',
                                  backgroundColor: 'white'
                                }}
                                dangerouslySetInnerHTML={{ __html: section.text }}
                              />
                              {!section.text && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    color: '#9ca3af',
                                    pointerEvents: 'none',
                                    fontSize: `${section.textFormatting.fontSize}px`,
                                    padding: '8px'
                                  }}
                                >
                                  Wprowadź tekst...
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ width: '50%' }}>
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
                                    alt={section.image1}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '120px', 
                                      borderRadius: '8px',
                                      marginBottom: '8px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                                    Plik: {section.image1 || 'BRAK NAZWY PLIKU'}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                    Ścieżka: {generateImagePath(section.image1) || 'BRAK ŚCIEŻKI'}
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
                                  padding: '6px 12px',
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
                                alt={section.image1}
                                style={{ 
                                  maxWidth: '100%', 
                                  maxHeight: '160px', 
                                  borderRadius: '8px',
                                  marginBottom: '8px',
                                  objectFit: 'cover'
                                }} 
                              />
                              <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                                Plik: {section.image1 || 'BRAK NAZWY PLIKU'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Ścieżka: {generateImagePath(section.image1) || 'BRAK ŚCIEŻKI'}
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
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '50%' }}>
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
                                    alt={section.image1}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '100px', 
                                      borderRadius: '8px',
                                      marginBottom: '4px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '11px', color: '#374151', marginBottom: '2px' }}>
                                    Plik1: {section.image1 || 'BRAK'}
                                  </div>
                                  <div style={{ fontSize: '9px', color: '#6b7280' }}>
                                    {generateImagePath(section.image1) || 'BRAK ŚCIEŻKI'}
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
                                  padding: '4px 8px',
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Wybierz
                              </button>
                            </div>
                          </div>
                          <div style={{ width: '50%' }}>
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
                                    alt={section.image2}
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '100px', 
                                      borderRadius: '8px',
                                      marginBottom: '4px',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  <div style={{ fontSize: '11px', color: '#374151', marginBottom: '2px' }}>
                                    Plik2: {section.image2 || 'BRAK'}
                                  </div>
                                  <div style={{ fontSize: '9px', color: '#6b7280' }}>
                                    {generateImagePath(section.image2) || 'BRAK ŚCIEŻKI'}
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
                                  padding: '4px 8px',
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
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
                            {section.icons.map((icon, iconIndex) => (
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
                                
                                <input
                                  type="text"
                                  value={icon.icon}
                                  onChange={(e) => updateIconsGrid(section.id, iconIndex, 'icon', e.target.value)}
                                  style={{
                                    fontSize: '48px',
                                    border: 'none',
                                    textAlign: 'center',
                                    width: '100%',
                                    marginBottom: '10px',
                                    background: 'transparent',
                                    outline: 'none'
                                  }}
                                  placeholder="📌"
                                />
                                
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
                                    fontSize: '14px'
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
                              </div>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => addIconToGrid(section.id)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            + Dodaj ikonę
                          </button>
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
                        padding: '8px 16px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      👁️ {showPreview ? 'Ukryj podgląd' : 'Pokaż podgląd'}
                    </button>
                    <button
                      onClick={() => {
                        console.log('🔍 DEBUG - Aktualny stan sekcji:', sections.map(s => ({
                          id: s.id,
                          type: s.type,
                          image1: s.image1 || 'BRAK',
                          image2: s.image2 || 'BRAK',
                          hasPreview1: !!s.imagePreview1,
                          hasPreview2: !!s.imagePreview2
                        })));
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      🐛 Debug Stan
                    </button>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
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
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
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
