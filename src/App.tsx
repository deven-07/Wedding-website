import { LazyMotion, MotionConfig } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { FoilDefs } from './components/ornaments/FoilDefs';
import { Invitation } from './components/Invitation';
import { MusicProvider } from './components/ui/MusicProvider';
import { ToastProvider } from './components/ui/Toast';
import { useHashRoute } from './hooks/useHashRoute';

const CreateLinkPage = lazy(() => import('./components/CreateLinkPage'));
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default);

export default function App() {
  const route = useHashRoute();

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
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
      </LazyMotion>
    </MotionConfig>
  );
}
