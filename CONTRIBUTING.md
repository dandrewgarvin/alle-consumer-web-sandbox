## Consumer Web - Contributing

## Problems with current components

1. component libraries have no identity; no layers
2. JS where CSS should be used
3. outdated 3rd party libraries
4. no proper patterns
   1. mis-using patterns like compound components
5. terrible prop usage
6. outer layer components with business logic

---

library considerations

- chakra UI
- alle-elements

## Styling

### Atomic Design

[Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) is a way of building components in a way that they become _very_ reusable, and support _many_ different use-cases in the future.

When contributing to any alle frontend code, you should be thinking of the designs you receive atomically; Break down the design into its core elements, and place those components in the correct layers.

Please see [this miro board](https://miro.com/app/board/uXjVLJUCrko=/?moveToWidget=3458764605858806971&cot=14) for an example of how the consumer wallet might be composed using atomic design, and see [this ADR](https://github.com/allergan-data-labs/alle-frontend-consumer-web/blob/main/docs/adrs/0003-packages-hierarchy.md#levels-breakdown) for guidelines for where to build components (the correct layers).

> [!IMPORTANT]
> Consider the layers you're building components in, and use the appropriate atomic elements for that layer

### Chakra & Specificity

CSS-in-JS libraries like Chakra don't use the browsers traditional [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) engine for styling. This is because its the flow of our javascript code (or the code in the library we're using) that determine which styles get applied.

In the case of chakra, our "specificity" is determined from a few different mechanisms, primarily the order of the props we apply, and _which_ props we're applying.

Generally, using direct props like `color` or `bg` or `maxW` should be used when building lower level components. When building more complex components closer to the view level, you should use the `sx` prop, since these will override direct props.

> [!IMPORTANT]
> Components should expose a `style` prop that gets mapped to the `sx` prop

> [!IMPORTANT]
> Prefer using `style` to override styles rather than accepting things like `color` props

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

> [!IMPORTANT]
> Components that are likely to be re-used in many places (EG anything in `@packages/core`, or some components in `consumer-web/components`) should have a storybook file, and be included in the chromatic pipeline

### Typescript Path Aliases

In order to reduce deeply nested imports that result in lines like this:

```tsx
import { Button } from '../../../../../../components/button`;
```

There are some path aliases set up to make imports significantly easier.

1. Code from external repos is deployed to NPM, and can be imported via `@allergan-data-labs/*`
2. Code from packages within the same repo can be imported via `@packages/*`
3. Code from within the current app (IE `consumer-web`) can be imported via `~`, which maps to `consumer-web/src`

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

import { Modal } from '@allergan-data-labs/alle-elements/modal';
import { AlleButton } from '@packages/core-components/alle-button';
import { Header } from '~/components/header';
```

## Code Standards

### Component props should be used explicitly instead of passing in via the spread operator ({...props})

Spreading props leads to behaviors that are difficult to debug, and prop chains (IE multiple layers of components all using `...props`) that are difficult to trace. If we are explicit about the props we receive (and the props that we pass in), it becomes significantly easier to reason about our app and know what is happening in our code.

Bad:

```tsx
// we don't know what can or cannot be passed in
const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};
```

Good:

```tsx
// we are confident that only the props we have listed can be used. typescript aids us in the parent component
const Button = ({ children, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

### Be explicit about which default props are supported

When declaring typescript interfaces, it is preferred to support a select few set of native html attributes (or chakra props) rather than everything blindly. This is easy enough to do since we are not spreading props, either.

Bad:

```tsx
import type { ButtonProps } from '@chakra-ui/react'

// we are accepting every attribute possible
interface Props extends ButtonProps {...}

const Button: (props: Props) => {...}
```

Good:

```tsx
import type { ButtonProps } from '@chakra-ui/react'

// we are being very clear about which props are supported, and which are not.
// in this case, we are not accidentally allowing things like `onDoubleClick`
type SupportedDefaultProps = Pick<
  ButtonProps,
  'className', 'onClick'
>

interface Props extends SupportedDefaultProps {...}

const Button = (props: Props) => {...}
```

### Prefer kebab-casing for file paths

It is preferred to use kebab-cased directory and file names over camelCased or PascalCased. In linux systems, file casing matters, so `Component.ts` and `component.ts` are different files, but on a mac system, they are considered to be the same.

To avoid any potential casing issues, and to improve readability (especially with words containing a mix of upper-case `i`s and lower-case `l`s), kebab-casing should be used for file names.

> [!IMPORTANT]
> Files and directories should use kebab-casing

### Prefer no barrel files

[Barrel files](https://tkdodo.eu/blog/please-stop-using-barrel-files) are a name given to `index` files that do nothing but import/re-export other files. While these can make imports look pretty, they also have the potential for accidental circular imports, so it is preferred to not use them.

Instead, your import lines should reference the file that directly exports the class/component/etc you need.

### Prefer named exports over default exports

Default exports can serve a useful purpose for things like libraries that need to export an entire namespace, but since we are in an application-centric codebase, we should not be using them, and instead prefer to use named exports.

There are a lot of benefits received from named exports, including letting component authors name a component rather than the person importing it, the potential for codemods, etc.

> [!IMPORTANT]
> Don't use default exports. Use named exports instead.

Bad:

```tsx
const Button = () => {...}

export Button;
```

Good:

```tsx
const Button = () => {...}

export {
  Button
}
```

### Exports should be at the bottom of the file

To enhance readability, all exports should be located at the bottom of the file. This makes it very easy to know everything that is exported from the file, rather than having to look at every declaration within the file to determine if it's being exported or not. This is especially helpful with large files.

Bad:

```tsx
export interface Props {...}

export const Button = () => {...}

export const StyledButton = () => {...}
```

Good:

```tsx
interface Props {...}

const Button = () => {...}

const StyledButton = () => {...}



export type { Props }

export { Button, StyledButton }
```

### Prefer IndexCasing for components, and camelCasing for variables

It has been a long-standing pattern in the world of React development (and really software development as a whole) to name classes & components using IndexCasing (also known as PascalCasing).

We should adhere to this standard. Method names, variable names, and other non-class and non-component names should use camel casing.

Bad:

```tsx
// components should be IndexCased
const button = () => {...}

// classes should be IndexCased
class wallet_adapter {...}

// objects should be camelCased
const WalletMethods = {
  // methods should be camelCased
  FetchUserWallet: () => {...}
}
```

Good:

```tsx
// components should be IndexCased
const Button = () => {...}

// classes should be IndexCased
class WalletAdapter {...}

// objects should be camelCased
const walletMethods = {
  // methods should be camelCased
  fetchUserWallet: () => {...}
}
```

### Components should not be aware of ADL data

The sections below on various Design Philosophies will hopefully illustrate why components in all lower layers should be presentational only. They should accept generic data, and render it, but should not fetch their own data, or be aware of domain-specific language or models.

This is one of the most important steps to take into building high-quality software, and _good_ reusable components.

Bad:

```tsx
// this component knows way too much about the data it is rendering
const Table = ({ transactions }) => {
  return (
    <table>
      {transactions.map(transaction => {
        if (transaction.status === 'COMPLETED') {
          return (...)
        }
        ...
      })}
    </table>
  )
}
```

Good:

```tsx
// the table is generic, so will work in multiple applications and on multiple pages
const Table = ({ columns, records }) => {
  return (
    <table>
      {records.map(record => {
        return <TableRow columns={columns} record={record} />
      })}
    </table>
  )
}
```

### Prefer semantic HTML over generic tags

### Files owned by a single team should be explicitly owned

### Directory structures should have a similar structure

a good example of component folders are:

src/
components/
header/
index.ts
header.tsx
header.css
header._.ts
wallet-card/
index.ts
wallet-card.tsx
wallet-card.css
wallet-card._.ts

## Design Philosophies

### Base/Variant

### Presentational vs Container Components

### Compound Components

## Testing

### Unit Tests

### E2E & Integration Tests

## Observability

### Logging & Monitoring
