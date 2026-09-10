import React, { useLayoutEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { profileDescription } from '../../data/portfolio';
import { easeScrollProgress, smoothPinnedDistance } from '../../motion';
import './CapabilityStack.scss';

const marks = ['WEB', 'UX', 'SYS'];
const clamp = (value) => Math.max(0, Math.min(1, value));

export const stackFrame = (distance, steps) => {
  const openness = steps.map(({ start, hold, travel }) => 1 - easeScrollProgress((distance - start - hold) / travel));
  const closed = openness.filter((value) => value === 0).length;
  return { openness, closed, active: closed < steps.length ? closed : -1 };
};

const StackCard = ({ item, index, renderVisual, open, register }) => (
  <article className="stack-card" ref={(node) => register(index, node)}>
    <h4 className="stack-card__title">
      <span className="stack-card__static-title">
        <span className="stack-card__number" aria-hidden="true">0{index + 1}</span>
        <span>{item.title}</span>
      </span>
    </h4>
    <div className="stack-card__detail" id={`stack-detail-${index}`} aria-hidden={!open}>
      <div className="stack-card__content">
        <p>{profileDescription(item)}</p>
        {renderVisual(marks[index] || 'DEV', index)}
      </div>
    </div>
  </article>
);

export default function CapabilityStack({ items, reduced, renderVisual }) {
  const scene = useRef(null);
  const stage = useRef(null);
  const intro = useRef(null);
  const cards = useRef([]);
  const metrics = useRef(null);
  const [closed, setClosed] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (!scene.current || !items.length) return undefined;
    const element = scene.current;
    const stageElement = stage.current;
    let disposed = false;
    let lastClosed = -1;
    let lastPin = -1;
    const update = (scroll) => {
      const data = metrics.current;
      if (!data) return;
      const distance = Math.max(0, scroll - data.top);
      const frame = stackFrame(distance, data.steps);
      const position = smoothPinnedDistance(distance, data.duration);
      // Position and heights land in the same scroll frame, without a second render queue.
      if (position !== lastPin) stageElement.style.transform = `translate3d(0, ${position}px, 0)`;
      lastPin = position;
      data.details.forEach((detail, index) => {
        const amount = frame.openness[index];
        if (data.previous[index] === amount) return;
        detail.style.height = `${data.steps[index].height * amount}px`;
        detail.style.opacity = String(easeScrollProgress(clamp(amount * 2)));
        data.previous[index] = amount;
      });
      if (lastClosed !== frame.closed) setClosed(frame.closed);
      lastClosed = frame.closed;
    };
    const reset = () => {
      metrics.current = null;
      element.style.removeProperty('height');
      cards.current.forEach((card) => {
        const detail = card?.querySelector('.stack-card__detail');
        detail?.style.removeProperty('height');
        detail?.style.removeProperty('opacity');
      });
      stageElement.style.removeProperty('transform');
      lastPin = -1;
      lastClosed = 0;
      setClosed(0);
      setEnabled(false);
    };
    const measure = () => {
      if (disposed) return;
      if (reduced) { reset(); return; }
      const viewport = window.innerHeight;
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 100;
      const hold = Math.max(120, Math.min(220, viewport * 0.22));
      const headers = cards.current.slice(0, items.length).map((card) => card.querySelector('.stack-card__title').offsetHeight);
      const heights = cards.current.slice(0, items.length).map((card) => card.querySelector('.stack-card__content').offsetHeight);
      const compact = intro.current.offsetHeight + headers.reduce((sum, height) => sum + height, 0) + items.length;
      // Short viewports use normal flow so no description is pinned out of reach.
      if (compact + Math.max(...heights) + offset + 20 > viewport) { reset(); return; }
      let duration = 0;
      const steps = heights.map((height) => {
        const step = { start: duration, hold, travel: height * 1.25 + 96, height };
        duration += hold + step.travel;
        return step;
      });
      metrics.current = {
        steps, duration, top: element.getBoundingClientRect().top + window.scrollY - offset,
        details: cards.current.slice(0, items.length).map((card) => card.querySelector('.stack-card__detail')),
        previous: [],
      };
      // A fixed track avoids document-height changes and moving anchor destinations.
      // At its end, the consumed track is above the viewport and only compact rows remain.
      element.style.height = `${duration + compact}px`;
      setEnabled(true);
      update(window.scrollY);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(intro.current);
    cards.current.slice(0, items.length).forEach((card) => {
      observer.observe(card.querySelector('.stack-card__title'));
      observer.observe(card.querySelector('.stack-card__content'));
    });
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    const unsubscribe = scrollY.on('change', update);
    return () => {
      disposed = true;
      observer.disconnect();
      unsubscribe();
      window.removeEventListener('resize', measure);
    };
  }, [items, reduced, scrollY]);

  const jump = (index) => {
    const data = metrics.current;
    if (!data) {
      cards.current[index]?.scrollIntoView({ behavior: 'instant', block: 'center' });
      return;
    }
    const step = data.steps[index];
    const position = step.start + step.hold / 2;
    const target = data.top + position;
    if (lenis) { lenis.resize(); lenis.scrollTo(target); }
    else window.scrollTo({ top: target, behavior: reduced ? 'instant' : 'smooth' });
  };
  const active = closed < items.length ? closed : -1;

  return <div ref={scene} className={`stack-scene${enabled ? ' stack-scene--animated' : ''}`}>
    <div ref={stage} className="stack-stage">
      <div ref={intro} className="stack-intro">
        <h3>Proficient across the whole stack</h3>
        <nav aria-label="Explore the stack" className="stack-steps">
          {items.map((item, index) => <button key={item._id || item.title} type="button" className={`stack-step stack-step--${index % 3}`} aria-label={`${index + 1}. ${item.title}`} aria-current={enabled && active === index ? 'step' : undefined} onClick={() => jump(index)}>
            <span>{index + 1}</span>
          </button>)}
        </nav>
      </div>
      <div className="stack-cards">
        {items.map((item, index) => <StackCard key={item._id || item.title} item={item} index={index} open={!enabled || index >= closed} register={(i, node) => { cards.current[i] = node; }} renderVisual={renderVisual} />)}
      </div>
    </div>
  </div>;
}
