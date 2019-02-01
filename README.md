# react-svg-ionicons

[![License][license-badge]][license-url]
[![npm Version][npm-badge]][npm-url]

Flexible and performant SVG Ionicon component for React.

From the [Ionicon site](https://ionicons.com/)

> Ionicons is a completely open-source icon set with 700+ icons crafted for web, iOS, Android, and desktop apps. Ionicons was built for Ionic Framework, so icons have both Material Design and iOS versions.

react-svg-ionicons exports an `IonIcon` component, similar to the Ionic's `ion-icon` Web Component, to render SVG icons in web pages with automatic detection of the icon style (iOS or Material Design) based on your platform.

_**WARNING:** Folders "bundle" and "icon" now are "bundles" and "icons" and the `iconType` property is `mode`, for consistency with the ion-icon Web Component._

_This is **WIP** and breaking changes are expected. I hope to stabilize the API in v0.3.0._

Thanks to the [Ionic Framework](https://ionicframework.com/) team for their awesome work!

## Install

```bash
$ yarn add react-svg-ionicons
# or
$ npm i react-svg-ionicons -S
```

## Usage

This package consists of one component, three utility functions and ~380 subcomponents with dual and logo icons, covering the entire set of the Ionicons.

Before using the main `IonIcon` component, you must add subcomponents (`SVGIcon`) through the `addIcons` function.

I include three convenience bundles in the folder "bundles":

- `all` : The full icon set.
- `generic` : All the dual icons.
- `logos` : Only the "logo" icons.

```ts
import { IonIcon, addIcons } from 'react-svg-ionicons'
import bundle from 'react-svg-ionicons/bundles/all'

// This loads the full Ionicon set
addIcons(bundle)

// From here, you can use the loaded icons anywhere in your App
<IonIcon name="heart" size="large" color="red" strokeWidth={3} />
```

But you can create your own by importing individual icons from the folder "icons".

In addition to the styles and classes that you define (applied to the `<svg>` tag), each icon has an internal `className` formed with the prefix "ion-" and the name of the icon. For example, the "apps" icon has the class name "ion-apps". This allows control of each icon using specific CSS rules, the recommended way to stylize and transform svg the elements.

## API

### `<IonIcon>`

This is the main component of react-svg-ionicons and will render an unwrapped `<svg>` with the default and instance properties.

IonIcon accepts almost any valid SVG attribute in (react) _camel-case_ notation, along the following properties:

- **name**

  The icon name is the only **required** property, as seen in the [Ionicos site](https://ionicons.com), without the "md-" or "ios-" prefix.

- **color**

  String with a color to apply to the `stroke` and `fill` attributes, in any format accepted by the 'color' CSS rule.

  The predefined value is "[currentColor](https://css-tricks.com/currentcolor/)", you can change or remove it with [setDefaults](#setdefaults).

  Precedence: specific `fill/stroke` or `color` -&gt; default `fill/stroke` -&gt; default `color`.

- **size**

  String, number, or [named size](#named-sizes) applied to the `width` and `height` attributes.

  The predefined value is "1rem", but you can change or remove it with [setDefaults](#setdefaults).

  Precedence: specific `width/height` or `size` -&gt; default `width/height` -&gt; default `size`.

- **mode**

  The `mode` property determines which platform styles to use, either `"ios"` or `"md"`.

  By using this property you will override the automatic detection of the platform.

- **innerRef**

  A [`React.ref`](https://reactjs.org/docs/refs-and-the-dom.html) to the `svg` element (don't use strings).

### addIcons

```ts
addIcons(bundle: { [k: string]: SVGIcon | null }): void
```

Adds a group of icons to the registration table.

`bundle` is a JS object where each key is the name of an icon and its value is the component to use.

This charging mode allows great flexibility. You can personalize the icon names or even create new icons.

Also, if you want to reduce the size of your App, you can create a custom bundle with only the icons you require, the rest will be excluded from your App.

To remove an already loaded icon, pass `null` as its value.

Example:

```js
import { addIcons } from 'react-svg-ionicons'
import alarm from 'react-svg-ionicons/icons/alarm'
import trash from 'react-svg-ionicons/icons/trash'
import arrowBack from 'react-svg-ionicons/icons/arrow-back'

addIcons({
  'alarm': alarm,
  'trash': trash,
  'back': arrowBack,
})
```

### setDefaults

```ts
setDefaults(settings: SVGAttributes<SVGSVGElement>): void
```

This function accepts a JS object with valid SVG attributes that are mixed with the defaults used when rendering the icons.

Deep merge is only applied to `className` and `style`, and the attributes `xmlns` y `viewBox` are ignored, the rest are accepted but may have no effect on the icon. You will need to experiment to get the desired effect.

To remove an existing attribute, pass `null` or `undefined` as its value.

Predefined values:

```ts
{
  display: 'inline-block',
  fill: 'currentColor',
  stroke: 'currentColor',
  size: '1em',
}
```

You can see the `SVGAttributes` definition in the [@types/react](https://www.npmjs.com/package/@types/react) package (you are using TypeScript, right?) or in MDN [SVG element reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg#Attributes) (mostly in _kebab-case_ notation).

### `setSizes`

```ts
setSizes(sizes: { [k: string]: string | number | null }): void
```

Adds or removes values of the _named sizes_ map, a JS object used to translate names to CSS sizes.

You can add your own translations, or remove the existent ones by settings its value to `null`.

Predefined values, consistent with ion-icon:

<a name="named-sizes"></a>

```ts
{
  small: '18px',
  large: '32px',
}
```

You can use this values through the `size` property of IonIcon:

```ts
<IonIcon name="app" size="large" />
```

The value will be applied to the `width` and `height` attributes of the `<svg>` element.

## Support my Work

I'm a full-stack developer with more than 20 year of experience and I try to share most of my work for free and help others, but this takes a significant amount of time and effort so, if you like my work, please consider...

[<img src="https://amarcruz.github.io/images/kofi_blue.png" height="36" title="Support Me on Ko-fi" />][kofi-url]

Of course, feedback, PRs, and stars are also welcome 🙃

Thanks for your support!

## License

The [MIT](LICENSE) Licence

&copy; 2019, Alberto Martínez

[license-badge]:  https://img.shields.io/badge/license-MIT-blue.svg
[license-url]:    https://github.com/aMarCruz/react-svg-ionicons/blob/master/LICENSE
[npm-badge]:      https://img.shields.io/npm/v/react-svg-ionicons.svg
[npm-url]:        https://www.npmjs.com/package/react-svg-ionicons
[kofi-url]:       https://ko-fi.com/C0C7LF7I
