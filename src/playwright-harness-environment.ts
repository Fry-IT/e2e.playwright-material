import { HarnessEnvironment, TestElement, HarnessLoader } from '@angular/cdk/testing';
import { Locator, Page } from 'playwright';

import { PlaywrightElement } from './playwright-element.js';

/**
 * Options to configure the environment.
 */
export interface PlaywrightHarnessEnvironmentOptions {
  /** The query function used to find DOM elements. */
  queryFn: (selector: string, root: Locator) => Locator;
}

/** The default environment options. */
const defaultEnvironmentOptions: PlaywrightHarnessEnvironmentOptions = {
  queryFn: (selector: string, root: Locator) => root.locator(selector),
};

/**
 * A `HarnessEnvironment` implementation for Playwright.
 */
export class PlaywrightHarnessEnvironment extends HarnessEnvironment<Locator> {
  /** The options for this environment. */
  private _options: PlaywrightHarnessEnvironmentOptions;

  public documentRootLocator!: Locator;

  protected constructor(
    rawRootElement: Locator,
    options?: PlaywrightHarnessEnvironmentOptions,
  ) {
    super(rawRootElement);
    this._options = { ...defaultEnvironmentOptions, ...options };
  }

  /** Creates a `HarnessLoader` rooted at the document root. */
  static loader(page: Page, options?: PlaywrightHarnessEnvironmentOptions): HarnessLoader {
    const result = new PlaywrightHarnessEnvironment(page.locator('body'), options);
    result.documentRootLocator = page.locator('body');
    return result;
  }

  /**
   * Gets the Locator corresponding to the given TestElement.
   */
  static getNativeElement(el: TestElement): Locator {
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
  forceStabilize(): Promise<void> {
    throw new Error('Not implemented!');
  }

  waitForTasksOutsideAngular(): Promise<void> {
    throw new Error('Not implemented!');
  }

  /**
   * Gets the root element for the document.
   */
  protected getDocumentRoot(): Locator {
    return this.documentRootLocator;
  }

  /**
   * Creates a `TestElement` from a raw element.
   */
  protected createTestElement(element: Locator): TestElement {
    return new PlaywrightElement(element);
  }

  /**
   * Creates a `HarnessLoader` rooted at the given raw element.
   */
  protected createEnvironment(element: Locator): HarnessEnvironment<Locator> {
    const result = new PlaywrightHarnessEnvironment(element, this._options);
    result.documentRootLocator = this.documentRootLocator;
    return result;
  }

  /**
   * Gets a list of all elements matching the given selector under this
   * environment's root element.
   */
  protected getAllRawElements(selector: string): Promise<Locator[]> {
    const elementsLocator = this._options.queryFn(selector, this.rawRootElement);
    return elementsLocator.all();
  }
}