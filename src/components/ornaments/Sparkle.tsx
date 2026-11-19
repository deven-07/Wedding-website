import { a11yProps, type OrnamentProps } from './types';

/** Four-point sparkle star (used for the reading-progress tip and night skies). */
export function Sparkle({ title, className = '', fill = 'url(#foil-grad-v)', ...rest }: OrnamentProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...a11yProps(title)} {...rest}>
      {title ? <title>{title}</title> : null}
      <path d="M12 0c.9 7.4 4.1 10.7 12 12-7.9 1.3-11.1 4.6-12 12-.9-7.4-4.1-10.7-12-12C7.9 10.7 11.1 7.4 12 0z" fill={fill} />
    </svg>
  );
}
