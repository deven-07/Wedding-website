import { LazyMotion, MotionConfig } from 'framer-motion';
import { Suspense } from 'react';
import { FoilDefs } from './components/ornaments/FoilDefs';
import { Invitation } from './components/Invitation';
import { MusicProvider } from './components/ui/MusicProvider';
import { ToastProvider } from './components/ui/Toast';
import { useHashRoute } from './hooks/useHashRoute';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { lazyWithRetry } from './lib/lazyWithRetry';

const CreateLinkPage = lazyWithRetry(() => import('./components/CreateLinkPage'));
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default);

export default function App() {
  const route = useHashRoute();

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <ErrorBoundary>
        <ToastProvider>
          <FoilDefs />
          {route === '/create-link' ? (
            <Suspense fallback={<div className="tex-velvet screen-h" />}>
              <CreateLinkPage />
            </Suspense>
          ) : (
            <MusicProvider>
              <Invitation />
            </MusicProvider>
          )}
        </ToastProvider>
        </ErrorBoundary>
      </LazyMotion>
    </MotionConfig>
  );
}
