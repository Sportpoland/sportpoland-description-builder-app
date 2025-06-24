import React, { useState, useRef } from 'react';

const AllegroDescriptionEditor = () => {
  const [sections, setSections] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRefs = useRef({});

  const sectionTypes = [
    { id: 'text-only', name: 'Sam opis', icon: '📝' },
    { id: 'image-left', name: 'Zdjęcie po lewej, tekst po prawej', icon: '🖼️' },
    { id: 'image-right', name: 'Zdjęcie po prawej, tekst po lewej', icon: '🖼️' },
    { id: 'image-only', name: 'Samo zdjęcie', icon: '📸' },
    { id: 'two-images', name: 'Dwa zdjęcia obok siebie', icon: '🖼️' },
    { id: 'icons-grid', name: 'Siatka ikon z opisami', icon: '⊞' }
  ];

  const addSection = (type) => {
    const newSection = {
      id: Date.now(),
      type,
      text: '',
      image1: '',
      image2: '',
      icons: type === 'icons-grid' ? [] : undefined,
      textFormatting: {
        bold: false,
        italic: false,
        underline: false,
        fontSize: '14',
        textAlign: 'left',
        headingLevel: 'p'
      },
      backgroundColor: '#ffffff'
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const copySection = (id) => {
    const sectionToCopy = sections.find(section => section.id === id);
    const copiedSection = {
      ...sectionToCopy,
      id: Date.now()
    };
    const index = sections.findIndex(section => section.id === id);
    const newSections = [...sections];
    newSections.splice(index + 1, 0, copiedSection);
    setSections(newSections);
  };

  const moveSection = (id, direction) => {
    const index = sections.findIndex(section => section.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) {
      return;
    }
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const updateIcon = (sectionId, iconId, field, value) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            icons: section.icons.map(icon => 
              icon.id === iconId ? { ...icon, [field]: value } : icon
            )
          } 
        : section
    ));
  };

  const addIcon = (sectionId) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            icons: [...(section.icons || []), { 
              id: Date.now(), 
              icon: '', 
              title: '', 
              description: '' 
            }]
          } 
        : section
    ));
  };

  const removeIcon = (sectionId, iconId) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            icons: section.icons.filter(icon => icon.id !== iconId)
          } 
        : section
    ));
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
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSection(sectionId, imageField, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateHTML = () => {
    let html = '';
    
    sections.forEach(section => {
      const textStyle = `font-size: ${section.textFormatting.fontSize}px; text-align: ${section.textFormatting.textAlign}; ${section.textFormatting.bold ? 'font-weight: bold;' : ''} ${section.textFormatting.italic ? 'font-style: italic;' : ''} ${section.textFormatting.underline ? 'text-decoration: underline;' : ''}`;
      const containerStyle = `background-color: ${section.backgroundColor}; margin-bottom: 20px; padding: 10px;`;
      
      const generateTextElement = (text, style) => {
        const tag = section.textFormatting.headingLevel;
        return `<${tag} style="${style}">${text}</${tag}>`;
      };
      
      switch (section.type) {
        case 'text-only':
          html += `<div style="${containerStyle}">
            ${generateTextElement(section.text, textStyle)}
          </div>\n`;
          break;
          
        case 'image-left':
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
              ${section.image1 ? `<img src="${section.image1}" style="width: 100%; height: auto;" alt="">` : ''}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 10px;">
              ${generateTextElement(section.text, textStyle)}
            </div>
          </div>\n`;
          break;
          
        case 'image-right':
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
              ${generateTextElement(section.text, textStyle)}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 10px;">
              ${section.image1 ? `<img src="${section.image1}" style="width: 100%; height: auto;" alt="">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'image-only':
          html += `<div style="text-align: center; ${containerStyle}">
            ${section.image1 ? `<img src="${section.image1}" style="max-width: 100%; height: auto;" alt="">` : ''}
          </div>\n`;
          break;
          
        case 'two-images':
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 5px; text-align: center;">
              ${section.image1 ? `<img src="${section.image1}" style="width: 100%; height: auto;" alt="">` : ''}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 5px; text-align: center;">
              ${section.image2 ? `<img src="${section.image2}" style="width: 100%; height: auto;" alt="">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'icons-grid':
          const iconsPerRow = Math.ceil(Math.sqrt((section.icons || []).length));
          const iconWidth = `${100 / iconsPerRow}%`;
          html += `<div style="${containerStyle}">
            <div style="display: table; width: 100%;">`;
          
          (section.icons || []).forEach((icon, index) => {
            if (index % iconsPerRow === 0) {
              html += `<div style="display: table-row;">`;
            }
            html += `<div style="display: table-cell; width: ${iconWidth}; vertical-align: top; text-align: center; padding: 10px;">
              ${icon.icon ? `<img src="${icon.icon}" style="width: 64px; height: 64px; margin-bottom: 10px;" alt="${icon.title}">` : ''}
              ${icon.title ? `<h4 style="margin: 5px 0; font-size: 16px; font-weight: bold;">${icon.title}</h4>` : ''}
              ${icon.description ? `<p style="margin: 0; font-size: 14px; color: #666;">${icon.description}</p>` : ''}
            </div>`;
            if (index % iconsPerRow === iconsPerRow - 1 || index === (section.icons || []).length - 1) {
              html += `</div>`;
            }
          });
          
          html += `</div></div>\n`;
          break;
        default:
          break;
      }
    });
    
    return html;
  };

  const copyToClipboard = () => {
    const html = generateHTML();
    navigator.clipboard.writeText(html).then(() => {
      alert('HTML skopiowany do schowka!');
    });
  };

  const downloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opis-produktu.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
              Edytor Opisów Produktów
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Stwórz profesjonalny opis produktu w stylu Allegro
            </p>
          </div>

          {/* Add Section Buttons */}
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

          {/* Content */}
          <div style={{ padding: '16px' }}>
            {sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                <p style={{ fontSize: '18px' }}>Dodaj pierwszą sekcję aby rozpocząć tworzenie opisu</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sections.map((section, index) => (
                  <div key={section.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    
                    {/* Section Header */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: '#f9fafb', 
                      padding: '8px 16px', 
                      borderBottom: '1px solid #e5e7eb' 
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
                            opacity: index === 0 ? 0.5 : 1
                          }}
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
                            opacity: index === sections.length - 1 ? 0.5 : 1
                          }}
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => copySection(section.id)}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                          }}
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
                            color: '#ef4444'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Section Content - simplified, just text for now */}
                    <div style={{ padding: '16px', backgroundColor: section.backgroundColor }}>
                      {section.type === 'text-only' && (
                        <textarea
                          value={section.text}
                          onChange={(e) => updateSection(section.id, 'text', e.target.value)}
                          placeholder="Wprowadź tekst..."
                          style={{
                            width: '100%',
                            height: '120px',
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            resize: 'vertical',
                            fontSize: section.textFormatting.fontSize + 'px',
                            textAlign: section.textFormatting.textAlign,
                            fontWeight: section.textFormatting.bold ? 'bold' : 'normal',
                            fontStyle: section.textFormatting.italic ? 'italic' : 'normal',
                            textDecoration: section.textFormatting.underline ? 'underline' : 'none'
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Export Section */}
            {sections.length > 0 && (
              <div style={{ marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>Podgląd:</h4>
                    <div 
                      style={{ 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px', 
                        padding: '16px', 
                        backgroundColor: 'white' 
                      }}
                      dangerouslySetInnerHTML={{ __html: generateHTML() }} 
                    />
                    
                    <h4 style={{ fontWeight: '500', marginBottom: '8px', marginTop: '16px' }}>Kod HTML:</h4>
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
                        fontFamily: 'monospace'
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

function App() {
  return <AllegroDescriptionEditor />;
}

export default App;
