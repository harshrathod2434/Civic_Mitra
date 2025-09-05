/// <reference types="react-scripts" />

declare module 'react-transition-group' {
  import { ComponentType, ReactElement, Component } from 'react';

  export interface CSSTransitionProps {
    in?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    appear?: boolean;
    enter?: boolean;
    exit?: boolean;
    timeout: number | { enter?: number; exit?: number; appear?: number };
    classNames: string | {
      appear?: string;
      appearActive?: string;
      appearDone?: string;
      enter?: string;
      enterActive?: string;
      enterDone?: string;
      exit?: string;
      exitActive?: string;
      exitDone?: string;
    };
    children: ReactElement | ((status: string) => ReactElement);
    nodeRef?: React.RefObject<any>; // Add nodeRef property
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
    onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
    onExit?: (node: HTMLElement) => void;
    onExiting?: (node: HTMLElement) => void;
    onExited?: (node: HTMLElement) => void;
  }

  export class CSSTransition extends Component<CSSTransitionProps> {}
}