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

## Styling

### Atomic Design

[Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) is a way of building components in a way that they become _very_ reusable, and support _many_ different use-cases in the future.

When contributing to any alle frontend code, you should be thinking of the designs you receive atomically; Break down the design into its core elements, and place those components in the correct layers.

Please see [this miro board](https://miro.com/app/board/uXjVLJUCrko=/?moveToWidget=3458764605858806971&cot=14) for an example of how the consumer wallet might be composed using atomic design, and see [this ADR](https://github.com/allergan-data-labs/alle-frontend-consumer-web/blob/main/docs/adrs/0003-packages-hierarchy.md#levels-breakdown) for guidelines for where to build components (the correct layers).

>[!IMPORTANT]
> Consider the layers you're building components in, and use the appropriate atomic elements for that layer

### Chakra & Specificity

CSS-in-JS libraries like Chakra don't use the browsers traditional [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) engine for styling. This is because its the flow of our javascript code (or the code in the library we're using) that determine which styles get applied.

In the case of chakra, our "specificity" is determined from a few different mechanisms, primarily the order of the props we apply, and _which_ props we're applying.

Generally, using direct props like `color` or `bg` or `maxW` should be used when building lower level components. When building more complex components closer to the view level, you should use the `sx` prop, since these will override direct props.

>[!IMPORTANT]
> Components should expose a `style` prop that gets mapped to the `sx` prop

>[!IMPORTANT]
> Prefer using `style` to override styles rather than accepting things like  `color` props

```tsx
// @packages/core/components
const AlleButton = ({ styles = undefined }: { styles: StyleProps }) => {
  return (
    {/* if `styles` contains a color property, that's the color that will be shown instead of nude */}
    <ChakraButton color="nude" sx={styles} />
  )
}
```

## Development Environment

### Storybook & Chromatic

Storybook & Chromatic are an essential part of building component libraries. When used together, they serve two essential purposes:

1. They become the source of truth for a components documentation & usage
2. They become part of our testing pipeline, helping to prevent unknown breaking changes and regressions

Storybook is primarily valuable when used lower in the stack. Knowing that `@packages/core/components/alle-button` has a visual breaking change is extremely important, since that component is likely to be used in dozens of places. Knowing that `consumer-web/views/financing/components/financing-modal` has a breaking change is helpful, but has a limited ROI comparatively, and so is not required to have a storybook file.

>[!IMPORTANT]
> Components that are likely to be re-used in many places (EG anything in `@packages/core`, or some components in `consumer-web/components`) should have a storybook file, and be included in the chromatic pipeline

### Typescript Path Aliases

In order to reduce deeply nested imports that result in lines like this:

```tsx
import { Button } from '../../../../../../components/button`;
```

There are some path aliases set up to make imports significantly easier.

1. Code from external repos is deployed to NPM, and can be imported via `@allergan-data-labs/*`
2. Code from packages within the same repo can be imported via `@packages/*`
3. Code from within the current app (IE `consumer-web`) can be imported via `~`, which maps to `consumer-web/src

Example:

```tsx
// directory structure:
// alle-frontend-consumer-web
//   @packages/
//     core/
//       components/
//         alle-button.tsx
//   apps/
//     consumer-web/
//       src/
//         components/
//           header.tsx
//         views/
//           financing/
//             financing-modal.tsx

// ============================== //

// apps/consumer-web/src/views/financing/financing-modal.tsx

import { Modal } from '@allergan-data-labs/alle-elements/modal'
import { AlleButton } from '@packages/core-components/alle-button'
import { Header } from '~/components/header'
```

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

### No default exports

### Barrel files

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

## Testing

### Unit Tests

### E2E & Integration Tests

## Observability

### Logging & Monitoring