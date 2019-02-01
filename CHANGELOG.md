# react-svg-ionicons Changes

## \[0.2.1] - 2019-02-01

### Changed

- Update Readme.
- Allows to accept custom names in addIcons (TS typings).
- Ko-fi link.
- [MarkdownLint](https://www.npmjs.com/package/markdownlint) rules.

### Fixed

- The propType `iconType` must be `mode`.
- Fix `Nullable` typing error

## \[0.2.0] - 2019-02-01

### Added

- Add ESLint and fix minor linting issues.
- ~~@jsbits/get-package-version~~

### Changed

- Optimize icon type detection (iOS/MD).
- Optimize logic for merging user props with defaults.
- Minor refactorization to the main component, more comments.
- Change folder names "bundle" and "icon" to "bundles" and "icons", for consistency with the ion-icon Web Component.
- Change the property `iconType` to `mode`, for consistency with the ion-icon web-component.
- Remove the `IonIconSizes` interface as `setSizes` will accept any names, now the predefined ones are "small" (18px) and "large" (32px), consistent with the ion-icon Web Component.
- Allow to pass `null` to remove properties in addIcons, setDefaults, and setSizes.
- Give lowest precedence to default color and sizes.

## \[0.1.4] - 2019-01-31

First commit.
