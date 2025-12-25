import React, { useState } from 'react';
import { initialGridData } from './Clues';
import logo from './logo.svg';

import './App.css';

function Home() {
  const [grid, setGrid] = useState(initialGridData);

  const [activeSquare, setActiveSquare] = useState(null);

  const foundSquare = grid.find(item => item.id === activeSquare);

  const handleSquareClick = (id) => {
    // Mark the item as "revealed" so the icon disappears and text appears later
    const updatedItems = grid.map(item => 
      item.id === id ? { ...item, isRevealed: true } : item
    );
    setGrid(updatedItems);
    setActiveSquare(id); // Navigate to the detail view
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a fake local URL for the uploaded image so we can display it
      const photoUrl = URL.createObjectURL(file);
      
      const updatedItems = grid.map(item => 
        item.id === activeSquare ? { ...item, photo: photoUrl } : item
      );
      setGrid(updatedItems);
    }
  };

  return (
    <div className="app-container">
      {activeSquare === null ? (
        /* --- VIEW 1: THE GRID --- */
        <div className="grid-container">
          <h1>For My Girlfriend ❤️</h1>
          <div className="grid">
            {grid.map((item) => (
              <button 
                key={item.id} 
                className="square" 
                onClick={() => handleSquareClick(item.id)}
              >
                {/* LOGIC: Show Photo if exists, OR Clue if revealed, OR Icon if new */}
                {item.photo ? (
                  <img src={item.photo} alt="memory" className="square-img" />
                ) : item.isRevealed ? (
                  <span className="small-clue">{item.clue}</span>
                ) : 
                (
                  <img src={item.initialPhoto} alt="memory" className="square-img" />
                )
                }
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* --- VIEW 2: THE DETAIL / UPLOAD PAGE --- */
        <div className="detail-view">
          <button className="back-btn" onClick={() => setActiveSquare(null)}>
            ← Back to Grid
          </button>
          
          <div className="card-content">
            {foundSquare.photo ? (
              // If photo exists, show the SECRET LETTER
              <div className="secret-reveal">
                <h2>You found a letter!</h2>
                <div className="big-letter">{foundSquare.letter}</div>
                <p>Check the grid to see your photo.</p>
              </div>
            ) : (
              // If no photo, show the CLUE and UPLOAD button
              <div className="clue-section">
                <h2>The Clue</h2>
                <p className="clue-text">{foundSquare.clue}</p>
                
                <label className="upload-btn">
                  📷 Take Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    style={{ display: 'none' }} // Hide the ugly default input
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
