import React from 'react'
import {motion} from 'framer-motion';
import {images} from '../../constants';
import {AppWrap} from '../../wrapper';

import './Header.scss';

const scaleVariants = {
  whileInView: {
      scale: [0,1],
      opacity: [0,1],
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
  }
}
const Header = () => {
  const cardRef = React.useRef(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / rect.width) * 20;  // left/right
    const rotateX = (-y / rect.height) * 20; // up/down
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const [layer, setLayer] = React.useState(0);

  const layers = [
    {
      title: 'Overview',
      content: (
        <>
          <h2 style={{ margin: 0, fontSize: 26, letterSpacing: 0.5, textAlign: 'center' }}>
            Jeffrey Huang
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.5, opacity: 0.85 }}>
            Passionate about all things tech and building with user experience/brand in mind.
          </p>

        </>
      )
    },
    {
      title: 'Academics',
      content: (
        <>
          <h2 style={{ margin: 0, fontSize: 24, textAlign: 'center' }}>Academic Profile</h2>
            <ul style={{ paddingLeft: 18, margin: '12px 0 0', fontSize: 13, lineHeight: 1.55 }}>
              <li>Program: Computer Engineering</li>
              <li>University: University of Waterloo</li>
              <li>Year: 2B </li>
              <li>Focus: Software Development</li>
            </ul>
        </>
      )
    },
    {
      title: 'Personal',
      content: (
        <>
          <h2 style={{ margin: 0, fontSize: 24, textAlign: 'center' }}>About Me</h2>
          <ul style={{ paddingLeft: 18, margin: '12px 0 0', fontSize: 13, lineHeight: 1.55 }}>
            <li>Age: 20</li>
            <li>Interests: Basketball, Working Out, Fashion, Music</li>
            <li>Location: Toronto, Canada</li>
          </ul>
        </>
      )
    },
  ];

  return (
    <div id='home' className='app__header app__flex'>
      <motion.div
        whileInView={{ x: [-100, 0], opacity: [0, 1] }}
        transition={{ duration: 1.25 }}
        className='app__header-info'
      >
        <div className='app__header-badge'>
          <div className='badge-cmp app__flex'>
            <span>👋</span>
            <div style={{ marginLeft: 20 }}>
              <p className="p-text">hello, i'm</p>
              <h1 className='head-text'>jeffrey huang</h1>
            </div>
          </div>

          <div className='tag-cmp app__flex'>
            <p className="p-text">Computer Eng. Student at UWaterloo</p>
            <p className="p-text2">Aspiring engineer and developer</p>
          </div>
        </div>
      </motion.div>

      <div
        className="app__header-3d-wrapper"
        style={{
          perspective: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          minHeight: 400
        }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
          whileInView={{ opacity: [0, 1], scale: [0.9, 1] }}
          transition={{ duration: 1 }}
          className="threeD-card"
          style={{
            width: 340,
            height: 440,
            borderRadius: 24,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transformPerspective: 1200,
            rotateX: rotation.x,
            rotateY: rotation.y,
            willChange: 'transform',
            background: '#7400d8',
            backgroundImage: 'linear-gradient(145deg,#7b2ff7 0%, #6116c7 50%, #470087 100%)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.55)',
            padding: 26,
            cursor: 'grab',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            color: '#fff'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 60%)',
              pointerEvents: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {layers.map((l, i) => (
              <button
                key={l.title}
                onClick={() => setLayer(i)}
                style={{
                  background: i === layer ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff',
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 30,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                  backdropFilter: 'blur(4px)',
                  transition: 'background .25s'
                }}
              >
                {l.title}
              </button>
            ))}
          </div>

          <motion.div
            key={layer}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', paddingRight: 4 }}
          >
            {layers[layer].content}
          </motion.div>

          <div style={{ marginTop: 'auto', fontSize: 11, letterSpacing: 0.5, opacity: 0.65, textAlign: 'center' }}>
            Hover to rotate • Click tabs to explore
          </div>
        </motion.div>

        <motion.div
          variant={scaleVariants}
          whileInView={scaleVariants.whileInView}
          className="app__header-circles"
        >
          {[images.cpp, images.css, images.html].map((circle, index) => (
            <div className="circle-cmp app__flex" key={`circle-${index}`}>
              <img src={circle} alt="circle" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default AppWrap(Header, 'home');
