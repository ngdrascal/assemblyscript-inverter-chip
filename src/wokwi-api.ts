/* Pin values */
export const LOW = 0;
export const HIGH = 1;

/* Pin modes */
export const INPUT = 0;
export const OUTPUT = 1;
export const INPUT_PULLUP = 2;
export const INPUT_PULLDOWN = 3;
export const ANALOG = 4;

export const OUTPUT_LOW = 16;
export const OUTPUT_HIGH = 17;

/* Pin edges */
export const EDGE_RISING = 1;
export const EDGE_FALLING = 2;
export const EDGE_BOTH = 3;

export function __wokwi_api_version_1(): u32 {
  return 1;
}

@external('env', 'debugPrint')
export declare function debugPrint(message: ArrayBuffer): void;

export type PinRef = i32;

export class PinWatchConfig {
  user_data: u32;
  edge: u32;
  pin_change: u32;

  constructor() {
    this.user_data = 0;
    this.edge = EDGE_BOTH;
    this.pin_change = 0; /* null callback */
  }
}

@external('env', 'pinInit')
export declare function pinInit(name: ArrayBuffer, mode: u32): PinRef;

@external('env', 'pinRead')
export declare function pinRead(pin: PinRef): u32;

@external('env', 'pinWrite')
export declare function pinWrite(pin: PinRef, value: u32): u32;

@external('env', 'pinMode')
export declare function pinMode(pin: PinRef, mode: u32): void;

@external('env', 'pinWatch')
export declare function pinWatch(pin: PinRef, mode: u32): boolean;

@external('env', 'pinWatchStop')
export declare function pinWatchStop(pin: PinRef): void;

/* --- Utility functions --- */

export function println(message: string): void {
  debugPrint(cString(message));
}

/* --- AssemblyScript Runtime Helpers --- */

/** 
 * Wokwi expects C-style UTF-8 strings, while AssemblyScript uses UTF-16 string internally. 
 * This method converts the string into a UTF-8 encoded, null-terminated string.
 */
export function cString(message: string): ArrayBuffer {
  return String.UTF8.encode(message, true);
}

/** Converts the given function into a table index that can be passed to Wokwi */
export function toCallback<T>(fn: T): u32 {
  return load<u32>(changetype<u32>(fn));
}

/* --- AssemblyScript Built-in Runtime Functions --- */
export function abort(message: string, fileName: string, line: u32, column: u32): void {
  println('abort: ' + message + ' at ' + fileName + ':' + line.toString());
}

export function trace(message: string, n?: i32, a0?: f64, a1?: f64, a2?: f64, a3?: f64, a4?: f64): void {
  println('[trace] ' + message);
}

export function seed(): f64 {
  // Unfortunately, Wokwi does not provide a random seed API at the moment
  return 0;
}
