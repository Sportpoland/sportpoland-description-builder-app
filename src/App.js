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

  const updateSection = (id, field, value) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
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
                  <div key={section.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    
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
                        <select
                          value={section.textFormatting.headingLevel}
                          onChange={(e) => updateTextFormatting(section.id, 'headingLevel', e.target.value)}
                          style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                        >
                          <option value="p">Paragraf</option>
                          <option value="h1">H1</option>
                          <option value="h2">H2</option>
                          <option value="h3">H3</option>
                          <option value="h4">H4</option>
                        </select>
                        
                        <button
                          onClick={() => updateTextFormatting(section.id, 'bold', !section.textFormatting.bold)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: section.textFormatting.bold ? '#3b82f6' : 'white',
                            color: section.textFormatting.bold ? 'white' : 'black',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          B
                        </button>
                        
                        <button
                          onClick={() => updateTextFormatting(section.id, 'italic', !section.textFormatting.italic)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: section.textFormatting.italic ? '#3b82f6' : 'white',
                            color: section.textFormatting.italic ? 'white' : 'black',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontStyle: 'italic'
                          }}
                        >
                          I
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

                    <div style={{ backgroundColor: section.backgroundColor, padding: '16px' }}>
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
                            boxSizing: 'border-box',
                            fontSize: `${section.textFormatting.fontSize}px`,
                            textAlign: section.textFormatting.textAlign,
                            fontWeight: section.textFormatting.bold ? 'bold' : 'normal',
                            fontStyle: section.textFormatting.italic ? 'italic' : 'normal',
                            textDecoration: section.textFormatting.underline ? 'underline' : 'none'
                          }}
                        />
                      )}
                      
                      {section.type === 'image-left' && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '50%' }}>
                            <div style={{ 
                              border: '2px dashed #d1d5db', 
                              borderRadius: '6px', 
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
                                    objectFit: 'contain' 
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
                            <textarea
                              value={section.text}
                              onChange={(e) => updateSection(section.id, 'text', e.target.value)}
                              placeholder="Wprowadź tekst..."
                              style={{
                                width: '100%',
                                height: '150px',
                                padding: '8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                                fontSize: `${section.textFormatting.fontSize}px`,
                                textAlign: section.textFormatting.textAlign,
                                fontWeight: section.textFormatting.bold ? 'bold' : 'normal',
                                fontStyle: section.textFormatting.italic ? 'italic' : 'normal'
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'image-right' && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '50%' }}>
                            <textarea
                              value={section.text}
                              onChange={(e) => updateSection(section.id, 'text', e.target.value)}
                              placeholder="Wprowadź tekst..."
                              style={{
                                width: '100%',
                                height: '150px',
                                padding: '8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                                fontSize: `${section.textFormatting.fontSize}px`,
                                textAlign: section.textFormatting.textAlign,
                                fontWeight: section.textFormatting.bold ? 'bold' : 'normal',
                                fontStyle: section.textFormatting.italic ? 'italic' : 'normal'
                              }}
                            />
                          </div>
                          <div style={{ width: '50%' }}>
                            <div style={{ 
                              border: '2px dashed #d1d5db', 
                              borderRadius: '6px', 
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
                                    objectFit: 'contain' 
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
                          borderRadius: '6px', 
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
                                objectFit: 'contain' 
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
                              borderRadius: '6px', 
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
                                    objectFit: 'contain' 
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
                              borderRadius: '6px', 
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
                                    objectFit: 'contain' 
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
