import React, { useState, useEffect } from 'react';
import { initialGridData } from './Clues';
import logo from './logo.svg';
import {ReactComponent as BackArrow} from './Logos/back-carrot.svg'
import {ReactComponent as EyeOpen} from './Logos/eye-open.svg'
import {ReactComponent as EyeClosed} from './Logos/eye-closed.svg'


import './App.css';

function Home() {
  const [grid, setGrid] = useState(initialGridData);
  
  // const [grid, setGrid] = useState(() => {
  //   // Check if we have saved data
  //   const saved = localStorage.getItem('photoScavengerHunt');
  //   if (saved) {
  //     // If yes, parse it and return it
  //     return JSON.parse(saved);
  //   } else {
  //     // If no (first time user), return the default data
  //     return initialGridData;
  //   }
  // });

  const [activeSquare, setActiveSquare] = useState(null);

  // useEffect(() => {
  //   // Whenever 'gridItems' changes, save it to the browser
  //   localStorage.setItem('photoScavengerHunt', JSON.stringify(grid));
  // }, [grid]);

  const foundSquare = grid.find(item => item.id === activeSquare);

  const [modal, setModal] = useState(null);

  const handleSquareClick = (id) => {
    // Mark the item as "revealed" so the icon disappears and text appears later
    console.log("Hello?????");
    
    let updatedItems = grid.map(item => ({
      ...item,
      revealToggle: false
    }));
    
    updatedItems = grid.map(item => (item.id === id && !item.isRevealed) ? { ...item, isRevealed: true } : (item.id === id && item.isRevealed ? { ...item, isRevealed: true, revealToggle: false } : (item.id !== id && item.isRevealed ? { ...item, isRevealed: true, revealToggle: false } : item)));

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

  const renderMedia = (item, isGrid = true) => {
    const commonClass = isGrid ? "square-img" : "detail-media"; // CSS class switch
    
    if (item.type === 'video' && isGrid) {
      return (
        <video 
          src={item.initialPhoto} 
          className={commonClass}
          autoPlay 
          muted 
          loop 
          playsInline // Essential for iOS to not go fullscreen automatically
        />
      );
    }
    else if (item.type === 'video' && !isGrid) {
      return (
        <video 
          src={item.initialPhoto} 
          className={commonClass}
          controls
          loop
          autoPlay={false}  // Recommended: Turn off autoPlay so she can click play herself
          playsInline
        />
      );
    }

    return <img src={item.initialPhoto} className={commonClass} />;
  };

  const toggleOverlay = (event, id) => {
  // Stop the click from opening the Detail Page
  event.stopPropagation(); 

  setGrid(prevItems => 
    prevItems.map(item => {
      if (item.id === id) {
        // Toggle the isRevealed property (True <-> False)
        return { ...item, revealToggle: !item.revealToggle };
      }
      return item;
    })
  );
};

  return (
    <div className="app-container">
      {modal && (
      <div className="modal-overlay" onClick={() => setModal(null)}>
        {/* stopPropagation prevents clicking the white box from closing the modal */}
        <div className={`modal-content-${modal === "howto" ? 'howto' : (modal === "about" ? 'about' : "")}`} onClick={(event) => event.stopPropagation()}>
          
          <button className="modal-close-btn" onClick={() => setModal(null)}>×</button>

          {/* DYNAMIC CONTENT BASED ON BUTTON CLICKED */}
          {modal === 'howto' && (
            <div className="modal-body-howto">
              <div className="modal-body-howto-title">How To</div>
              <p>1. Tap a square to see the clue.</p>
              <p>2. Go to the location and take a photo.</p>
              <p>3. Upload it to unlock a secret letter!</p>
            </div>
          )}

          {modal === 'about' && (
            <div className="modal-body-about">
              <div className="modal-body-about-title">About</div>
              <p>This is a digital scavenger hunt made with love.</p>
              <p>Created for our 1 Year Anniversary.</p>
            </div>
          )}

        </div>
      </div>
    )}
      {activeSquare === null ? (
        /* --- VIEW 1: THE GRID --- */
        <div className="grid-container">
          <div className="sticky-header">
            <h1 id="header-title" onClick={() => setActiveSquare(null)}>Year 1</h1>
            
            {/* Placeholder for your future buttons */}
            <div className="header-actions">
              <div className="howto" onClick={() => setModal("howto")}>How To</div>
              <div className="about" onClick={() => setModal("about")}>About</div>
            </div>
          </div>
          <div className="grid">
            {grid.map((item) => (
              <div 
                key={item.id} 
                className="square" 
                role="button"
                onClick={() => handleSquareClick(item.id)}
              >
                {/* LOGIC: Show Photo if exists, OR Clue if revealed, OR Icon if new */}
                {item.photo ? (
                  <div className="image-wrapper">
                    {/* The base image - always visible in these states */}
                    <img src={item.initialPhoto} className="square-img finished-img" />

                    {item.isRevealed &&
                      <button 
                        className={item.revealToggle ? 'toggle-icon-btn closed' : 'toggle-icon-btn open'}
                        onClick={(event) => toggleOverlay(event, item.id)}
                        title="Toggle Clue Visibility"
                      >
                        {/* Show 'Eye' if clue is visible (click to hide), 'Block' if clue is hidden (click to show) */}
                        {item.revealToggle ? <EyeClosed className="eye-closed" /> : <EyeOpen className="eye-open" />} 
                      </button>
                    }
                    
                    {/* The Overlay - Only visible if 'isRevealed' is true */}
                    {(item.isRevealed && !item.revealToggle) && (
                      <div className="clue-overlay">
                        <span className="small-clue">{item.clue}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* PRIORITY 2 & 3: Initial Photo with optional Overlay (New/Active States) */
                  /* We wrap the image and overlay together so they stack correctly */
                  <div className="image-wrapper">
                    {/* The base image - always visible in these states */}
                    <img src={item.initialPhoto} className="square-img" />

                    {item.isRevealed &&
                      <button 
                        className={item.revealToggle ? 'toggle-icon-btn closed' : 'toggle-icon-btn open'}
                        onClick={(event) => toggleOverlay(event, item.id)}
                        title="Toggle Clue Visibility"
                      >
                        {/* Show 'Eye' if clue is visible (click to hide), 'Block' if clue is hidden (click to show) */}
                        {item.revealToggle ? <EyeClosed className="eye-closed" /> : <EyeOpen className="eye-open" />} 
                      </button>
                    }
                    
                    {/* The Overlay - Only visible if 'isRevealed' is true */}
                    {(item.isRevealed && !item.revealToggle) && (
                      <div className="clue-overlay">
                        <span className="small-clue">{item.clue}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* --- VIEW 2: THE DETAIL / UPLOAD PAGE --- */
        <div className="detail-view">
          <div className="sticky-detail-header">
            <h1 id="header-title" onClick={() => setActiveSquare(null)}>Year 1</h1>
            
            <div className="detail-header-actions">
              <div className="howto" onClick={() => setModal("howto")}>How To</div>
              <div className="about" onClick={() => setModal("about")}>About</div>
            </div>
          </div>

          <div className="back-btn" onClick={() => setActiveSquare(null)}>
            <BackArrow className="back-arrow"/>
            <div className="back-text">Back to Home</div>
          </div>
          
          <div className="detail-content">
            <div className="detail-media-wrapper">
              {renderMedia(foundSquare, false)}
            </div>
            {foundSquare.photo ? (
              // If photo exists, show the SECRET LETTER
              <div className="secret-reveal">
                <h2>You found a letter!</h2>
                <div className="big-letter">{foundSquare.letter}</div>
                <p>Check the grid to see your photo.</p>
                <div className="upload-btn-container">
                  <label className="upload-btn-success">
                    Uploaded!
                  </label>
                </div>
              </div>
            ) : (
              // If no photo, show the CLUE and UPLOAD button
              <div className="clue-section">
                <div className="clue-text">{foundSquare.clue}</div>
                
                <div className="upload-btn-container">
                  <label className="upload-btn">
                    Upload Photo
                    <input
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      style={{ display: 'none' }} // Hide the ugly default input
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
