# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [15.1.3](https://github.com/BePo65/mat-image-overlay/compare/v15.1.2...v15.1.3) (2023-05-24)

### [15.1.2](https://github.com/BePo65/mat-image-overlay/compare/v15.1.1...v15.1.2) (2023-05-24)

### [15.1.1](https://github.com/BePo65/mat-image-overlay/compare/v15.1.0...v15.1.1) (2023-01-14)

## [15.1.0](https://github.com/BePo65/mat-image-overlay/compare/v15.0.0...v15.1.0) (2023-01-14)


### ⚠ BREAKING CHANGES

* drops 'imageClickHandler' from configuration and moves
it as an observable to 'MatImageOverlayRef'

### Features

* embed roboto font instead of linking it ([de1fab3](https://github.com/BePo65/mat-image-overlay/commit/de1fab36e67d4dc6e0c8f7781e240da87310c510))
* replace option 'imageClickHandler' with observable ([70c9442](https://github.com/BePo65/mat-image-overlay/commit/70c94424276756d3890b1ede108b19d09feb1658))

## [15.0.0](https://github.com/BePo65/mat-image-overlay/compare/v3.0.3...v15.0.0) (2023-01-04)


### Bug Fixes

* errors from stylelint ([99e4cea](https://github.com/BePo65/mat-image-overlay/commit/99e4cea75365476dac210157128b7e10f6068b69))
* type error in event handler ([712b2c6](https://github.com/BePo65/mat-image-overlay/commit/712b2c61a96c0bd365d04488aa304b84baa450e6))
* warnings from upgrading to angular v15 ([a87f141](https://github.com/BePo65/mat-image-overlay/commit/a87f14124353bef3db5e025b277955ff664ad34a))

### [3.0.3](https://github.com/BePo65/mat-image-overlay/compare/v3.0.2...v3.0.3) (2022-07-10)

### [3.0.2](https://github.com/BePo65/mat-image-overlay/compare/v3.0.1...v3.0.2) (2022-01-30)

### [3.0.1](https://github.com/BePo65/mat-image-overlay/compare/v3.0.0...v3.0.1) (2022-01-30)

## [3.0.0](https://github.com/BePo65/mat-image-overlay/compare/v2.0.0...v3.0.0) (2022-01-30)


### ⚠ BREAKING CHANGES

* remove 'with' and filter from MatImageOverlayHarness
as this feature is unnecessary (only 1 MatImageOverlay can be created
at one time).

### Features

* add 'imageUrl' and 'sendKeys' to MatImageOverlayHarness ([e08547a](https://github.com/BePo65/mat-image-overlay/commit/e08547a69ed9c5ef7451f80ca270cdff159ba856))
* move host() of MatImageOverlayHarness to overlayContainer ([3becd0d](https://github.com/BePo65/mat-image-overlay/commit/3becd0d26312f4c19e4a6f034e5cbded4ce2761d))
* remove 'with' and filter from MatImageOverlayHarness ([e577640](https://github.com/BePo65/mat-image-overlay/commit/e5776405db87f124a858804efc264a97dc58b9e4))
* remove sendKeysWithModifiers as modifiers are not evaluated ([eb57718](https://github.com/BePo65/mat-image-overlay/commit/eb57718bd8679a9a6fe47d551ef72bd15c9c5f55))

## [2.0.0](https://github.com/BePo65/mat-image-overlay/compare/v1.0.0...v2.0.0) (2022-01-26)


### ⚠ BREAKING CHANGES

* add navigation to ImageOverlayComponentRef.
'Law of demeter' says that accessing properties of components in
another component is bad practice.
* images in config is now required; optional parameters
don't have a default value anymore.
* use MatImageOverlayConfig as parameter of 'open'
to combine all parameters into one single parameter.
* 'open()' requires index of image not url
* component names changed to be consistent with project
names

### Features

* activate events ([58d57a2](https://github.com/BePo65/mat-image-overlay/commit/58d57a2bfecb6b8a241c360bb3f4c9389f1021fc))
* add config class to public api ([742f65d](https://github.com/BePo65/mat-image-overlay/commit/742f65d5949ac1271e8222173d8de8a5afefdfbe))
* add config option for position of description when style='onHover' ([94805ea](https://github.com/BePo65/mat-image-overlay/commit/94805ea89c724eba754055ef6a4af1c008e1bc30))
* add demo with minimal required configuration ([2d0b664](https://github.com/BePo65/mat-image-overlay/commit/2d0b6646b6dab781e2c6694d93c5a347a459bf09))
* add gotoImage and gotoLastImage to automatic demo ([fbcd5ed](https://github.com/BePo65/mat-image-overlay/commit/fbcd5edd7f5ed121c954b3b27281a55b5f25d602))
* add home and end button to move in list of images ([4281aa1](https://github.com/BePo65/mat-image-overlay/commit/4281aa14a6f66d660246ca6f89f401b11d7d0ded))
* add navigation buttons to overlay image ([cda1c84](https://github.com/BePo65/mat-image-overlay/commit/cda1c84b380e17dfb3a5f3ddcec1d7a8c470a30f))
* add option 'descriptionForImage' to string source demo ([615bf8e](https://github.com/BePo65/mat-image-overlay/commit/615bf8e062ef5839c133aff6a791e9f53994f090))
* add option for click event handler of image ([e054290](https://github.com/BePo65/mat-image-overlay/commit/e054290ea6815435372d3d2cafda87536bae8881))
* add option to access description  of image ([3e3f835](https://github.com/BePo65/mat-image-overlay/commit/3e3f83596b70931b80bac5525dc8bf870d1cf99a))
* add option to set display style for overlay buttons ([f28d663](https://github.com/BePo65/mat-image-overlay/commit/f28d6636a6fe6dcb99eb62702835b6849e1d9ce9))
* add property to optionally display an image description ([c01df2d](https://github.com/BePo65/mat-image-overlay/commit/c01df2de5e42fcb41d265779112294d24b4ab057))
* add testHarness for mat-image-overlay ([1a12bba](https://github.com/BePo65/mat-image-overlay/commit/1a12bba725d7c108a583795d47fa74cdf0061967))
* add title and short description to demo page ([72254c4](https://github.com/BePo65/mat-image-overlay/commit/72254c44cbe110c7bc9b949064ebe1817c3523a0))
* add tooltip to link images of demo page ([9052f14](https://github.com/BePo65/mat-image-overlay/commit/9052f1429f22d1746c7935ca924c8381781fab13))
* always show buttons on devices that do not support 'hover' ([f7198e5](https://github.com/BePo65/mat-image-overlay/commit/f7198e54bd84bdf852bb8b85fdeba56928e47d29))
* change call signature of 'open' method of MatImageOverlay ([2dc7f02](https://github.com/BePo65/mat-image-overlay/commit/2dc7f0297d043cfea8c0ffeb8826db32f3e3d409))
* default implementation for 'urlForImage' accecpts empty 'images' ([6b7fe6f](https://github.com/BePo65/mat-image-overlay/commit/6b7fe6f7378da1498a154a1af972aa3a10322066))
* define start image in overlay via index (not url) ([8c1e980](https://github.com/BePo65/mat-image-overlay/commit/8c1e9809ea3752900430e544ca4e4ea0330bd29f))
* descriptionDisplayStyle 'onHover' shows text on bottom of image ([d8de396](https://github.com/BePo65/mat-image-overlay/commit/d8de3964c66c9120163db1197c9a5d0241fecb34))
* extend demo to show external navigation ([38d95cc](https://github.com/BePo65/mat-image-overlay/commit/38d95ccdb3e0978c218bee3b6e21c40d52be31d6))
* hide buttons for next / previous image on limits of list ([2499c29](https://github.com/BePo65/mat-image-overlay/commit/2499c29c97f09c007826218d199f3d58b31681f6))
* hide description if value is undefined or empty string ([461ced8](https://github.com/BePo65/mat-image-overlay/commit/461ced88f2048c398bb5b16e59f5482682c5bb35))
* increase size of images to fill viewport ([db57483](https://github.com/BePo65/mat-image-overlay/commit/db57483302222fefbb0e1481545cf61de4d156ab))
* make 'mat-image-overlay-ref' available in mat-image-overlay ([04ec39f](https://github.com/BePo65/mat-image-overlay/commit/04ec39fc37854331e7b25c64a0906b4cf45cb0b1))
* make 'open' return a MatImageOverlayRef object ([c084f0f](https://github.com/BePo65/mat-image-overlay/commit/c084f0fb2b8bef01025e1769ee395dacf5654b7a))
* make configuration of datasource more flexible ([4d5b766](https://github.com/BePo65/mat-image-overlay/commit/4d5b7668966e1ec60c38e18b3dfc802d6c2ca357))
* make images a required parameter of MatImageOverlayConfig ([7082f31](https://github.com/BePo65/mat-image-overlay/commit/7082f317a359dab7ec7831af5efc8909d9be4c3d))
* make MatImageOverlayConfig an interface ([560f6de](https://github.com/BePo65/mat-image-overlay/commit/560f6de525fbc72c16b9eb78bd471714d6cbcad9))
* make option 'urlForImage' optional ([4511ad9](https://github.com/BePo65/mat-image-overlay/commit/4511ad96016a01625adf34df61b232ebbf546819))
* make sure that only 1 instance of MatImageOverlay exists ([e03e01c](https://github.com/BePo65/mat-image-overlay/commit/e03e01c583ea23be20f40690a6f6796a83982db9))
* remove 'panelClass' from config and mat-image-overlay-ref ([0ea0987](https://github.com/BePo65/mat-image-overlay/commit/0ea098705960863fb44b5c7cce9aa9a01631ec74))
* remove access to OverlayComponent in OverlayComponentRef ([f8119d6](https://github.com/BePo65/mat-image-overlay/commit/f8119d67fb3e63f76d568c79ecd33e3b2d25ba7f))
* show options in demo page in right column ([85fbb87](https://github.com/BePo65/mat-image-overlay/commit/85fbb871cb832c6a6ff8626f1f508429a309696c))


### Bug Fixes

* activate configuration parameter 'backdropClass' ([af220c7](https://github.com/BePo65/mat-image-overlay/commit/af220c707981d96d0718419282fb5e839291749f))
* add css to keep ascpect ratio of image when resizing browser ([6fd2bcc](https://github.com/BePo65/mat-image-overlay/commit/6fd2bccd54662e8cff2069353fc266e498840966))
* add visibility of public methods, remove unnecessary 'getState' ([b877798](https://github.com/BePo65/mat-image-overlay/commit/b8777988dd8c303e821a1320efc7d1ebe5971485))
* change svg icons to constants ([dd18545](https://github.com/BePo65/mat-image-overlay/commit/dd185454c21e28a5c1f535eae1e33731ea155d6d))
* prevent keystrokes from overlay to be sent to parent page ([e4f12c5](https://github.com/BePo65/mat-image-overlay/commit/e4f12c57decdb9c5455b2d1299d55ae33dd5d4b1))
* remove base from index.html of demo ([01d21e0](https://github.com/BePo65/mat-image-overlay/commit/01d21e0f245518f7629076224e2355581dfa5f8a))
* rename 'AngularMaterialImageOverlay...' to 'MatImageOverlay...' ([c55177b](https://github.com/BePo65/mat-image-overlay/commit/c55177b3cd4a528aee77d9fe8fc5f1f4cd8394bb))
* stop loop when 'imgage show' is manually closed ([d632a93](https://github.com/BePo65/mat-image-overlay/commit/d632a93b614fc96126ac207a1bcb3544b6a972b7))
* stylelint request shorthand for css grid ([5cec9fa](https://github.com/BePo65/mat-image-overlay/commit/5cec9faabf19a059aef0bd4b61d1be411f90259a))
* update demo to show different data sources ([214be52](https://github.com/BePo65/mat-image-overlay/commit/214be522eb50b10772264c95134fc6502858b175))
* update layout of demo page ([c0803a0](https://github.com/BePo65/mat-image-overlay/commit/c0803a0972ba4eb8da3d11f76d0cdba6bd714b83))
* update tests to current version ([20479b8](https://github.com/BePo65/mat-image-overlay/commit/20479b83a9e8bc117f7b93756bc3f4e99af494bd))

## [1.0.0](///compare/v0.0.8-next...v1.0.0) (2021-12-16)

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
