import { TestKey } from '@angular/cdk/testing';

export function playwrightKeyFromTextKey(key: TestKey): string {
  switch (key) {
    case TestKey.BACKSPACE: return 'Backspace';
    case TestKey.TAB: return 'Tab';
    case TestKey.ENTER: return 'Enter';
    case TestKey.SHIFT: return 'Shift';
    case TestKey.CONTROL: return 'Control';
    case TestKey.ALT: return 'Alt';
    case TestKey.ESCAPE: return 'Escape';
    case TestKey.PAGE_UP: return 'PageUp';
    case TestKey.PAGE_DOWN: return 'PageDown';
    case TestKey.END: return 'End';
    case TestKey.HOME: return 'Home';
    case TestKey.LEFT_ARROW: return 'ArrowLeft';
    case TestKey.UP_ARROW: return 'ArrowUp';
    case TestKey.RIGHT_ARROW: return 'ArrowRight';
    case TestKey.DOWN_ARROW: return 'ArrowDown';
    case TestKey.INSERT: return 'Insert';
    case TestKey.DELETE: return 'Delete';
    case TestKey.F1: return 'F1';
    case TestKey.F2: return 'F2';
    case TestKey.F3: return 'F3';
    case TestKey.F4: return 'F4';
    case TestKey.F5: return 'F5';
    case TestKey.F6: return 'F6';
    case TestKey.F7: return 'F7';
    case TestKey.F8: return 'F8';
    case TestKey.F9: return 'F9';
    case TestKey.F10: return 'F10';
    case TestKey.F11: return 'F11';
    case TestKey.F12: return 'F12';
    case TestKey.META: return 'Meta';
    default:
      throw new Error(`Unsupported TestKey: ${key}`);
  }
}