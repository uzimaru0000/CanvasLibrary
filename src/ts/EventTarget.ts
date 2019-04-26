export interface IEventTarget {
  addEventListener(target: string, func: (e: Event) => void);
  removeEventListener(target: string, func: (e: Event) => void);
  dispatchEvent(target: string, e: Event);
}

export type Event = UpdateEvent;

export interface UpdateEvent {
  readonly type: "update";
  dt: number;
}
