import React, { useLayoutEffect, useRef, useState } from 'react';
import { getRouteProgress, getRouteScrollMetrics } from './PaperJourney.utils';

const PAPER_PATH_HEIGHT = 1010;
const MOBILE_ROUTE_WIDTH = 720;
const MOBILE_TAIL_GUTTER = 16;
const MAX_CANVAS_DPR = 2;
const ENABLE_CANVAS_ROUTE = true;
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
  const canvasRef = useRef(null);
  const [route, setRoute] = useState(FALLBACK_ROUTE);

  useLayoutEffect(() => {
    const paper = paperRef.current;
    const canvas = canvasRef.current;
    if (!paper || !canvas) return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const printQuery = window.matchMedia('print');
    const canvasSupported = ENABLE_CANVAS_ROUTE
      && typeof window.Path2D === 'function'
      && typeof window.DOMMatrix === 'function'
      && typeof window.Path2D.prototype.addPath === 'function';

    let geometryFrame = 0;
    let scrollFrame = 0;
    let context = null;
    let cachedPath = null;
    let currentRoute = FALLBACK_ROUTE;
    let contextLost = false;
    let scrollListening = false;
    let disposed = false;
    let metrics = null;

    const showStaticFallback = () => {
      paper.removeAttribute('data-route-canvas');
      canvas.setAttribute('aria-hidden', 'true');
    };

    const clearScrollFrame = () => {
      if (scrollFrame) {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
      }
    };

    const drawCanvasRoute = () => {
      scrollFrame = 0;
      if (
        disposed
        || document.hidden
        || !context
        || !cachedPath
        || !metrics
        || contextLost
      ) {
        return false;
      }

      const scrollY = window.scrollY;
      const progress = getRouteProgress(scrollY, metrics.scroll);
      const revealHeight = progress * metrics.paperHeight;
      const paperViewportTop = metrics.paperTop - scrollY;
      const clipTop = Math.max(0, paperViewportTop);
      const clipBottom = Math.min(
        metrics.viewportHeight,
        paperViewportTop + revealHeight,
        paperViewportTop + metrics.paperHeight,
      );

      try {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (clipBottom > clipTop) {
          context.setTransform(metrics.dpr, 0, 0, metrics.dpr, 0, 0);
          context.save();
          context.beginPath();
          context.rect(0, clipTop, metrics.paperWidth, clipBottom - clipTop);
          context.clip();
          context.translate(0, paperViewportTop);
          context.strokeStyle = metrics.strokeStyle;
          context.lineWidth = 2.2;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.globalAlpha = 0.86;
          context.stroke(cachedPath);
          context.restore();
        }

        return true;
      } catch (error) {
        cachedPath = null;
        metrics = null;
        stopScrollListening();
        showStaticFallback();
        return false;
      }
    };

    const scheduleCanvasFrame = () => {
      if (!scrollFrame && !document.hidden) {
        scrollFrame = requestAnimationFrame(drawCanvasRoute);
      }
    };

    const onScroll = () => scheduleCanvasFrame();

    const stopScrollListening = () => {
      if (!scrollListening) return;
      window.removeEventListener('scroll', onScroll);
      scrollListening = false;
      clearScrollFrame();
    };

    const startScrollListening = () => {
      if (scrollListening) return;
      window.addEventListener('scroll', onScroll, { passive: true });
      scrollListening = true;
    };

    const canvasModeAllowed = () => {
      return canvasSupported
        && !reducedMotionQuery.matches
        && !printQuery.matches
        && !contextLost;
    };

    const prepareCanvas = (paperBounds, nextRoute) => {
      if (!canvasModeAllowed()) {
        stopScrollListening();
        showStaticFallback();
        return;
      }

      try {
        context ??= canvas.getContext('2d', {
          alpha: true,
          willReadFrequently: false,
        });

        if (!context) {
          stopScrollListening();
          showStaticFallback();
          return;
        }

        const paperWidth = paperBounds.width;
        const paperHeight = paperBounds.height;
        const viewportHeight = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
        const backingWidth = Math.max(1, Math.ceil(paperWidth * dpr));
        const backingHeight = Math.max(1, Math.ceil(viewportHeight * dpr));
        const sourcePath = new window.Path2D(nextRoute);
        const transformedPath = new window.Path2D();
        const pathTransform = new window.DOMMatrix().scale(
          paperWidth / 100,
          paperHeight / PAPER_PATH_HEIGHT,
        );

        transformedPath.addPath(sourcePath, pathTransform);

        if (canvas.width !== backingWidth) canvas.width = backingWidth;
        if (canvas.height !== backingHeight) canvas.height = backingHeight;

        canvas.style.left = `${paperBounds.left}px`;
        canvas.style.width = `${paperWidth}px`;
        canvas.style.height = `${viewportHeight}px`;

        cachedPath = transformedPath;
        metrics = {
          dpr,
          paperHeight,
          paperTop: paperBounds.top + window.scrollY,
          paperWidth,
          scroll: getRouteScrollMetrics({
            paperTop: paperBounds.top + window.scrollY,
            paperHeight,
            viewportHeight,
          }),
          strokeStyle: getComputedStyle(paper).getPropertyValue('--ink').trim() || '#090908',
          viewportHeight,
        };

        if (drawCanvasRoute()) {
          paper.setAttribute('data-route-canvas', 'ready');
          startScrollListening();
        } else {
          stopScrollListening();
          showStaticFallback();
        }
      } catch (error) {
        cachedPath = null;
        metrics = null;
        stopScrollListening();
        showStaticFallback();
      }
    };

    const updateRoute = () => {
      cancelAnimationFrame(geometryFrame);
      geometryFrame = requestAnimationFrame(() => {
        geometryFrame = 0;
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
        if (nextRoute !== currentRoute) {
          currentRoute = nextRoute;
          setRoute(nextRoute);
        }
        prepareCanvas(paperBounds, nextRoute);
      });
    };

    const onModeChange = () => {
      if (canvasModeAllowed()) {
        updateRoute();
      } else {
        stopScrollListening();
        showStaticFallback();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearScrollFrame();
      } else if (paper.dataset.routeCanvas === 'ready') {
        scheduleCanvasFrame();
      } else {
        updateRoute();
      }
    };

    const onContextLost = (event) => {
      event.preventDefault();
      contextLost = true;
      context = null;
      cachedPath = null;
      metrics = null;
      stopScrollListening();
      showStaticFallback();
    };

    const onContextRestored = () => {
      contextLost = false;
      context = null;
      updateRoute();
    };

    updateRoute();
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateRoute);

    resizeObserver?.observe(paper);
    paper.querySelectorAll('.paper-panel').forEach((panel) => resizeObserver?.observe(panel));
    window.addEventListener('resize', updateRoute, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    canvas.addEventListener('contextlost', onContextLost);
    canvas.addEventListener('contextrestored', onContextRestored);
    reducedMotionQuery.addEventListener('change', onModeChange);
    printQuery.addEventListener('change', onModeChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(geometryFrame);
      clearScrollFrame();
      stopScrollListening();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateRoute);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('contextlost', onContextLost);
      canvas.removeEventListener('contextrestored', onContextRestored);
      reducedMotionQuery.removeEventListener('change', onModeChange);
      printQuery.removeEventListener('change', onModeChange);
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
        <path className="paper-route__guide" d={route} />
        <path className="paper-route__progress" d={route} />
      </svg>

      <canvas ref={canvasRef} className="paper-route-canvas" aria-hidden="true" />

      <div className="paper-journey__content">{children}</div>
    </div>
  );
};

export default PaperJourney;
