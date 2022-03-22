/**
 * A `TestElement` implementation for Playwright.
 */
export class PlaywrightElement {
    locator;
    constructor(locator) {
        this.locator = locator;
    }
    /**
     * Blur the element.
     */
    blur() {
        return this.locator.evaluate(e => e.blur());
    }
    /**
     * Clear the element's input (for input and textarea elements only).
     */
    clear() {
        return this.locator.fill('');
    }
    click(relativeX, relativeY, modifiers) {
        const modifierKeys = [];
        if (modifiers?.alt)
            modifierKeys.push('Alt');
        if (modifiers?.control)
            modifierKeys.push('Control');
        if (modifiers?.meta)
            modifierKeys.push('Meta');
        if (modifiers?.shift)
            modifierKeys.push('Shift');
        return this.locator.click({
            button: 'left',
            modifiers: modifierKeys,
            position: relativeX && relativeY ? { x: relativeX, y: relativeY } : undefined
        });
    }
    /**
     * Right clicks on the element at the specified coordinates relative to the top-left of it.
     * @param relativeX Coordinate within the element, along the X-axis at which to click.
     * @param relativeY Coordinate within the element, along the Y-axis at which to click.
     * @param modifiers Modifier keys held while clicking
     */
    rightClick(relativeX, relativeY, modifiers) {
        const modifierKeys = [];
        if (modifiers?.alt)
            modifierKeys.push('Alt');
        if (modifiers?.control)
            modifierKeys.push('Control');
        if (modifiers?.meta)
            modifierKeys.push('Meta');
        if (modifiers?.shift)
            modifierKeys.push('Shift');
        return this.locator.click({
            button: 'right',
            modifiers: modifierKeys,
            position: relativeX && relativeY ? { x: relativeX, y: relativeY } : undefined
        });
    }
    /**
     * Focus the element.
     */
    focus() {
        return this.locator.focus();
    }
    /**
     * Get the computed value of the given CSS property for the element.
     */
    getCssValue(property) {
        return this.locator.evaluate(e => {
            return window.getComputedStyle(e).getPropertyValue(property);
        });
    }
    /**
     * Hovers the mouse over the element.
     */
    hover() {
        return this.locator.hover();
    }
    /**
     * Moves the mouse away from the element.
     */
    mouseAway() {
        return this.locator.hover({
            position: { x: -1, y: -1 }
        });
    }
    sendKeys(...modifiersAndKeys) {
        if ((modifiersAndKeys ?? []).length === 0)
            return new Promise(() => { return; });
        let text = '';
        if (typeof modifiersAndKeys[0] === 'string') {
            text = modifiersAndKeys.join('');
        }
        else {
            throw new Error('Not sure how to send TestKey...');
        }
        return this.locator.type(text);
    }
    /**
     * Gets the text from the element.
     * @param options Options that affect what text is included.
     */
    text(options) {
        if (options) { }
        return this.locator.textContent();
    }
    /**
     * Gets the value for the given attribute from the element.
     */
    getAttribute(name) {
        return this.locator.getAttribute(name);
    }
    /**
     * Checks whether the element has the given class.
     */
    async hasClass(name) {
        const classes = (await this.getAttribute('class')) || '';
        return new Set(classes.split(/\s+/).filter(c => c)).has(name);
    }
    /**
     * Gets the dimensions of the element.
     */
    async getDimensions() {
        const box = await this.locator.boundingBox();
        if (box === null)
            return { top: 0, left: 0, height: 0, width: 0 };
        return { top: box?.y, left: box?.x, height: box?.height, width: box?.width };
    }
    /**
     * Gets the value of a property of an element.
     */
    async getProperty(name) {
        const handle = await this.locator.evaluateHandle('document');
        return (await handle.getProperty(name)).jsonValue();
    }
    /**
     * Checks whether this element matches the given selector.
     */
    async matchesSelector(selector) {
        const count = await this.locator.locator(selector).count();
        return count > 0;
    }
    /**
     * Checks whether the element is focused.
     */
    isFocused() {
        return this.locator.evaluate(e => e === document.activeElement);
    }
    /**
     * Sets the value of a property of an input.
     */
    setInputValue(value) {
        return this.locator.fill(value);
    }
    /**
     * Selects the options at the specified indexes inside of a native
     * `select` element.
     */
    selectOptions(...optionIndexes) {
        const options = optionIndexes.map(idx => {
            return { 'index': idx };
        });
        const result = this.locator.selectOption(options);
        return result;
    }
    /**
     * Dispatches an event with a particular name.
     * @param name Name of the event to be dispatched.
     */
    dispatchEvent(name, data) {
        return this.locator.dispatchEvent(name, data);
    }
}
//# sourceMappingURL=playwright-element.js.map