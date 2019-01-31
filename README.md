# react-svg-ionicons

[![License][license-badge]][license-url]
[![npm Version][npm-badge]][npm-url]

Flexible and performant SVG Ionicon component for React.

From the [Ionicon site](https://ionicons.com/)

> Ionicons is a completely open-source icon set with 700+ icons crafted for web, iOS, Android, and desktop apps. Ionicons was built for Ionic Framework, so icons have both Material Design and iOS versions.

The IonIcon component will automatically use the correct version based on your platform.

In addition to the styles and classes that you define, each icon has a `className` formed with the prefix "ion-" and the name of the icon. For example, the "apps" icon has the class name "ion-apps".

This is WIP, right now I don't have time to document this component. I hope the following brief explanations will be helpful.

Thanks to the [Ionic Framework](https://ionicframework.com/) team for their awesome work.

## Install

```bash
yarn add react-svg-ionicons
```

## Usage

```js
import { IonIcon, addIcons } from 'react-svg-ionicons'
import bundle from 'react-svg-ionicons/bundle/all'

// This loads the full Ionicon set,
// but you can also load only the ones that you require.
addIcons(bundle)

// From here, you can use the loaded icons anywhere in your App
<IonIcon name="add" size="large" color="red" strokeWidth={3} />
```

## IonIcon Properties

IonIcon accepts almost any [valid attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg) of the svg element, and this few others:

- **name**

  **Required.** The name of the icon, as seen in the [Ionicos site](https://ionicons.com), without the 'md-' or 'ios-' prefix.

- **size**

  String or number. Shorthand to the `width` and `height` attributes.

  You can use a [named size](#named-sizes) or any value supported by the CSS with/height rule.

- **color**

  string. Shorthand to the `stroke` and `fill` attributes.

  You can use a any value accepted by the 'color' CSS rule.

- **iconType**

  Either 'md' or 'ios'. This overrides automatic detection of the platform.

- **innerRef**

  A React.ref to the inner `svg` element (don't use strings).

## `addIcons(bundle)`

Registers an icon set or bundle. This is a JS object, the key is the icon name, the value is the component.

Example:

```js
import { addIcons } from 'react-svg-ionicons'
import addCircleOutline from 'react-svg-ionicons/icon/add-circle-outline'
import removeCircleOutline from 'react-svg-ionicons/icon/remove-circle-outline'

addIcons({
  'add-circle-outline': addCircleOutline,
  'remove-circle-outline': removeCircleOutline,
})
```

## `setDefaults(settings)`

Set the default attributes of the component.

The predefined values:

```js
{
  display: 'inline-block',
  fill: 'currentColor',
  stroke: 'currentColor',
  size: 'regular',
}
```

## `setSizes(sizes)`

Set the values of the _named sizes_.

The predefined values:

<a name="named-sizes"></a>

```js
{
  small: '0.75em',
  regular: '1em',
  large: '1.25em',
  larger: '2em',
  largest: '3em',
}
```

## License

The [MIT](LICENSE) Licence

&copy; 2019, Alberto Martínez

[license-badge]:  https://img.shields.io/badge/license-MIT-blue.svg
[license-url]:    https://github.com/aMarCruz/react-svg-ionicons/blob/master/LICENSE
[npm-badge]:      https://img.shields.io/npm/v/react-svg-ionicons.svg
[npm-url]:        https://www.npmjs.com/package/react-svg-ionicons
