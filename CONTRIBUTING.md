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

### Atomic Design

[Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) is a way of building components in a way that they become _very_ reusable, and support _many_ different use-cases in the future.

When contribution to any alle frontend code, you should be thinking of the designs you receive atomically; Break down the design into its core elements, and place those components in the correct layers.

Please see [this miro board](https://miro.com/app/board/uXjVLJUCrko=/?moveToWidget=3458764605858806971&cot=14) for an example of how the consumer wallet might be composed using atomic design.

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