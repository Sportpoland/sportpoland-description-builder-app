import React, { useState, useRef } from 'react';

const ProductDescriptionEditor = () => {
  const [sections, setSections] = useState([]);
  const [draggedSection, setDraggedSection] = useState(null);
  const fileInputRef = useRef(null);

  const addSection = (type) => {
    const newSection = {
      id: Date.now(),
      type,
      content: type === 'text' ? '' : type === 'image' ? '' : [],
      backgroundColor: '#ffffff',
      textAlign: 'left',
      fontSize: '16',
      fontWeight: 'normal',
      fontStyle: 'normal'
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id, updates) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    setSections(newSections);
  };

  const handleImageUpload = (sectionId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSection(sectionId, { content: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addIcon = (sectionId, iconType) => {
    const section = sections.find(s => s.id === sectionId);
    const newIcon = {
      id: Date.now(),
      type: iconType,
      color: '#000000',
      size: '24'
    };
    updateSection(sectionId, { 
      content: [...(section.content || []), newIcon] 
    });
  };

  const updateIcon = (sectionId, iconId, updates) => {
    const section = sections.find(s => s.id === sectionId);
    const updatedIcons = section.content.map(icon => 
      icon.id === iconId ? { ...icon, ...updates } : icon
    );
    updateSection(sectionId, { content: updatedIcons });
  };

  const deleteIcon = (sectionId, iconId) => {
    const section = sections.find(s => s.id === sectionId);
    const updatedIcons = section.content.filter(icon => icon.id !== iconId);
    updateSection(sectionId, { content: updatedIcons });
  };

  const exportToHTML = () => {
    let html = '<div style="max-width: 100%; margin: 0 auto;">\n';
    
    sections.forEach(section => {
      html += `  <div style="background-color: ${section.backgroundColor}; padding: 20px; margin-bottom: 10px;">\n`;
      
      if (section.type === 'text') {
        html += `    <div style="text-align: ${section.textAlign}; font-size: ${section.fontSize}px; font-weight: ${section.fontWeight}; font-style: ${section.fontStyle};">${section.content}</div>\n`;
      } else if (section.type === 'image') {
        html += `    <div style="text-align: center;"><img src="${section.content}" style="max-width: 100%; height: auto;" /></div>\n`;
      } else if (section.type === 'icons') {
        html += `    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">\n`;
        section.content.forEach(icon => {
          html += `      <div style="color: ${icon.color}; font-size: ${icon.size}px;">${getIconSVG(icon.type, icon.color, icon.size)}</div>\n`;
        });
        html += `    </div>\n`;
      }
      
      html += `  </div>\n`;
    });
    
    html += '</div>';
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-description.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getIconSVG = (type, color, size) => {
    const icons = {
      star: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      heart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
      check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M20 6L9 17l-5-5"/></svg>`,
      arrow: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>`,
      shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    };
    return icons[type] || icons.star;
  };

  const renderIcon = (icon) => {
    return (
      <div 
        key={icon.id}
        style={{ 
          color: icon.color, 
          fontSize: `${icon.size}px`,
          display: 'inline-block',
          margin: '5px'
        }}
        dangerouslySetInnerHTML={{ __html: getIconSVG(icon.type, icon.color, icon.size) }}
      />
    );
  };

  const handleDragStart = (e, index) => {
    setDraggedSection(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedSection !== null && draggedSection !== dropIndex) {
      moveSection(draggedSection, dropIndex);
    }
    setDraggedSection(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Panel narzędzi */}
        <div style={{ width: '300px', background: '#f5f5f5', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Dodaj sekcję</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => addSection('text')}
              style={{
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📝 Dodaj tekst
            </button>
            
            <button
              onClick={() => addSection('image')}
              style={{
                padding: '12px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🖼️ Dodaj zdjęcie
            </button>
            
            <button
              onClick={() => addSection('icons')}
              style={{
                padding: '12px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ⭐ Dodaj ikony
            </button>
          </div>

          {sections.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <button
                onClick={exportToHTML}
                style={{
                  padding: '12px',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  width: '100%'
                }}
              >
                💾 Eksportuj HTML
              </button>
            </div>
          )}
        </div>

        {/* Edytor */}
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Edytor Opisu Produktu</h2>
          
          {sections.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#666', 
              border: '2px dashed #ddd',
              borderRadius: '8px'
            }}>
              Dodaj pierwszą sekcję, aby rozpocząć edycję
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    cursor: 'move'
                  }}
                >
                  {/* Pasek narzędzi sekcji */}
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {section.type === 'text' ? '📝 Tekst' : section.type === 'image' ? '🖼️ Zdjęcie' : '⭐ Ikony'}
                      </span>
                      
                      <label style={{ fontSize: '12px', color: '#666' }}>
                        Tło:
                        <input
                          type="color"
                          value={section.backgroundColor}
                          onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                          style={{ marginLeft: '5px', width: '30px', height: '20px', border: 'none' }}
                        />
                      </label>

                      {section.type === 'text' && (
                        <>
                          <select
                            value={section.textAlign}
                            onChange={(e) => updateSection(section.id, { textAlign: e.target.value })}
                            style={{ fontSize: '12px', padding: '2px' }}
                          >
                            <option value="left">⬅️ Lewo</option>
                            <option value="center">⬆️ Środek</option>
                            <option value="right">➡️ Prawo</option>
                          </select>
                          
                          <input
                            type="range"
                            min="12"
                            max="48"
                            value={section.fontSize}
                            onChange={(e) => updateSection(section.id, { fontSize: e.target.value })}
                            style={{ width: '80px' }}
                          />
                          <span style={{ fontSize: '12px' }}>{section.fontSize}px</span>
                          
                          <button
                            onClick={() => updateSection(section.id, { 
                              fontWeight: section.fontWeight === 'bold' ? 'normal' : 'bold' 
                            })}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: section.fontWeight === 'bold' ? '#333' : '#fff',
                              color: section.fontWeight === 'bold' ? '#fff' : '#333',
                              border: '1px solid #333',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            B
                          </button>
                          
                          <button
                            onClick={() => updateSection(section.id, { 
                              fontStyle: section.fontStyle === 'italic' ? 'normal' : 'italic' 
                            })}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: section.fontStyle === 'italic' ? '#333' : '#fff',
                              color: section.fontStyle === 'italic' ? '#fff' : '#333',
                              border: '1px solid #333',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontStyle: 'italic'
                            }}
                          >
                            I
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteSection(section.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Zawartość sekcji */}
                  <div style={{ padding: '20px', backgroundColor: section.backgroundColor }}>
                    {section.type === 'text' && (
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        placeholder="Wprowadź tekst..."
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          padding: '10px',
                          fontSize: `${section.fontSize}px`,
                          fontWeight: section.fontWeight,
                          fontStyle: section.fontStyle,
                          textAlign: section.textAlign,
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    )}

                    {section.type === 'image' && (
                      <div style={{ textAlign: 'center' }}>
                        {section.content ? (
                          <div>
                            <img 
                              src={section.content} 
                              alt="Uploaded" 
                              style={{ 
                                maxWidth: '100%', 
                                height: 'auto',
                                borderRadius: '4px',
                                marginBottom: '10px'
                              }} 
                            />
                            <div>
                              <button
                                onClick={() => updateSection(section.id, { content: '' })}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#f44336',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Usuń zdjęcie
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(section.id, e)}
                              style={{ display: 'none' }}
                              ref={fileInputRef}
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                padding: '20px 40px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: '2px dashed #1976D2',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                              }}
                            >
                              📷 Kliknij aby dodać zdjęcie
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {section.type === 'icons' && (
                      <div>
                        <div style={{ marginBottom: '15px' }}>
                          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            {['star', 'heart', 'check', 'arrow', 'shield'].map(iconType => (
                              <button
                                key={iconType}
                                onClick={() => addIcon(section.id, iconType)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: '#4CAF50',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '20px'
                                }}
                                dangerouslySetInnerHTML={{ __html: getIconSVG(iconType, '#ffffff', '20') }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '20px',
                          flexWrap: 'wrap',
                          minHeight: '60px',
                          border: '2px dashed #ddd',
                          borderRadius: '8px',
                          padding: '20px'
                        }}>
                          {section.content && section.content.length > 0 ? (
                            section.content.map(icon => (
                              <div key={icon.id} style={{ position: 'relative', display: 'inline-block' }}>
                                {renderIcon(icon)}
                                <div style={{ 
                                  position: 'absolute', 
                                  top: '-10px', 
                                  right: '-10px',
                                  display: 'flex',
                                  gap: '2px'
                                }}>
                                  <input
                                    type="color"
                                    value={icon.color}
                                    onChange={(e) => updateIcon(section.id, icon.id, { color: e.target.value })}
                                    style={{ width: '20px', height: '20px', border: 'none', borderRadius: '2px' }}
                                  />
                                  <input
                                    type="range"
                                    min="16"
                                    max="64"
                                    value={icon.size}
                                    onChange={(e) => updateIcon(section.id, icon.id, { size: e.target.value })}
                                    style={{ width: '40px' }}
                                  />
                                  <button
                                    onClick={() => deleteIcon(section.id, icon.id)}
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: '#f44336',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '2px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div style={{ color: '#666', textAlign: 'center' }}>
                              Dodaj ikony używając przycisków powyżej
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionEditor;
