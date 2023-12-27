declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "event-target-polyfill" {
  interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
  }

  export class Event {
    constructor(type: string, eventInitDict?: EventInit);
    readonly bubbles: boolean;
    readonly cancelable: boolean;
    readonly composed: boolean;
    readonly type: string;
  }

  export interface EventListenerOptions {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
  }

  export type EventListenerOrEventListenerObject =
    | EventListener
    | EventListenerObject;

  export interface EventListener {
    (evt: Event): void;
  }

  export interface EventListenerObject {
    handleEvent(evt: Event): void;
  }

  export class EventTarget {
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions
    ): void;
    dispatchEvent(event: Event): boolean;
  }
}
