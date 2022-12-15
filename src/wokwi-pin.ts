import {
  cString,
  HIGH,
  LOW,
  pinInit,
  pinRead,
  PinRef,
  pinWatch,
  PinWatchConfig,
  pinWatchStop,
  pinWrite,
  toCallback,
} from './wokwi-api';

export interface IPinChangeListener {
  pinChanged(pin: WokwiPin, newValue: boolean): void;
}

/**
 * Higher-level abstraction over the Wokwi Pin API.
 * Note: All the WokwiPin instances must be created inside your `chipInit` function.
 */
export class WokwiPin {
  private id: PinRef;
  private watcher: IPinChangeListener | null = null;

  constructor(readonly name: string, mode: u32) {
    this.id = pinInit(cString(name), mode);
  }

  read(): boolean {
    return pinRead(this.id) == HIGH;
  }

  write(value: boolean): void {
    pinWrite(this.id, value ? HIGH : LOW);
  }

  watch(listener: IPinChangeListener, edge: u32): boolean {
    if (this.watcher != null) {
      this.watchStop();
    }

    const config = new PinWatchConfig();
    this.watcher = listener;
    config.user_data = changetype<u32>(this);
    config.edge = edge;
    config.pin_change = toCallback((user_data: u32, pin: PinRef, value: u32): void => {
      const self = changetype<WokwiPin>(user_data);
      const watcher = self.watcher;
      if (watcher != null) {
        watcher.pinChanged(self, value == HIGH);
      }
    });
    return pinWatch(this.id, changetype<u32>(config));
  }

  watchStop(): void {
    pinWatchStop(this.id);
    this.watcher = null;
  }

  toString(): string {
    return `WokwiPin(${this.name})`;
  }
}
