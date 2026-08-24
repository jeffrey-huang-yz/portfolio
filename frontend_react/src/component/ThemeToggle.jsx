import React, { useEffect, useState } from 'react';

const preferences = ['auto', 'light', 'dark'];

const getSavedPreference = () => {
  const saved = window.localStorage.getItem('theme-preference');
  return preferences.includes(saved) ? saved : 'auto';
};

const ThemeToggle = () => {
  const [preference, setPreference] = useState(getSavedPreference);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (preference === 'auto') root.removeAttribute('data-theme');
      else root.dataset.theme = preference;

      const effectiveTheme = preference === 'auto' ? (media.matches ? 'dark' : 'light') : preference;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', effectiveTheme === 'dark' ? '#080808' : '#f8f8f5');
    };

    applyTheme();
    window.localStorage.setItem('theme-preference', preference);
    media.addEventListener('change', applyTheme);

    return () => media.removeEventListener('change', applyTheme);
  }, [preference]);

  const cycleTheme = () => {
    const nextIndex = (preferences.indexOf(preference) + 1) % preferences.length;
    setPreference(preferences[nextIndex]);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={`Theme is ${preference}. Change color theme.`}
      title={`Theme: ${preference}`}
    >
      <span className="theme-toggle__glyph" aria-hidden="true">
        {preference === 'auto' ? '◐' : preference === 'light' ? '○' : '●'}
      </span>
      <span className="theme-toggle__label">{preference}</span>
    </button>
  );
};

export default ThemeToggle;
