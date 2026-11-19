import { Component, type ErrorInfo, type ReactNode } from 'react';
import { coupleName, wedding } from '../../config/wedding';
import { FourCorners } from '../ornaments/CornerFiligree';
import { Divider } from '../ornaments/Divider';
import { GoldButton } from './GoldButton';

interface Props {
  children: ReactNode;
}
interface State {
  failed: boolean;
}

/**
 * Last line of defence: if any part of the page fails to render (e.g. a file
 * could not be downloaded on a poor connection) guests see an elegant card
 * with the couple's names and a reload button — never a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Invitation failed to render', error, info.componentStack);
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="tex-velvet tex-damask screen-h safe-pad-x flex items-center justify-center py-12">
        <div className="tex-paper on-paper relative w-full max-w-[26rem] rounded-[6px] px-8 py-12 text-center shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]">
          <div aria-hidden="true" className="absolute inset-2">
            <FourCorners tone="paper" className="h-10 w-10" />
          </div>
          <p lang="sa" className="text-invocation text-maroon">
            {wedding.invocation}
          </p>
          <h1 className="foil-text-paper mt-6 font-serif text-[length:clamp(2.2rem,10vw,3rem)] font-medium leading-tight tracking-[0.12em]">
            {coupleName}
          </h1>
          <Divider tone="paper" className="mx-auto mt-5 h-4 w-[min(12rem,70%)]" />
          <p className="mt-5 text-lead text-burgundy">{wedding.ui.loadFailed}</p>
          <GoldButton
            className="mt-7"
            onClick={() => {
              window.location.reload();
            }}
          >
            {wedding.ui.reload}
          </GoldButton>
        </div>
      </main>
    );
  }
}
