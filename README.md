# ART

ART is a retained mode vector drawing API designed for multiple output modes.
There's also a built-in SVG parser. It uses Node style CommonJS modules.

The first line in your program should select rendering mode by requiring either:

- __./src/modes/canvas__ - HTML5 Canvas
- __./src/modes/svg__ - SVG for modern browsers and vector tools
- __./src/modes/vml__ - VML for Internet Explorer or Office
- __./src/modes/script__ - Code generation for ART modules
- __./src/modes/dom__ - SVG or VML depending on environment
- __./src/modes/fast__ - Canvas, SVG or VML depending on environment

These modules provide access to the core rendering classes:

- __Surface__ - Required rectangular rendering area. Container for the rest.
- __Group__ - Container for Shapes, Text or other Groups.
- __Shape__ - Fill and/or stroke an arbitrary vector path.
- __Text__ - Fill and/or stroke text content rendered using native fonts.

There are also helper classes to work with vector paths, 3x3 transformation
matrices, colors, morphing, common shapes etc.

#Demos

[See ./demos](./demos)
