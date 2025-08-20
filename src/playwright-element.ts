import {
  ElementDimensions,
  EventData,
  ModifierKeys,
  TestElement,
  TestKey,
  TextOptions,
} from '@angular/cdk/testing';
import { Locator } from 'playwright';

import { playwrightKeyFromTextKey } from './playwright-testkeys.js';

/**
 * A `TestElement` implementation for Playwright.
 */
export class PlaywrightElement implements TestElement {

  constructor(public locator: Locator) { }

  /**
   * Blur the element.
   */
  blur(): Promise<void> {
    return this.locator.blur();
  }

  /**
   * Clear the element's input (for input and textarea elements only).
   */
  clear(): Promise<void> {
    return this.locator.clear({ force: true })
  }

  /**
   * Click the element at the default location for the current environment.
   * If you need to guarantee the element is clicked at a specific location,
   * consider using `click('center')` or `click(x, y)` instead.
   */
  click(modifiers?: ModifierKeys): Promise<void>;
  click(location: 'center', modifiers?: ModifierKeys): Promise<void>;
  /**
  * Click the element at the specified coordinates relative to the top-left of the element.
  * @param relativeX Coordinate within the element, along the X-axis at which to click.
  * @param relativeY Coordinate within the element, along the Y-axis at which to click.
  * @param modifiers Modifier keys held while clicking
  */
  click(relativeX: number, relativeY: number, modifiers?: ModifierKeys): Promise<void>
  click(relativeX?: unknown, relativeY?: unknown, modifiers?: ModifierKeys): Promise<void> {
    const modifierKeys: ('Alt' | 'Control' | 'Meta' | 'Shift')[] = [];
    if (modifiers?.alt) modifierKeys.push('Alt');
    if (modifiers?.control) modifierKeys.push('Control');
    if (modifiers?.meta) modifierKeys.push('Meta');
    if (modifiers?.shift) modifierKeys.push('Shift');

    return this.locator.click({
      button: 'left' as const,
      modifiers: modifierKeys,
      position: relativeX && relativeY ? { x: relativeX as number, y: relativeY as number } : undefined
    });
  }

  /**
   * Right clicks on the element at the specified coordinates relative to the top-left of it.
   * @param relativeX Coordinate within the element, along the X-axis at which to click.
   * @param relativeY Coordinate within the element, along the Y-axis at which to click.
   * @param modifiers Modifier keys held while clicking
   */
  rightClick(relativeX: number, relativeY: number, modifiers?: ModifierKeys): Promise<void> {
    const modifierKeys: ('Alt' | 'Control' | 'Meta' | 'Shift')[] = [];
    if (modifiers?.alt) modifierKeys.push('Alt');
    if (modifiers?.control) modifierKeys.push('Control');
    if (modifiers?.meta) modifierKeys.push('Meta');
    if (modifiers?.shift) modifierKeys.push('Shift');

    return this.locator.click({
      button: 'right' as const,
      modifiers: modifierKeys,
      position: relativeX && relativeY ? { x: relativeX, y: relativeY } : undefined
    });
  }

  /**
   * Focus the element.
   */
  focus(): Promise<void> {
    return this.locator.focus();
  }

  /**
   * Get the computed value of the given CSS property for the element.
   */
  getCssValue(property: string): Promise<string> {
    return this.locator.evaluate(e => {
      return window.getComputedStyle(e).getPropertyValue(property);
    });
  }

  /**
   * Hovers the mouse over the element.
   */
  hover(): Promise<void> {
    return this.locator.hover();
  }

  /**
   * Moves the mouse away from the element.
   */
  mouseAway(): Promise<void> {
    return this.locator.hover({
      position: { x: -1, y: -1 }
    });
  }

  /**
   * Sends the given string to the input as a series of key presses. Also fires
   * input events and attempts to add the string to the Element's value.
   */
  sendKeys(...keys: (string | TestKey)[]): Promise<void>;
  sendKeys(modifiers: ModifierKeys, ...keys: (string | TestKey)[]): Promise<void>
  async sendKeys(...modifiersAndKeys: unknown[]): Promise<void> {
    let modifiers: ModifierKeys = {};
    let keys: (string | TestKey)[] = [];

    if (modifiersAndKeys.length > 0 && typeof modifiersAndKeys[0] !== 'string' && typeof modifiersAndKeys[0] !== 'number') {
        modifiers = modifiersAndKeys[0] as ModifierKeys;
        keys = modifiersAndKeys.slice(1) as (string | TestKey)[];
    } else {
        keys = modifiersAndKeys as (string | TestKey)[];
    }

    // If there are no modifiers, we can use a simpler, more efficient approach.
    const hasModifiers = Object.values(modifiers).some(v => v);
    if (!hasModifiers) {
      for (const key of keys) {
        typeof key === 'string'
          ? await this.locator.pressSequentially(key)
          : await this.locator.press(playwrightKeyFromTextKey(key as TestKey));
      }

      return;
    }

    // When modifiers are active, we must build the "accelerator" string
    // and use locator.press() for every key.
    let prefix = '';
    if (modifiers.control) prefix += 'Control+';
    if (modifiers.alt) prefix += 'Alt+';
    if (modifiers.shift) prefix += 'Shift+';
    if (modifiers.meta) prefix += 'Meta+';

    for (const key of keys) {
      const keyString = typeof key === 'string' 
                        ? key 
                        : playwrightKeyFromTextKey(key as TestKey);
      
      // locator.press() handles multi-character strings like 'Control+Shift+T'
      await this.locator.press(`${prefix}${keyString}`);
    }
  }

  /**
   * Gets the text from the element.
   * @param options Options that affect what text is included.
   */
  text(options?: TextOptions): Promise<string> {
    if (options) {}
    return this.locator.textContent();
  }

  /**
    * Sets the value of a `contenteditable` element.
    * @param value Value to be set on the element.
    * @breaking-change 16.0.0 Will become a required method.
    */
  setContenteditableValue?(value: string): Promise<void> {
    return this.locator.pressSequentially(value);
  }

  /**
   * Gets the value for the given attribute from the element.
   */
  getAttribute(name: string): Promise<string | null> {
    return this.locator.getAttribute(name);
  }

  /**
   * Checks whether the element has the given class.
   */
  async hasClass(name: string): Promise<boolean> {
    const classes = (await this.getAttribute('class')) || '';
    return new Set(classes.split(/\s+/).filter(c => c)).has(name);
  }

  /**
   * Gets the dimensions of the element.
   */
  async getDimensions(): Promise<ElementDimensions> {
    const box = await this.locator.boundingBox();
    if (box === null) return { top: 0, left: 0, height: 0, width: 0 };
    return { top: box.y, left: box.x, height: box.height, width: box.width };
  }

  /**
   * Gets the value of a property of an element.
   */
  async getProperty<T = unknown>(name: string): Promise<T> {
    if (name === 'value') {
      return this.locator.inputValue() as T;
    }

    const handle = await this.locator.evaluateHandle('document');
    return (await handle.getProperty(name)).jsonValue() as Promise<T>;
  }

  /**
   * Checks whether this element matches the given selector.
   */
  async matchesSelector(selector: string): Promise<boolean> {
    return this.locator.evaluate((el, sel) => {
      return el.matches(sel);
    }, selector);
  }

  /**
   * Checks whether the element is focused.
   */
  isFocused(): Promise<boolean> {
    return this.locator.evaluate(e => e === document.activeElement);
  }

  /**
   * Sets the value of a property of an input.
   */
  setInputValue(value: string): Promise<void> {
    return this.locator.fill(value);
  }

  /**
   * Selects the options at the specified indexes inside of a native
   * `select` element.
   */
  selectOptions(...optionIndexes: number[]): Promise<void> {
    const options = optionIndexes.map(idx => {
      return { 'index': idx };
    });
    const result = this.locator.selectOption(options) as unknown;
    return result as Promise<void>;
  }

  /**
   * Dispatches an event with a particular name.
   * @param name Name of the event to be dispatched.
   */
  dispatchEvent(name: string, data?: Record<string, EventData>): Promise<void> {
    return this.locator.dispatchEvent(name, data);
  }
}