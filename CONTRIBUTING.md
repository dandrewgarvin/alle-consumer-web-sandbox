# ADR 0005 - Consumer Web Style Guide

## Proposal

- Date Proposed: Nov 20, 2024
- Last Updated: Nov 20, 2024

### Status

Proposed

### Context / Problem Statement

As our organization has grown over the past 5 years, so have our applications, and number of features. We have established standards in our backend stack, surrounding things like event-driven architecture and graphql usage, but the frontend codebase has not had any such standards in place.

Because of this, there are many different patterns, and lack of patterns, prevelant throughout our codebase(s). This has resulted in engineers not having a single source-of-truth for how to write software to create consistency and scalability. Alternatively, it has also created an environment where engineers have to reference conversations that took place prior to them even working here, as a way of establishing standard practices. This has also resulted in a very poor onboarding process to learn "our way" of writing frontend code.

To solve this problem, and to prepare us for some very large upcoming changes like micro frontends (MFE), I am proposing this document as the source of truth for our coding standards & practices to be adopted by all engineers working in our frontend codebases.

This proposal will serve as the _initial baseline_ set of principles, but will evolve as our needs do.

### Consequences

Having a set of standards in place will help with the onboarding experience into our codebases. Additionally, it will aid in the code authoring and reviewing processes, giving engineers a single place to look to make sure the code they are writing is consistent, scalable, and clean.

---

---

---

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

Bad:

```
apps/
  consumerWeb/
    views/
      wallet/
        walletView.tsx
        components/
          walletCard.tsx
          walletButton.tsx
```

Good:

```
apps/
  consumer-web/
    views/
      wallet/
        wallet-view.tsx
        components/
          wallet-card.tsx
          wallet-button.tsx
```

### Prefer no barrel files

[Barrel files](https://tkdodo.eu/blog/please-stop-using-barrel-files) are a name given to `index` files that do nothing but import/re-export other files. While these can make imports look pretty, they also have the potential for accidental circular imports, so it is preferred to not use them.

Instead, your import lines should reference the file that directly exports the class/component/etc you need.

Bad:

```
apps/
  consumer-web/
    views/
      wallet/
        index.tsx            // this imports/re-exports the wallet-view
        wallet-view.tsx      // this imports from components/index.tsx
        components/
          index.tsx          // this imports/re-exports wallet-card and wallet-button
          wallet-card.tsx
          wallet-button.tsx
```

Good:

```
apps/
  consumer-web/
    views/
      wallet/
        wallet-view.tsx
        components/          // there is no index.tsx file
          wallet-card.tsx
          wallet-button.tsx
```

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
        return <TableRow columns={columns} record={record} />;
      })}
    </table>
  );
};
```

### Prefer semantic HTML over generic tags

[Semantic HTML](https://web.dev/learn/html/semantic-html) is one of the most important parts of UI development when it comes to accessibility (a11y) and search engine optimization (SEO).

To ensure users have a good experience, and to make sure our pages are indexable, we should make sure to use the correct HTML tags. [This cheat sheet](https://webaim.org/resources/htmlcheatsheet/HTML%20Semantics%20and%20Accessibility%20Cheat%20Sheet.pdf) can be useful to understand which element to used.

This rule can be applied whether you're using basic HTML tags, or by using [Chakra's "as" prop](https://www.chakra-ui.com/docs/components/concepts/composition#the-as-prop).

Bad:

```tsx
import { Text } from '@chakra-ui/react';

const AlleHeader = () => {
  return (
    {/* divs do nothing to help with a11y or seo */}
    <div>
      {/* even if we were to visually style these two strings, so that the welcome text is much larger, for a11y and seo purposes, these have the same level of "importance", which is not a good things. */}
      <div className='welcome'>
        <Text>Welcome, Cousin Throckmorton</Text>

        <Text>You have earned 3,450 points this month!</Text>
      </div>

      {/* the <nav> element in HTML has some amazing benefits that we're not getting here */}
      <div className='navigation'>
        <div className='nav-items'>
          <div className='nav-item'>Home</div>
          <div className='nav-item'>Wallet</div>
          <div className='nav-item'>Search Providers</div>
        </div>
      </div>
    </div>
  );
};
```

Good:

```tsx
import { Header, Text } from '@chakra-ui/react';

const AlleHeader = () => {
  return (
    {/* using <header /> here hels significantly with seo */}
    <header>
      <div className='welcome'>
        {/* By default, <Header /> from chakra is an <h2 />, which gives us some nice page weights for seo and a11y */}
        <Header>Welcome, Cousin Throckmorton</Header>

        {/* using the "as" prop, we can regain all the benefits of using semantic HTML tags */}
        <Text as='h3'>You have earned 3,450 points this month!</Text>
      </div>

      {/* this is now much more a11y friendly, and also helps with SEO sitemapping */}
      <nav className='navigation'>
        <ul>
          <li>Home</li>
          <li>Wallet</li>
          <li>Search Providers</li>
        </ul>
      </nav>
    </header>
  );
};
```

### Files owned by a single team should be explicitly owned

If there are files owned exclusively by one team, one of the best things you can do is to set up [code ownership rules](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) to make sure your team is aware of any changes being made to your file.

We have a fairly large suite of applications with domains that span multiple pages, so pretty frequently there are changes being made to files from other teams, which can create downstream issues if they don't have domain knowledge, and code ownership rules help to mitigate this.

> [!IMPORTANT]
> Add code ownership rules for files that are clearly within your teams domain

## Design Philosophies

### Base/Variant

The base/variant pattern is a great option for components like inputs that generally share the same basic functionality, but have stylistic, or slight functional differences. For example, a base input class may have an interface like this:

```tsx
interface BaseInput {
  type?: string;
  value?: string;
  onChange(event: any): void;
  required?: boolean;
  placeholder?: string;
}
```

that may lend itself to a currency variant or an icon variant:

```tsx
interface CurrencyInput extends BaseInput {
  locale?: string;
  precision?: int;
}

const CurrencyInput = (...) => {
  return (
    <BaseInput ... />
  )
}

interface IconInput extends BaseInput {
  Icon?: React.Element;
  position?: 'left' | 'right'
}

const IconInput = (...) => {
  return (
    <BaseInput ... />
  )
}
```

However, the base/variant approach is probably not a good solution for a Card component where there will not be many variants being created

- [Base/Variant Pattern](https://blog.bitsrc.io/design-systems-react-buttons-with-the-base-variant-pattern-c56a3b394aaf)
- [Design systems at spotify](https://spotify.design/article/reimagining-design-systems-at-spotify)

### Presentational vs Container Components

The principles of Presentational components should influence everything in this application, and has been discussed in previous sections. A good, reusable component should be domain-agnostic.

- [Smart vs Dumb components by Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

### Compound Components

Compound components are a great option for complex components that dynamically place content inside of them, or contain fragmented components that need to pass data around in a clean, self-contained way. A good example may be a `Table` component that has `Table.Header` , `Table.Row` , and `Table.Filters` children. These components likely need to interact with each other, and could be rendered in different ways, so using compound components allow us to manage complex interactions between components without making the parent component(s) messy with state.

- [Compound Components by Kent C Dodds](https://kentcdodds.com/blog/compound-components-with-react-hooks)

### WET vs DRY

`Don't Repeat Yourself` (DRY) is a principle that is discussed often among developers. The idea of DRY code is to create abstractions around pieces of code that are frequently re-used in an effort to reduce [change amplification](https://milkov.tech/assets/psd.pdf#page=20).

However, caring too much about DRY code often results in really _bad_ abstractions, for example components that receive props that changes its behavior based on where in the application its being rendered. This type of awareness does not belong in most components, and should live closer to the application. This is where `Write Everything Twice` (WET) enters the conversation; It is the idea that it is okay to duplicate an abstraction if the two versions might change for different reasons.

You should consider it to be a red flag when you are writing code in a reusable component that changes its behavior based on where it's being used, or the result of a given feature flag or piece of data.

> [!IMPORTANT]
> DRY code can be good, but it is far from the most important principle to consider. Aim to make your code DRY, but look out for any red flags indicating your component is too aware of where its being rendered.

### SOLID Principles

[The SOLID Design Principles](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/) are time-tested practices of writing object-oriented software that scales well.

In our code, the SOLID design principles hold a lot of weight, and you should be actively considering how you can refactor your code to be well-aligned with these principles. If you are in a scenario where you can only choose one design philosophy from this document (which is an unlikely scenario to be in, to be fair), choose to follow SOLID.

## Testing

Prior to writing any code for a feature, you should have a plan for what needs to be tested. Work with your teams QA engineer to help create this plan, and list out what needs to be tested, and what type of tests are appropriate for each use-case.

### Unit Tests

Unit testing is an important part of developing software, and its importance grows with the number of features, developers, teams, and lines of code we have. We're at a large enough scale that unit tests essential.

However, unit tests are only valuable when they're written _well_, and when they cover the right things. Quality over quantity. `it should render` does nothing to improve our confidence. Lines of code is a helpful metric, but not all lines of code are equal; Testing that your `/about` page renders is much less impactful than testing that the calculations you're making for reward points is correct.

> [!IMPORTANT]
> Prioritize writing tests that cover _logic_ rather than _UI_

> [!IMPORTANT]
> Prioritize writing high-quality tests that cover _branches_ of code (IE both cases in an if/else condition).

### E2E & Integration Tests

End-to-End (E2E) and Integration tests are a way to verify that your application's frontend works with your applications backend. E2E tests should be written to cover important user flows, such as logging in, going through the checkout flow, etc.

E2E tests are computationally expensive (they take a lot of time to run), so if you can write unit tests that give you the same confidence against regressions, prefer those.

## Observability

`Observability` is the ability to understand what is happening within your system. Good observability means you are getting automated alerts that something is wrong, prior to users reporting it. Your team should be the first people aware of an issue. If you are being told that something is wrong by another team, or a customer, then your observability needs to be improved.

### Logging & Monitoring

One of the first ways to step into observability is to set up good logging & monitoring practices. You can reference [this page](https://sre.google/sre-book/monitoring-distributed-systems/) of Google's `Site Reliability Engineering` guidebook for how to start.

Ideally, at a minimum, you should log all successful & errored requests in your user journey, and use those values to determine what percent of your requests are failing (EG `P = fail / (success + fail)`), and use that value in your monitors to alert you based on what your team has established as your `acceptable error rate` for the given user journey.
