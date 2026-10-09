// three.js, pinned. Loaded with a dynamic import so a failed load shows a screen, not a blank page.
export const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';
export const loadThree = () => import(THREE_URL);
