import { Locator, Page } from 'playwright';
import { HarnessEnvironment, TestElement, HarnessLoader } from '@angular/cdk/testing';
/**
 * Options to configure the environment.
 */
export interface PlaywrightHarnessEnvironmentOptions {
    /** The query function used to find DOM elements. */
    queryFn: (selector: string, root: Locator) => Locator;
}
/**
 * A `HarnessEnvironment` implementation for Playwright.
 */
export declare class PlaywrightHarnessEnvironment extends HarnessEnvironment<Locator> {
    /** The options for this environment. */
    private _options;
    documentRootLocator: Locator;
    protected constructor(rawRootElement: Locator, options?: PlaywrightHarnessEnvironmentOptions);
    static hello(): void;
    /** Creates a `HarnessLoader` rooted at the document root. */
    static loader(page: Page, options?: PlaywrightHarnessEnvironmentOptions): HarnessLoader;
    /**
     * Gets the Locator corresponding to the given TestElement.
     */
    static getNativeElement(el: TestElement): Locator;
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However,
     * there may be some edge cases where it is needed to fully flush animation
     * events.
     */
    forceStabilize(): Promise<void>;
    waitForTasksOutsideAngular(): Promise<void>;
    /**
     * Gets the root element for the document.
     */
    protected getDocumentRoot(): Locator;
    /**
     * Creates a `TestElement` from a raw element.
     */
    protected createTestElement(element: Locator): TestElement;
    /**
     * Creates a `HarnessLoader` rooted at the given raw element.
     */
    protected createEnvironment(element: Locator): HarnessEnvironment<Locator>;
    /**
     * Gets a list of all elements matching the given selector under this
     * environment's root element.
     */
    protected getAllRawElements(selector: string): Promise<Locator[]>;
}
