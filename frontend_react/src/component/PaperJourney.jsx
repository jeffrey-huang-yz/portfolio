import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const PAPER_PATH_HEIGHT = 1010;
const ROUTE_SCROLL_OFFSETS = ['start 64%', 'end 100%'];
const ROUTE_REVEAL_ID = 'paper-route-reveal';
const MOBILE_ROUTE_WIDTH = 720;
const MOBILE_TAIL_GUTTER = 16;
const FALLBACK_ROUTE = 'M 9 0 C 9 52, 12 93, 12 145 C 12 167, 87 183, 87 205 C 87 247, 91 281, 91 323 C 91 347, 12 364, 12 388 C 12 455, 10 508, 10 575 C 10 630, 87 653, 87 708 C 87 758, 88 782, 88 832 C 88 859, 12 873, 12 900 C 12 944, 15 966, 15 1010';

const roundCoordinate = (value) => Math.round(value * 100) / 100;

const createRouteThrough = (waypoints, tail) => {
  if (waypoints.length === 0) return FALLBACK_ROUTE;

  const finalWaypoint = waypoints[waypoints.length - 1];
  const points = [
    { x: waypoints[0].x, y: 0 },
    ...waypoints,
    ...(tail ? [{ x: tail.x, y: tail.turnY }] : []),
    { x: tail?.x ?? finalWaypoint.x, y: PAPER_PATH_HEIGHT },
  ];

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const handle = (point.y - previous.y) * 0.36;
    return `${path} C ${roundCoordinate(previous.x)} ${roundCoordinate(previous.y + handle)}, ${roundCoordinate(point.x)} ${roundCoordinate(point.y - handle)}, ${roundCoordinate(point.x)} ${roundCoordinate(point.y)}`;
  }, `M ${roundCoordinate(points[0].x)} 0`);
};

const PaperJourney = ({ children }) => {
  const paperRef = useRef(null);
  const [route, setRoute] = useState(FALLBACK_ROUTE);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: paperRef,
    offset: ROUTE_SCROLL_OFFSETS,
  });
  const revealHeight = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PAPER_PATH_HEIGHT],
  );

  useLayoutEffect(() => {
    const paper = paperRef.current;
    if (!paper) return undefined;

    let animationFrame;
    const updateRoute = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const paperBounds = paper.getBoundingClientRect();
        if (paperBounds.width === 0 || paperBounds.height === 0) return;

        const markers = Array.from(paper.querySelectorAll('.paper-panel__scrap'));
        const markerBounds = markers.map((marker) => marker.getBoundingClientRect());
        const waypoints = markerBounds.map((bounds) => {
          return {
            x: ((bounds.left + bounds.width / 2 - paperBounds.left) / paperBounds.width) * 100,
            y: ((bounds.top + bounds.height / 2 - paperBounds.top) / paperBounds.height) * PAPER_PATH_HEIGHT,
          };
        });

        let tail;
        if (paperBounds.width <= MOBILE_ROUTE_WIDTH && markers.length > 0) {
          const finalMarker = markers[markers.length - 1];
          const finalMarkerBounds = markerBounds[markerBounds.length - 1];
          const finalContent = finalMarker
            .closest('.paper-panel')
            ?.querySelector('.paper-panel__content');

          if (finalContent) {
            const finalContentBounds = finalContent.getBoundingClientRect();
            const markerCenter = finalMarkerBounds.left + finalMarkerBounds.width / 2;
            const exitsRight = markerCenter > paperBounds.left + paperBounds.width / 2;
            const tailPosition = exitsRight
              ? Math.min(
                paperBounds.right - MOBILE_TAIL_GUTTER,
                finalContentBounds.right + MOBILE_TAIL_GUTTER,
              )
              : Math.max(
                paperBounds.left + MOBILE_TAIL_GUTTER,
                finalContentBounds.left - MOBILE_TAIL_GUTTER,
              );
            const finalWaypoint = waypoints[waypoints.length - 1];

            tail = {
              x: ((tailPosition - paperBounds.left) / paperBounds.width) * 100,
              turnY: Math.min(
                PAPER_PATH_HEIGHT - 1,
                finalWaypoint.y
                  + ((finalMarkerBounds.height * 1.25) / paperBounds.height) * PAPER_PATH_HEIGHT,
              ),
            };
          }
        }

        const nextRoute = createRouteThrough(waypoints, tail);
        setRoute((currentRoute) => (currentRoute === nextRoute ? currentRoute : nextRoute));
      });
    };

    updateRoute();
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateRoute);

    resizeObserver?.observe(paper);
    paper.querySelectorAll('.paper-panel').forEach((panel) => resizeObserver?.observe(panel));
    window.addEventListener('resize', updateRoute, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateRoute);
    };
  }, []);

  return (
    <div ref={paperRef} className="paper-journey">
      <svg
        className="paper-route"
        viewBox={`0 0 100 ${PAPER_PATH_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={ROUTE_REVEAL_ID} clipPathUnits="userSpaceOnUse">
            <motion.rect
              x="0"
              y="0"
              width="100"
              height={reduceMotion ? PAPER_PATH_HEIGHT : revealHeight}
            />
          </clipPath>
        </defs>
        <path className="paper-route__guide" d={route} />
        <path
          className="paper-route__progress"
          d={route}
          clipPath={`url(#${ROUTE_REVEAL_ID})`}
        />
      </svg>

      <div className="paper-journey__content">{children}</div>
    </div>
  );
};

export default PaperJourney;
