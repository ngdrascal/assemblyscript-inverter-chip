import { EDGE_BOTH, INPUT, OUTPUT, println } from './wokwi-api';
import { IPinChangeListener, WokwiPin } from './wokwi-pin';
export { __wokwi_api_version_1 } from './wokwi-api';

class InverterChip implements IPinChangeListener {
  pinIn: WokwiPin;
  pinOut: WokwiPin;

  constructor() {
    this.pinIn = new WokwiPin('IN', INPUT);
    this.pinOut = new WokwiPin('OUT', OUTPUT);
    this.pinOut.write(!this.pinIn.read());
    this.pinIn.watch(this, EDGE_BOTH);
  }

  pinChanged(pin: WokwiPin, newValue: boolean): void {
    println(`Pin ${pin.name} changed to ${newValue}`);
    this.pinOut.write(!newValue);
  }
}

export function chipInit(): void {
  println('Hello from inverter chip!');
  new InverterChip();
}
