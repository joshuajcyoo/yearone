import React, { useState, useEffect } from 'react';
import { initialGridData } from './Clues';
import {ReactComponent as BackArrow} from './Logos/back-carrot.svg'
import {ReactComponent as EyeOpen} from './Logos/eye-open.svg'
import {ReactComponent as EyeClosed} from './Logos/eye-closed.svg'
import {ReactComponent as LockOpen} from './Logos/lock-open.svg'
import {ReactComponent as LockClosed} from './Logos/lock-closed.svg'
import './App.css';

function Home() {
  // const [grid, setGrid] = useState(initialGridData);
  
  const [grid, setGrid] = useState(() => {
    // Check if we have saved data
    const saved = localStorage.getItem('photoScavengerHunt');
    if (saved) {
      // If yes, parse it and return it
      return JSON.parse(saved);
    } else {
      // If no (first time user), return the default data
      return initialGridData;
    }
  });

  const [activeSquare, setActiveSquare] = useState(null);

  useEffect(() => {
    // Whenever 'gridItems' changes, save it to the browser
    localStorage.setItem('photoScavengerHunt', JSON.stringify(grid));
  }, [grid]);

  const foundSquare = grid.find(item => item.id === activeSquare);

  const [modal, setModal] = useState((!localStorage.getItem('photoScavengerHunt') ? "howto" : null));

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

  const resizeImage = (file, maxWidth = 800) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const elem = document.createElement('canvas');
          const scaleFactor = maxWidth / img.width;
          elem.width = maxWidth;
          elem.height = img.height * scaleFactor;
          const ctx = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, elem.width, elem.height);
          // Compress to JPEG at 70% quality
          resolve(ctx.canvas.toDataURL('image/jpeg', 0.7)); 
        };
      };
    });
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Resize the image to max 800px width (keeps file size small)
        const compressedBase64 = await resizeImage(file, 800);
        
        const updatedItems = grid.map(item => 
          item.id === activeSquare ? { ...item, photo: compressedBase64 } : item
        );
        setGrid(updatedItems);
      } catch (error) {
        console.error("Error resizing image:", error);
      }
      event.target.value = null;
    }
  };

  const handleRemovePhoto = () => {
    // Optional: Clean up memory by revoking the old URL
    const currentItem = grid.find(item => item.id === activeSquare);
    if (currentItem && currentItem.photo) {
      URL.revokeObjectURL(currentItem.photo);
    }

    // Update state: Set the photo property to null for the active square
    const updatedItems = grid.map(item => 
      item.id === activeSquare ? { ...item, photo: null } : item
    );
    setGrid(updatedItems);
  };

  const renderMedia = (item, isGrid = true) => {
    const detailVideoType = item.videoType === "horizontal" ? "detail-media horizontal-video" : (item.videoType === "vertical" ? "detail-media vertical-video" : "detail-media")
    let homeVideoType = "square-img";
    if (item.videoType === "horizontal" && !item.photo) {
      homeVideoType = "square-img horizontal-video";
    } else if (item.videoType === "horizontal" && item.photo) {
      homeVideoType = "square-img finished-img horizontal-video";
    } else if (item.videoType !== "horizontal" && item.photo) {
      homeVideoType = "square-img finished-img";
    }    
    const commonClass = isGrid ? homeVideoType : detailVideoType; // CSS class switch
    
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

  const toggleClue = (event, id) => {
    // Stop the click from opening the Detail Page
    event.stopPropagation(); 

    setGrid(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          // Toggle the isRevealed property (True <-> False)
          return { ...item, revealClue: !item.revealClue };
        }
        return item;
      })
    );
  };

  return (
    <div className="app-container">
      {modal && (
      <div className="modal-overlay" onClick={() => {
        setModal(null); 
        setGrid(prev =>
          prev.map((item, index) =>
            index === 0
              ? { ...item, howto: false }
              : item
          )
        );
      }}>
        {/* stopPropagation prevents clicking the white box from closing the modal */}
        <div className={`modal-content-${modal === "howto" ? 'howto' : (modal === "about" ? 'about' : "")}`} onClick={(event) => event.stopPropagation()}>
          
          <button className={`modal-close-btn-${modal === "howto" ? 'howto' : (modal === "about" ? 'about' : "")}`} onClick={() => setModal(null)}>×</button>

          {/* DYNAMIC CONTENT BASED ON BUTTON CLICKED */}
          {modal === 'howto' && (
            <div className="modal-body-howto">
              <div className="modal-body-howto-title">How To</div>
              <div className="modal-body-howto-message first">Welcome to my photo scavenger hunt!</div>
              <div className="modal-body-howto-message">Each photo or video is connected to a meaningful facet of our relationship. Click on each one of them to start and read more.</div>
              <div className="modal-body-howto-message">On each page, there is a <span style={{fontFamily: 'Cabinet ExtraBold'}}>prompt</span> instructing a specific type of photo, as well as a button to <span style={{fontFamily: 'Cabinet ExtraBold'}}>take</span> (or upload) <span style={{fontFamily: 'Cabinet ExtraBold'}}>your photo</span>.</div>
              <div className="modal-body-howto-message">Don't worry about taking all of your photos at once or refreshing the page. Your progress will save even if you leave.</div>
              <div className="modal-body-howto-message">Upon taking your photo, navigate back to the home page to view your updated grid.</div>
            </div>
          )}

          {modal === 'about' && (
            <div className="modal-body-about">
              <div className="modal-body-about-title">About</div>
              <div className="modal-body-about-message first">When I'm old and I reflect on the year 2025, the first reflection I will have is that this was one of the happiest years of my entire life, because of you.</div>
              <div className="modal-body-about-message">I'll reflect on how we dismantled the distance between us with the most incredibly fun four-day vacations ever, how we thoroughly and methodically built the foundation of our relationship to support our individual growth and aspirations, how you moved to me and fundamentally rewired what I envisioned my life to be, and how I finally was given the chance to truly love the person I've always felt I've been destined to love from the beginning.</div>
              <div className="modal-body-about-message">January 2, 2026 will mark exactly one year since we've been together, and I wanted to create a space for all of these reflections over the past year to live and exist. You also know that I love creating brain games just as much as you love solving them.</div>
              <div className="modal-body-about-message">Happy one year anniversary Darahnea. You're the greatest gift in the entire world to me.</div>
              <div className="modal-body-about-message">I love you.</div>
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
                  <div className={`image-wrapper ${item.photo ? 'finished-wrapper' : ''}`}>
                    {/* The base image - always visible in these states */}
                    <img src={item.initialPhoto} className={item.videoType === "horizontal" ? 'square-img finished-img horizontal-video' : 'square-img finished-img'} />

                    {(item.isRevealed && !item.photo) &&
                      <button 
                        className={item.revealToggle ? 'toggle-icon-btn closed' : 'toggle-icon-btn open'}
                        onClick={(event) => toggleOverlay(event, item.id)}
                        title="Toggle Image Visibility"
                      >
                        {/* Show 'Eye' if clue is visible (click to hide), 'Block' if clue is hidden (click to show) */}
                        {item.revealToggle ? <EyeClosed className="eye-closed" /> : <EyeOpen className="eye-open" />} 
                      </button>
                    }

                    {item.photo &&
                      <button 
                        className={item.revealClue ? 'clue-icon-btn closed' : 'clue-icon-btn open'}
                        onClick={(event) => toggleClue(event, item.id)}
                        title="Toggle Clue Visibility"
                      >
                        {item.revealClue ? <LockClosed className="lock-closed" /> : <LockOpen className="lock-open" />} 
                      </button>
                    }
                    
                    {/* The Overlay - Only visible if 'isRevealed' is true */}
                    {(item.isRevealed && !item.revealToggle && !item.photo) && (
                      <div className="toggle-overlay">
                        <span className="small-clue">{item.clue}</span>
                      </div>
                    )}

                    {(item.isRevealed && !item.revealClue) && (
                      <div className="clue-overlay">
                        <span className="clue-letter">{item.letter}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* PRIORITY 2 & 3: Initial Photo with optional Overlay (New/Active States) */
                  /* We wrap the image and overlay together so they stack correctly */
                  <div className="image-wrapper">
                    {/* The base image - always visible in these states */}
                    {/* <img src={item.initialPhoto} className={item.videoType === "horizontal" ? 'square-img horizontal-video' : 'square-img'} /> */}
                    {renderMedia(item, true)}

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
              {foundSquare.photo ? (
                  /* OPTION A: Show the User's Uploaded Photo */
                <img 
                  src={foundSquare.photo} 
                  alt="Your Memory" 
                  className="detail-media user-photo" 
                />
                ) : (
                  /* OPTION B: Show the Original Clue Media */
                  renderMedia(foundSquare, false)
                )}
            </div>
            {foundSquare.photo ? (
              // If photo exists, show the SECRET LETTER
              <div className="secret-reveal">
                <div className="clue-text glowpulse">{foundSquare.confirmation}</div>
                <div className="upload-btn-container">
                  <label onClick={handleRemovePhoto} className="upload-btn-success">
                    Remove Photo
                  </label>
                </div>

                <div className="description-text">{foundSquare.description}</div>
              </div>
            ) : (
              // If no photo, show the CLUE and UPLOAD button
              <div className="clue-section">

                <div className="clue-text glowpulse">{foundSquare.pageClue}</div>
                <div className="upload-btn-container">
                  <label className="upload-btn">
                    Take Photo
                    <input
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      style={{ display: 'none' }} // Hide the ugly default input
                    />
                  </label>
                </div>

                <div className="description-text">{foundSquare.description}</div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
