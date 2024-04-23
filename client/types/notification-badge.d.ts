declare module 'react-notification-badge' {
  export default function NotificationBadge(props: NotificationBadgeProps): JSX.Element;

  export interface NotificationBadgeProps {
    count?: number;
    effect?: Effect;
    style?: React.CSSProperties;
    className?: string;
  }

  export enum Effect {
    DEFAULT = 'DEFAULT',
    SCALE = 'SCALE',
    POP = 'POP',
    SLIDE = 'SLIDE',
    GENIE = 'GENIE',
    JELLO = 'JELLO',
    TADA = 'TADA',
    FLIP = 'FLIP',
    ROTATE_X = 'ROTATE_X',
    ROTATE_Y = 'ROTATE_Y',
  }
}
