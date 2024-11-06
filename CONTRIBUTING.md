## Consumer Web - Contributing


## Problems with current components

1. component libraries have no identity; no layers
2. JS where CSS should be used
3. outdated 3rd party libraries
4. no proper patterns
   1. mis-using patterns like compound components
5. terrible prop usage
6. outer layer components with business logic

--------------------------------------------------

library considerations
- chakra UI
- alle-elements

## Styles

### Specificity

Specificity is an _extremely_ important thing to consider when building UI, especially when we have so many different layers of components.

First, a quick [introduction to specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity):

Specificity is simply the way the browser determines what styles to apply to a given element. Each method of styling an element has a different weight. Take a look at this code snippet to see a basic example of weights:

```html
<head>
  <style>
    /* This is a TYPE selector, and has a weight of 1 */
    div {
      background: lightgrey;
    }

    /* This is a CLASS selector, and has a weight of 10 */
    .container {
      background: grey;
    }

    /* This is an ID selector, and has a weight of 100 */
    #actions {
      background: black;
    }

    div {
      background: salmon !important; /* !important overrides all specificity rule */
    }

    /* We're using a TYPE and CLASS selector here, so we have a weight of 11 */
    div.container {
      background: yellow;
    }
  </style>
</head>

<body>
  <div
    style="background: purple;" // inline styles have a weight of 1000
    class="container"
    id="actions"
  >
</body>
```

In order to apply styles to an element, you must use a selector with a higher specificity. If a component applies styles with an id (100), in order to apply your own styles, you would need a selector with a specificity of at least 101 (`button#submit`, for example).

---

To help understand why specificity matters, consider the layers currently in our frontend codebase:

![Alle Frontend Layers](./docs/assets/alle-frontend-layers.png)

In this image, we are looking at two different github repositories: `consumer-web` and `alle-elements`. Alle Elements contains a bunch of atomic-level (see [Atomic Design](#atomic-design)) components like buttons, typography, spacing, text inputs, and modals.

The consumer web repo contains two primary directories; Apps and Packages. Apps contain our actual hosted, user-facing applications. Packages contains various layers of component libraries. Each yellow box is a place ui components can be built, and each box can import components from any of the yellow boxes below it (for example, `domain-cms` can import from `core-components`, `alle-elements`, or `chakra-ui` directly).

---

Now imagine a component in `alle-elements` being styled with anything but the lowest specificity; Let's pretend that the `button` component applies all of its styles with a specificity of 30. Let's assume that we have a `BrandButton` in `core-components` that imports this button, and adds some styling and functionality on top of that. In order to add this new styling, it needs to use a higher specificity than 30, so its selectors may look something like this: `div>.button>.label:hover {...}`, which has a specificity of 31.

Then going a step further, we now need to import that `BrandButton` into `domain-cms` for an `onClick` handler to query data, but we also need to add some styles, so now we need a selector like `div>.button.brandButton>label:hover {...}` or something; higher specificity, but getting super messy.

And on and on we go, adding more and more complex selectors with each layer.

The moral of the story is this: build small components with low specificity. If our initial button in alle elements used just a single `.button {}` selector (with a specificity of 10), building on top of it in any and all of the above layers becomes significantly easier and cleaner, and less prone to bugs.

### Atomic Design

### SCSS

## Development Environment

### Storybook

### Chromatic

### Typescript Path Aliases

## Code Standards

### Component props should be used explicitly instead of passing in via the spread operator ({...props})

### Parent components should be able to easily override styles

### Styles should be done in a SCSS file using BEM, Atomic CSS, and Tailwind CSS

- with chakra components recommending style props like sx, mr, etc, this 

### Do not use JS when CSS will suffice

### Prefer IndexCased component and class names

### Prefer semantic HTML over generic tags

### CSS class names are joined in an array

### Global CSS classes should be prefixed

### Components should not be aware of ADL data

### Prefer kebab-casing for file paths

### Files owned by a single team should be explicitly owned

### Directory structures should have a similar structure

a good example of component folders are:

src/
  components/
    header/
      index.ts
      header.tsx
      header.css
      header.*.ts
    wallet-card/
      index.ts
      wallet-card.tsx
      wallet-card.css
      wallet-card.*.ts

## Design Philosophies

### Base/Variant

### Presentational vs Container Components

### Compound Components