import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Keyframes for diagonal traveling gradient
const diagonalTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
`;

// Container: full screen black background, center content
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000;
`;

// Wrapper for the text
const TextWrapper = styled.div`
  position: relative;
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  user-select: none;
  display: inline-block;
`;

// Each letter is styled to clip the background gradient inside the text shape
const Letter = styled.span`
  position: relative;
  display: inline-block;
  margin: 0 2px;
  /* We use overflow: hidden only if you want to ensure the radial highlight
     doesn't spill beyond the letter. This is optional. */
  overflow: hidden;

  /* 
    Ensure the text is transparent, and let the background show 
    through the text shape. The critical lines are:
      - color: transparent
      - -webkit-text-fill-color: transparent
      - -webkit-background-clip: text
      - background-clip: text
  */
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;

  /* Switch background depending on the phase */
  background: ${({ phase }) => {
    if (phase === 'traveling') {
      return 'linear-gradient(45deg, rgba(255,255,255,0) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 70%)';
    }
    if (phase === 'final') {
      return 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))';
    }
    return 'none';
  }};
  background-size: ${({ phase }) => (phase === 'traveling' ? '200% 200%' : 'cover')};
  opacity: ${({ phase }) => (phase === 'hidden' ? 0 : 1)};

  /* Animate only in traveling phase */
  animation: ${({ phase }) =>
    phase === 'traveling'
      ? css`${diagonalTravel} 1s forwards`
      : 'none'};

  /* 
    ::after for radial hover highlight 
    Center is set by --letter-mouse-x / --letter-mouse-y 
    updated via onMouseMove in the parent.
  */
  &::after {
    content: '';
    position: absolute;
    inset: 0; /* top: 0; left: 0; right: 0; bottom: 0; */
    pointer-events: none;
    background: radial-gradient(
      circle at var(--letter-mouse-x, 50% 50%),
      rgba(255, 255, 255, 0.5),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.2s;
  }

  /* Show the radial highlight only when hovering over the letter */
  &:hover::after {
    opacity: 1;
  }
`;

const HanuutText = () => {
  const TEXT = 'HANUUT';
  // Each letter can be: 'hidden' | 'traveling' | 'final'
  const [letterPhases, setLetterPhases] = useState(Array(TEXT.length).fill('hidden'));

  // Create a ref for each letter to update local mouse coords
  const letterRefs = useRef([]);

  useEffect(() => {
    // Animate each letter in sequence
    TEXT.split('').forEach((_, i) => {
      // Start traveling after i * 200ms
      setTimeout(() => {
        setLetterPhases(prev => {
          const updated = [...prev];
          updated[i] = 'traveling';
          return updated;
        });
      }, i * 200);

      // Switch to final ~1s later
      setTimeout(() => {
        setLetterPhases(prev => {
          const updated = [...prev];
          updated[i] = 'final';
          return updated;
        });
      }, i * 200 + 1000);
    });
  }, [TEXT]);

  // Handle mouse movement over the parent, update each letter's local coords
  const handleMouseMove = (e) => {
    letterRefs.current.forEach(letter => {
      if (letter) {
        const rect = letter.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        letter.style.setProperty('--letter-mouse-x', `${relX}px`);
        letter.style.setProperty('--letter-mouse-y', `${relY}px`);
      }
    });
  };

  return (
    <Container>
      <TextWrapper onMouseMove={handleMouseMove}>
        {TEXT.split('').map((char, idx) => (
          <Letter
            key={idx}
            phase={letterPhases[idx]}
            ref={(el) => (letterRefs.current[idx] = el)}
          >
            {char}
          </Letter>
        ))}
      </TextWrapper>
    </Container>
  );
};

export default HanuutText;
