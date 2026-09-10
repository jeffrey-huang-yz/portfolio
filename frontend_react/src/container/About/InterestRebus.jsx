import React, { useState } from 'react';
import { m } from 'framer-motion';
import { detailViewport, motionEase } from '../../motion';
import basketball from '../../assets/interests/basketball.webp';
import weights from '../../assets/interests/weights.webp';
import jacket from '../../assets/interests/jacket.webp';
import music from '../../assets/interests/music.webp';
import pokemon from '../../assets/interests/pokemon-logo.svg';
import './InterestRebus.scss';

const cutouts = {
  basketball: { src: basketball, word: 'basketball', width: 298, height: 300 },
  weights: { src: weights, word: 'weights', width: 600, height: 267 },
  jacket: { src: jacket, word: 'jacket', width: 325, height: 300 },
  music: { src: music, word: 'music', width: 301, height: 300 },
  pokemon: { src: pokemon, word: 'pokémon cards', width: 269.46899, height: 98.879997 },
};

function Cutout({ name }) {
  const [failed, setFailed] = useState(false);
  const { src, word, width, height } = cutouts[name];
  return <span className={`interest-rebus__cutout interest-rebus__cutout--${name}`} style={{ '--cutout-ratio': width / height }}>
    {failed ? <span className="interest-rebus__fallback">{word}</span> :
      <img src={src} width={width} height={height} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />}
  </span>;
}

export default function InterestRebus({ reduced }) {
  return <aside className="interest-rebus" aria-labelledby="interest-note-title">
    <p id="interest-note-title" className="eyebrow">interests</p>
    <p className="sr-only">away from the keyboard, you’ll find me playing basketball, lifting weights, exploring fashion, listening to music, or collecting pokémon trading cards.</p>
    <m.p className="interest-rebus__sentence" aria-hidden="true"
      initial={reduced ? false : { opacity: 0, y: 9 }}
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={detailViewport}
      transition={{ duration: 0.52, ease: motionEase }}>
      away from the keyboard, you’ll find me{' '}
      <span className="interest-rebus__phrase"><strong>playing</strong> <Cutout name="basketball" />,</span>{' '}
      <span className="interest-rebus__phrase"><strong>lifting</strong> <Cutout name="weights" />,</span>{' '}
      exploring <span className="interest-rebus__phrase"><strong>fashion</strong> <Cutout name="jacket" />,</span>{' '}
      <span className="interest-rebus__phrase"><strong>listening</strong> to <Cutout name="music" />,</span>{' '}
      or <span className="interest-rebus__phrase"><span className="interest-rebus__condensed">collecting</span> <Cutout name="pokemon" />.</span>
    </m.p>
  </aside>;
}
