import React, { useEffect, useRef, useState } from 'react';
import { navItems } from '../data/portfolio';
import './JourneyRail.scss';

const clampProgress = (value) => Math.min(100, Math.max(0, value));
const NODE_POINTER_CLEARANCE = 5;
const STATION_LABEL_DISMISS_DISTANCE = 48;
const STATION_NAVIGATION_IDLE_DELAY = 180;

const getDocumentProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable > 0 ? clampProgress((window.scrollY / scrollable) * 100) : 0;
};

const fallbackStops = navItems.map((item, index) => ({
  ...item,
  progress: navItems.length > 1 ? (index / (navItems.length - 1)) * 100 : 0,
}));

const JourneyRail = ({ activeSection }) => {
  const frameRef = useRef(null);
  const metricsFrameRef = useRef(null);
  const isScrubbingRef = useRef(false);
  const previousScrollBehaviorRef = useRef('');
  const stationLabelOriginRef = useRef(null);
  const stationLabelsDismissedRef = useRef(false);
  const stationNavigationRef = useRef(false);
  const stationNavigationTimerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [sectionStops, setSectionStops] = useState(fallbackStops);
  const [stationLabelsDismissed, setStationLabelsDismissed] = useState(false);
  const [pinnedStationLabel, setPinnedStationLabel] = useState(null);

  useEffect(() => {
    const updateProgress = () => {
      frameRef.current = null;
      if (!isScrubbingRef.current) setProgress(getDocumentProgress());

      if (stationNavigationRef.current) {
        stationLabelOriginRef.current = window.scrollY;
        if (stationNavigationTimerRef.current) {
          window.clearTimeout(stationNavigationTimerRef.current);
        }
        stationNavigationTimerRef.current = window.setTimeout(() => {
          stationNavigationRef.current = false;
          stationLabelOriginRef.current = window.scrollY;
          stationNavigationTimerRef.current = null;
        }, STATION_NAVIGATION_IDLE_DELAY);
      } else if (
        !stationLabelsDismissedRef.current
          && stationLabelOriginRef.current !== null
          && Math.abs(window.scrollY - stationLabelOriginRef.current) > STATION_LABEL_DISMISS_DISTANCE
      ) {
        stationLabelsDismissedRef.current = true;
        setStationLabelsDismissed(true);
        setPinnedStationLabel(null);
      }
    };

    const requestUpdate = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    const updateSectionStops = () => {
      metricsFrameRef.current = null;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrollPadding = Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      ) || 0;

      const nextStops = navItems.map((item) => {
        const section = document.getElementById(item.id);
        if (!section) return { ...item, progress: 0 };

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrollMargin = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        return {
          ...item,
          progress: clampProgress(
            ((sectionTop - scrollMargin - scrollPadding) / scrollable) * 100,
          ),
        };
      });

      setSectionStops((currentStops) => {
        const unchanged = nextStops.every((stop, index) => (
          currentStops[index]?.id === stop.id
          && Math.abs(currentStops[index].progress - stop.progress) < 0.05
        ));
        return unchanged ? currentStops : nextStops;
      });
    };

    const requestMetricsUpdate = () => {
      requestUpdate();
      if (metricsFrameRef.current) return;
      metricsFrameRef.current = window.requestAnimationFrame(updateSectionStops);
    };

    updateProgress();
    updateSectionStops();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestMetricsUpdate);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(requestMetricsUpdate);
    const main = document.querySelector('main');
    if (main) resizeObserver?.observe(main);
    navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) resizeObserver?.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestMetricsUpdate);
      resizeObserver?.disconnect();
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (metricsFrameRef.current) window.cancelAnimationFrame(metricsFrameRef.current);
      if (stationNavigationTimerRef.current) {
        window.clearTimeout(stationNavigationTimerRef.current);
      }
      if (isScrubbingRef.current) {
        document.documentElement.style.scrollBehavior = previousScrollBehaviorRef.current;
      }
    };
  }, []);

  const beginScrub = () => {
    if (isScrubbingRef.current) return;
    const root = document.documentElement;
    previousScrollBehaviorRef.current = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    isScrubbingRef.current = true;
  };

  const finishScrub = () => {
    if (!isScrubbingRef.current) return;
    isScrubbingRef.current = false;
    document.documentElement.style.scrollBehavior = previousScrollBehaviorRef.current;
    previousScrollBehaviorRef.current = '';
    setProgress(getDocumentProgress());
  };

  const handleScrub = (event) => {
    const nextProgress = Number(event.target.value);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const root = document.documentElement;
    const restoreBehavior = !isScrubbingRef.current;
    const previousBehavior = root.style.scrollBehavior;

    if (restoreBehavior) root.style.scrollBehavior = 'auto';
    setProgress(nextProgress);
    window.scrollTo({ top: (nextProgress / 100) * scrollable, behavior: 'auto' });
    if (restoreBehavior) root.style.scrollBehavior = previousBehavior;
  };

  const revealStationLabel = () => {
    stationLabelOriginRef.current = window.scrollY;
    stationLabelsDismissedRef.current = false;
    setStationLabelsDismissed(false);
  };

  const handleStationPointerEnter = () => {
    if (stationLabelOriginRef.current === null || stationLabelsDismissedRef.current) {
      revealStationLabel();
    }
    setPinnedStationLabel(null);
  };

  const handleStationActivate = (id) => {
    revealStationLabel();
    setPinnedStationLabel(id);
    stationNavigationRef.current = true;
    if (stationNavigationTimerRef.current) {
      window.clearTimeout(stationNavigationTimerRef.current);
    }
    stationNavigationTimerRef.current = window.setTimeout(() => {
      stationNavigationRef.current = false;
      stationLabelOriginRef.current = window.scrollY;
      stationNavigationTimerRef.current = null;
    }, STATION_NAVIGATION_IDLE_DELAY);
  };

  const activeLabel = navItems.find(({ id }) => id === activeSection)?.label || 'Home';

  return (
    <aside
      className={`journey-rail${stationLabelsDismissed ? ' journey-rail--station-labels-dismissed' : ''}`}
      aria-label="Portfolio progress"
    >
      <span className="journey-rail__label">{activeLabel}</span>
      <label className="sr-only" htmlFor="portfolio-progress">
        Move through the portfolio
      </label>
      <div className="journey-rail__track">
        <input
          id="portfolio-progress"
          className="journey-rail__range"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleScrub}
          onPointerDown={beginScrub}
          onPointerUp={finishScrub}
          onPointerCancel={finishScrub}
          onBlur={finishScrub}
          aria-valuetext={`${Math.round(progress)} percent through the portfolio, viewing ${activeLabel}`}
          style={{ '--journey-progress': `${progress}%` }}
        />
        <nav className="journey-rail__stops" aria-label="Portfolio sections">
          {sectionStops.map(({ id, label, progress: stopProgress }) => {
            const sitsUnderThumb = Math.abs(stopProgress - progress) <= NODE_POINTER_CLEARANCE;

            return (
              <a
                key={id}
                className={`journey-rail__stop${sitsUnderThumb ? ' journey-rail__stop--under-thumb' : ''}${pinnedStationLabel === id ? ' journey-rail__stop--label-pinned' : ''}`}
                href={`#${id}`}
                aria-label={`Go to ${label}`}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={() => handleStationActivate(id)}
                onFocus={() => {
                  revealStationLabel();
                  setPinnedStationLabel(null);
                }}
                onPointerEnter={handleStationPointerEnter}
                style={{ '--section-progress': `${stopProgress}%` }}
              >
                <span>{label}</span>
              </a>
            );
          })}
        </nav>
      </div>
      <output htmlFor="portfolio-progress">{Math.round(progress)}%</output>
    </aside>
  );
};

export default JourneyRail;
