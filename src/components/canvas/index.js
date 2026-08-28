import { lazy } from 'react';

// Ogni canvas è dietro un import() dinamico: three, drei e fiber finiscono in
// chunk separati che non entrano nel percorso critico. Il bundle d'ingresso
// torna a contenere solo React e il markup, e il 3D arriva quando serve.
export const ComputersCanvas = lazy(() => import('./Computers'));
export const RocketCanvas = lazy(() => import('./Rocket'));
export const TechCanvas = lazy(() => import('./TechCanvas'));
export const StarsCanvas = lazy(() => import('./Stars'));
