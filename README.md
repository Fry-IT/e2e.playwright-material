# Playwright for Angular Material

This project implements required infrastructure to use Playwright
as for testing Angular Material using
[Component test harnesses](https://material.angular.io/cdk/test-harnesses/overview).

We implement TestElement subclass as well as HarnessEnvironment
subclass as per `API for harness environment authors` in the above document.

## Building and releasing

The NPM package is hosted on our GitHub NPM repository, make sure you
have permission to read/write packages to be able to publish the new
version.

```
npm version major|minor|patch
npm run build
npm publish
```