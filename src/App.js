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
      text: type === 'text-only' || type === 'image-left' || type === 'image-right' ? 
        '<p>Wprowadź tekst...</p>' : '',
      image1: '',
      image2: '',
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
    setSections(sections.filter(section => section.id !== id));
  };

  const moveSection = (id, direction) => {
    const currentIndex = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newSections[currentIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[currentIndex]];
    setSections(newSections);
  };

  const copySection = (id) => {
    const sectionToCopy = sections.find(section => section.id === id);
    if (sectionToCopy) {
      const copiedSection = {
        ...sectionToCopy,
        id: Date.now()
      };
      setSections([...sections, copiedSection]);
    }
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
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
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSection(sectionId, imageField, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatText = (sectionId, command, value = null) => {
    document.execCommand(command, false, value);
    // Aktualizuj treść po formatowaniu
    const editor = document.getElementById(`editor-${sectionId}`);
    if (editor) {
      updateSection(sectionId, 'text', editor.innerHTML);
    }
  };

  const handleTextChange = (sectionId, content) => {
    updateSection(sectionId, 'text', content);
  };

  const generateHTML = () => {
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
              ${section.image1 ? `<img src="${section.image1}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
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
              ${section.image1 ? `<img src="${section.image1}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
          </div>\n`;
          break;
          
        case 'image-only':
          html += `<div style="text-align: center; ${containerStyle}">
            ${section.image1 ? `<img src="${section.image1}" style="max-width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
          </div>\n`;
          break;
          
        case 'two-images':
          html += `<div style="display: table; width: 100%; ${containerStyle}">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 5px; text-align: center;">
              ${section.image1 ? `<img src="${section.image1}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 5px; text-align: center;">
              ${section.image2 ? `<img src="${section.image2}" style="width: 100%; height: auto; border-radius: 10px;" alt="">` : ''}
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
    const html = generateHTML();
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
              Edytor Opisów Produktów
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Stwórz profesjonalny opis produktu w stylu Allegro
            </p>
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
                        <div
                          id={`editor-${section.id}`}
                          contentEditable
                          dangerouslySetInnerHTML={{ __html: section.text }}
                          onInput={(e) => handleTextChange(section.id, e.target.innerHTML)}
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
                        />
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
                              {section.image1 ? (
                                <img 
                                  src={section.image1} 
                                  alt="" 
                                  style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    maxHeight: '200px', 
                                    objectFit: 'contain',
                                    borderRadius: '10px'
                                  }} 
                                />
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
                            <div
                              id={`editor-${section.id}`}
                              contentEditable
                              dangerouslySetInnerHTML={{ __html: section.text }}
                              onInput={(e) => handleTextChange(section.id, e.target.innerHTML)}
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
                            />
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'image-right' && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '50%' }}>
                            <div
                              id={`editor-${section.id}`}
                              contentEditable
                              dangerouslySetInnerHTML={{ __html: section.text }}
                              onInput={(e) => handleTextChange(section.id, e.target.innerHTML)}
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
                            />
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
                              {section.image1 ? (
                                <img 
                                  src={section.image1} 
                                  alt="" 
                                  style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    maxHeight: '200px', 
                                    objectFit: 'contain',
                                    borderRadius: '10px'
                                  }} 
                                />
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
                          {section.image1 ? (
                            <img 
                              src={section.image1} 
                              alt="" 
                              style={{ 
                                width: '100%', 
                                height: 'auto', 
                                maxHeight: '300px', 
                                objectFit: 'contain',
                                borderRadius: '10px'
                              }} 
                            />
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
                              {section.image1 ? (
                                <img 
                                  src={section.image1} 
                                  alt="" 
                                  style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    maxHeight: '150px', 
                                    objectFit: 'contain',
                                    borderRadius: '10px'
                                  }} 
                                />
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
                              {section.image2 ? (
                                <img 
                                  src={section.image2} 
                                  alt="" 
                                  style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    maxHeight: '150px', 
                                    objectFit: 'contain',
                                    borderRadius: '10px'
                                  }} 
                                />
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
