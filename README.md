# vue-responsive-image

[![npm version][npm-version-src]][npm-version-href]
[![License][license-src]][license-href]

<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Circle CI][circle-ci-src]][circle-ci-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

> Make every Image Responsive to Shrink your Bundle Size

[📖 **Release Notes**](./CHANGELOG.md)

## Intro

[DEMO](https://teamnovu.github.io/vue-responsive-image/)

Vue Responsive Image helps you in making every image on your website responsive. Inspired by [tailwindcss](https://github.com/tailwindcss/tailwindcss) breakpoints it always scales the image down to fit the current breakpoint but still leaves you the flexibility to scale it down even further.

## Requirements

Nothing, just go for it.

## Setup

1. Add `@teamnovu/vue-responsive-image` as a dependency to your project

```bash
yarn add @teamnovu/vue-responsive-image

# or npm install @teamnovu/vue-responsive-image
```

2. Add the following code to your `main.js`

```js
import ResponsiveImage from '@teamnovu/vue-responsive-image'

Vue.component('ResponsiveImage', ResponsiveImage)
```

## Usage

Just use the `<ResponsiveImage />` component where you would have a normal `<img />` tag and pass in the props as follows.

```html
<ResponsiveImage
  src="https://source.unsplash.com/random/{w}x{h}"
  :screens="{
    xs: '360px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }"
  :max-width="3000"
  sizes="w-90vw md:w-60vw md:h-9/16 xl:w-50vw"
/>
```

### Available Props

| Option     	| Type     	| Default                                                    	| Options                            	| Description                                                                    	|
|------------	|----------	|------------------------------------------------------------	|------------------------------------	|--------------------------------------------------------------------------------	|
| `src`      	| `String` 	| none                                                       	| width: `{w}`                       	| The source to be used for the image with `{w}` where the width should go.      	|
| `maxWidth` 	| `Number` 	| `2560`                                                     	| Any Number                         	| The maximum width used to calculate the image width on the biggest breakpoint. 	|
| `screens`  	| `Object` 	| `{ sm: '640px', md: '768px', lg: '1024px', xl: '1280px' }` 	| An key pixel value pairs           	| The breakpoints to be used.                                                    	|
| `sizes`    	| `String` 	| `w-Xvw`, `h-(full|x/y)` for each breakpoint                                	| Any `vw` value for width and any fraction for height for each breakpoint 	| Viewport-width / width/height-ratio to further shrink image on each breakpoint.                     	|

## Development

1. Clone this repository
2. Install dependencies using `yarn install`
3. Start development server using `yarn serve`

### Release

1. `yarn release`
2. `npm publish`

### Features Planned

- [ ] Image Ratio
- [ ] Breakpoints from tailwindcss config

## License

[MIT License](./LICENSE)

Copyright (c) teamnovu

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@teamnovu/vue-responsive-image/latest.svg?style=flat-square
[npm-version-href]: https://github.com/teamnovu/vue-responsive-image/releases
[npm-downloads-src]: https://img.shields.io/npm/dt/@teamnovu/vue-responsive-image.svg?style=flat-square
[npm-downloads-href]: https://github.com/teamnovu/vue-responsive-image/releases
[circle-ci-src]: https://img.shields.io/circleci/project/github/teamnovu/vue-responsive-image.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/teamnovu/vue-responsive-image
[codecov-src]: https://img.shields.io/codecov/c/github/teamnovu/vue-responsive-image.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/teamnovu/vue-responsive-image
[license-src]: https://img.shields.io/npm/l/@teamnovu/vue-responsive-image.svg?style=flat-square
[license-href]: https://github.com/teamnovu/vue-responsive-image/blob/master/LICENSE
