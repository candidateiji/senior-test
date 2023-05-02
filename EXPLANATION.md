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