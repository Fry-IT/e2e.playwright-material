import { PlaywrightElement } from './playwright-element.js';
import { HarnessEnvironment } from '@angular/cdk/testing';
/** The default environment options. */
const defaultEnvironmentOptions = {
    queryFn: (selector, root) => root.locator(selector),
};
/**
 * A `HarnessEnvironment` implementation for Playwright.
 */
export class PlaywrightHarnessEnvironment extends HarnessEnvironment {
    /** The options for this environment. */
    _options;
    documentRootLocator;
    constructor(rawRootElement, options) {
        super(rawRootElement);
        this._options = { ...defaultEnvironmentOptions, ...options };
    }
    static hello() { return; }
    /** Creates a `HarnessLoader` rooted at the document root. */
    static loader(page, options) {
        const result = new PlaywrightHarnessEnvironment(page.locator('body'), options);
        result.documentRootLocator = page.locator('body');
        return result;
    }
    /**
     * Gets the Locator corresponding to the given TestElement.
     */
    static getNativeElement(el) {
        if (el instanceof PlaywrightElement) {
            return el.locator;
        }
        throw Error('This TestElement was not created by the PlaywrightHarnessEnvironment');
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However,
     * there may be some edge cases where it is needed to fully flush animation
     * events.
     */
    forceStabilize() {
        throw new Error('Not implemented!');
    }
    waitForTasksOutsideAngular() {
        throw new Error('Not implemented!');
    }
    /**
     * Gets the root element for the document.
     */
    getDocumentRoot() {
        return this.documentRootLocator;
    }
    /**
     * Creates a `TestElement` from a raw element.
     */
    createTestElement(element) {
        return new PlaywrightElement(element);
    }
    /**
     * Creates a `HarnessLoader` rooted at the given raw element.
     */
    createEnvironment(element) {
        const result = new PlaywrightHarnessEnvironment(element, this._options);
        result.documentRootLocator = this.documentRootLocator;
        return result;
    }
    /**
     * Gets a list of all elements matching the given selector under this
     * environment's root element.
     */
    async getAllRawElements(selector) {
        const elementArrayFinder = this._options.queryFn(selector, this.rawRootElement);
        const length = await elementArrayFinder.count();
        const elements = [];
        for (let i = 0; i < length; i++) {
            elements.push(elementArrayFinder.nth(i));
        }
        return elements;
    }
}
//# sourceMappingURL=playwright-harness-environment.js.map