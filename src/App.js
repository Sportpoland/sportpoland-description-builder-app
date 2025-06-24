import React from 'react';

function App() {
  return React.createElement('div', {
    style: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }
  }, [
    React.createElement('h1', {
      key: 'title',
      style: { color: '#333', marginBottom: '20px' }
    }, 'Edytor Opisów Produktów - TEST'),
    React.createElement('p', {
      key: 'subtitle',
      style: { color: '#666', fontSize: '18px' }
    }, 'Jeśli widzisz ten tekst, React działa poprawnie!'),
    React.createElement('button', {
      key: 'button',
      style: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px'
      },
      onClick: () => alert('Przycisk działa!')
    }, 'Kliknij mnie')
  ]);
}

export default App;
