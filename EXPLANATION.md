# Commit 6: implementing the second use-case `getOngoingTrialsByCountry`

This will use the already existing `getOngoingTrials` use-case and won't expose an HTTP route but a
console definition instead

---

# Commit 5: creating the `http` app

I've a simple `fastify` app that will accept routes by the different modules to create a full server

```typescript
import { routes } from "@inato/modules-trials";

for (const route of routes) {
  server.withTypeProvider<ZodTypeProvider>().route(route);
}
```

This way, creating a new route is as simple as adding it to the `routes` array of the corresponding
module
---

# Commit 4: implementing `getOngoingTrialsBySponsor` use-case

Now that I can check if a sponsor exists, I can implement the `getOngoingTrialsBySponsor` use-case

I've split the feature into two use-cases:

- `getOngoingTrialsBySponsor`
- `getOngoingTrials` that will be used by the second use-case `getOngoingTrialsByCountry`

I've created an HTTP adapter for `getOngoingTrialsBySponsor`

---

# Commit 3: implementing the first use-case

First things first, I need to implement the `getSponsorByName` use-case in the `Sponsors` bounded
context

## [Hexagonal architecture](https://www.youtube.com/watch?v=th4AgBcrEHA)

I'm using a hexagonal architecture, which means that I'm separating the business logic from the
infrastructure code

It makes it very easy to create acceptance tests and integration tests

- acceptance tests for the business logic
- integration tests for the infrastructure code (driven & driver adapters)

## [Vertical slicing architecture](https://www.youtube.com/watch?v=L2Wnq0ChAIA)

I'm using a vertical slicing architecture, which means that I'm grouping the code by feature instead
of by layer

I don't create a `controllers` folder for example, I create a `getSponsorByName` folder and put all
the code related to this use-case in it

This way, no need to switch between folders when working on a feature

It is a bit controversial, but I've found it to be very useful in my experience

## Dependency injection

I'm using [pure DI](https://blog.ploeh.dk/2014/06/10/pure-di/) to inject the dependencies to my
use-cases, which means that I'm not using a DI container

I know I could have used the `Reader` monad, but I didn't know how to use it with fp-ts and I quite
like the simplicity of pure DI

```typescript
import { handlers } from "@inato/modules-sponsors";

import { handler as rawHandler } from "./getOngoingTrialsBySponsor.handler";

const handler = rawHandler({
  // Injecting a dependency to a use-case handler
  getSponsorByName: handlers.getSponsorByName,
});
```

## Architecture overview

```
sponsors
├── domain // Business logic that can be shared between use-cases
│   └── sponsor // Name of the entity/aggregate
│       ├── errors
│       │   └── unknownSponsor.ts
│       ├── gateways // Interfaces for the driven ports
│       │   └── getAllSponsors.ts
│       └── type
│           ├── index.ts    // Entity/aggregate definition
│           └── name.ts     // Value object definition
├── gateways // Driven ports
│   └── getAllSponsors
│       ├── getAllSponsors.itest.ts // Integration test (from port to external service)
│       └── index.ts
└── useCases // Usage scenarios for the bounded context
    └── getSponsorByName // Name of the use-case
        ├── getSponsorByName.fixture.ts // Fixtures for the acceptance tests
        ├── getSponsorByName.handler.ts // Code of the use-case
        ├── getSponsorByName.http.ts    // HTTP adapter for the use-case
        ├── getSponsorByName.test.ts    // Acceptance tests
        └── index.ts                    // Composition root
```

I know that in software architecture,
[autonomy is more important than consistency](https://amzn.to/41UsEGw), but to make the code easier
to understand for the reviewers, I've used the same architecture in each module

## Branded types

I'm using [branded types](https://medium.com/@gcanti/branded-types-in-typescript-d9b65634b6b6) to
prevent mixing up values that are semantically different

```typescript
import * as z from "zod";
import { SPONSOR_NAME_SCHEMA } from "@inato/modules-sponsors";

// This is a raw type
const SPONSOR_NAME_RAW_SCHEMA = z.string().min(1).max(255);
// This is a branded type
const SPONSOR_NAME_SCHEMA = SPONSOR_NAME_RAW_SCHEMA.brand("SponsorName");

type SponsorNameRaw = z.infer<typeof SPONSOR_NAME_RAW_SCHEMA>;
type SponsorName = z.infer<typeof SPONSOR_NAME_SCHEMA>;

const fnWithoutBrandedType = (sponsorName: SponsorNameRaw) => {
  // ...
};

// Compiles even though the name of a sponsor can't be empty
fnWithoutBrandedType("");

const fnWithBrandedType = (sponsorName: SponsorName) => {
  // ...
};

// Doesn't compile as the string is not a `SponsorName`
fnWithBrandedType("");

const validString = SPONSOR_NAME_SCHEMA.parse("Sponsor name");

// This compiles as `validString` is a `SponsorName`, not just a `string`
fnWithBrandedType(validString);
```

## Use-case architecture overview

```ts
// The dependencies of the use-case
type Deps = {
  getRemoveData: GetRemoveData;
};

// The schema to validate the input
const schema = z.object({
  sponsorName: SPONSOR_NAME_RAW_SCHEMA,
});

// The input required by the use-case
type Input = z.infer<typeof schema>;

// The possible failures of the use-case
type Failure = InternalError | InvalidParameterError | UnknownSponsorError;

// The output of the use-case
type Output = TE.TaskEither<Failure, ReadonlyArray<Trial>>;

// The type signature of the function, I declare it outside the function as in Haskell
type UseCaseName = (deps: Deps) => (input: Input) => Output;

const handler: UseCaseName = (deps) => (input) => {
  // ...
};
```

## Test architecture

I believe one of the most important things in software development is to write tests so easy to read
that even you product owner can understand them, so you can work on them with him or her

Here is the standard structure I use when I write tests:

```typescript
feature("Description of the feature", () => {
  rule("A rule to respect in the feature", () => {
    success(
      `
        Given the initial state of your system
        When the user does something
        Then the result is a success
      `,
      async ({ then, when }) => {
        given.initialState();
        when.userDoes("something");
        await then.resultIsSuccess("Description of the success");
      }
    );

    failure(
      `
        Given the initial state of your system
        When the user does something
        Then the result is a failure
      `,
      async ({ then, when }) => {
        given.initialState();
        when.userDoes("something");
        await then.resultIsFailure(new Failure("Description of the failure"));
      }
    );
  });
});
```

I'm using an [object mother](https://martinfowler.com/bliki/ObjectMother.html) to create my fixtures
to make my code very easy to write and read

Here is an example from my codebase

```typescript
import { InvalidParameterError, stringOfLength } from "@inato/infra-common";
import {
  beforeEach,
  describe as feature,
  describe as rule,
  test as failure,
  test as success,
} from "vitest";

import { UnknownSponsorError } from "../../domain/sponsor";
import type { Context } from "./getSponsorByName.fixture";
import { given, reset, then, when } from "./getSponsorByName.fixture";

feature("getSponsorByName", () => {
  rule("A sponsor matching the given name is returned", () => {
    success(
      `
        Given 'Sponsor1' and 'Sponsor2' exist
        When the input is 'Sponsor1'
        Then 'Sponsor1' is returned
      `,
      async ({ given, then, when }) => {
        given.sponsorsExist(["Sponsor1", "Sponsor2"]);
        when.inputIs({ name: "Sponsor1" });
        await then.resultIsSuccess("Sponsor1");
      }
    );

    failure(
      `
        Given 'Sponsor1' and 'Sponsor2' exist
        When the input is 'Sponsor3'
        Then the result is a UnknownSponsorError
      `,
      async ({ given, then, when }) => {
        given.sponsorsExist(["Sponsor1", "Sponsor2"]);
        when.inputIs({ name: "Sponsor3" });
        await then.resultIsFailure(new UnknownSponsorError("Sponsor3"));
      }
    );
  });
});
```

---

# Commit 2: Analyzing the problem space

There are two bounded contexts, Sponsors and Trials

We also require a way to validate if a Country is valid, as it's not a bounded context on its own,
I've set the code in a shared kernel

Here a diagram of the domain model:

```
+-----------------+      +-----------------+
|  Sponsors       |<-----+  Trials         |
|                 |      |                 |
+-----------------+      +-------+---------+
                                 |
                                 |
                                 |
                                 |
                                 v
                         +-------+---------+
                         |  Shared Kernel  |
                         |                 |
                         +-----------------+
```

This lead me to the following directory structure:

```
src
├── apps
│   ├── http
│   └── trials
├── infra
│   ├── common
│   ├── console
│   └── http
└── modules
    ├── common
    ├── sponsors
    └── trials
```

- `apps` contains the entry points for the different applications -- `http` is the app that
  retrieves the different routes exposed by the `modules` to build a REST API -- `trials` is the app
  that runs the CLI for the customer success team
- `infra` contains the code that is specific to the infrastructure (code that can be shared between
  the apps and the modules) -- `common` contains code that is technology-agnostic -- `console`
  contains code that is specific to the console apps (CLI) -- `http` contains code that is specific
  to the REST APIs
- `modules` contains the code for the different bounded contexts -- `common` is the shared kernel --
  `sponsors` is the bounded context for the sponsors -- `trials` is the bounded context for the
  trials

## Monorepo

As the goal is to build the first parts of a larger-scale software, I've decided to use a monorepo

## [Modular monolith](https://www.youtube.com/watch?v=5OjqD-ow8GE)

As each component is a different npm package, you can easily work on your projects without impacting
the other ones

For example, if there is bug in `@inato/modules-trials@1.1.0`, I can easily revert the prod version
to `1.0.0` without having to deploy `@inato/modules-sponsors` again

I actually haven't had time to implement the ACLs between the different modules, thus the modules
are less modular than I would have liked

Here is what using a use case from the `sponsors` bounded context in the `trials` bounded context
looks like:

```typescript
import { handlers } from "@inato/modules-sponsors";

const getSponsorByName = handlers.getSponsorByName;
```

Which leads to a huge coupling between the two modules, leaking the ubiquitous language from one
bounded context to the other one.

---

# Before I forget

The `README.md` file is outdated in the repository as the example for the first step is incorrect in
2023

I would update it myself, but I don't want to use my Github account to make a pull request on a
technical test repository 😄

# Commit 1: Initialization

Creating the root package and installing the tools and dependencies I'll use

## Tools

- [x] [ESLint](https://eslint.org/)

I'm using it more like a tool to format the code for me and make everything consistent, this is why
I disable a lot of rules that prevent me from working (for example
`@typescript-eslint/no-explicit-any` as there is nothing wrong with using `any` in some precise
cases, mostly with generics and type inference)

- [x] [Prettier](https://prettier.io/)
- [x] [Vitest](https://vitest.dev/)

## Dependencies

- [x] [chalk](https://www.npmjs.com/package/chalk)

To color the console output

- [x] [commander](https://www.npmjs.com/package/commander)

To create the CLI

- [x] [date-fns](https://www.npmjs.com/package/date-fns)

Make it easier to work with dates

- [x] [fastify](https://www.npmjs.com/package/fastify)

I've compared all the major alternatives to look for the framework with the best TypeScript support
and Fastify was the winner, even though it's not great at it

- [x] [fp-ts](https://www.npmjs.com/package/fp-ts)

I've seen that it is part of Inato's stack, and I've been looking for an excuse to try it out

Note that I have some experience with functional programming (I've worked with F# and Haskell in my
personal time) but I've never used fp-ts before

- [x] [zod](https://www.npmjs.com/package/zod)

Schema validation with static type inference

I know the de facto standard for working with fp-ts is io-ts, but I've never used it before and
using fp-ts was already a big enough challenge for me

## No framework

The only "framework" I'm using is Fastify, which is a very thin layer on top of Node.js

I'm part of the [frameworkless movement](https://frameworklessmovement.org/) as I do see the appeal
behind frameworks, but I think they don't replace the need for a good architecture and good design,
and they often get in the way of that I'm trying to achieve

My bigger issue with frameworks is that they are often very opinionated, and they restrain our
creativity