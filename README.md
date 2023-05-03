# Context

As a product engineer in the team, you suggested to build an internal tool for our customer success team. You agreed with the product team on the following milestones.

## Step 1: Web API

We first need to be able to query the list of ongoing clinical trials for a given sponsor. We already have access to a third-party API (represented by [this file](src/infra/common/src/data/trials.json)) listing all clinical trials, and we are going to build a wrapper around it.

A trial is _ongoing_ if:

- its start date is in the past
- its end date is in the future
- it has not been canceled

Here is the payload you should obtain when querying ongoing clinical trials for the sponsor "Sanofi":

```json
[
  {
    "name": "Olaparib + Sapacitabine in BRCA Mutant Breast Cancer",
    "start_date": "2019-01-01",
    "end_date": "2025-08-01",
    "sponsor": "Sanofi"
  },
  {
    "name": "Topical Calcipotriene Treatment for Breast Cancer Immunoprevention",
    "start_date": "2018-03-20",
    "end_date": "2022-09-10",
    "sponsor": "Sanofi"
  }
]
```

Example stack: http server exposing REST endpoint that serves json payloads. Feel free to use something you are more comfortable with, like GraphQL, if you want to.

## Step 2: Command-line interface

We will then build a command-line interface that displays the list of ongoing clinical trials for a given country code. It will be deployed on the computers of the customer success team. We already have access to a [file](src/infra/common/src/data/countries.json) that maps country codes to country names. We will leverage what we have already built in the previous step.

Here is the output you should get for the country code "FR":

```txt
Olaparib + Sapacitabine in BRCA Mutant Breast Cancer, France
Topical Calcipotriene Treatment for Breast Cancer Immunoprevention, France
```

# Instructions

- [ ] Clone this repository (do **not** fork it)
- [ ] Implement the features step-by-step, documenting your architecture and design choices along the way
- [ ] Publish it on GitHub (or equivalent)
- [ ] Send us the link and tell us approximatively how much time you spent on this assignment

## Guidelines

This assignment is limited in scope and could be solved by writing all the code in a single file. Still, we want you to architect your tests and your code as if you were building the first parts of a larger-scale software. Imagine that a lot of features are going to be added in the future, by other engineers. Focus on maintainability and extensibility, even though it might feel like over-engineering.

You are allowed to use the technologies of your choice, but if you are looking for inspiration use [ours](https://stackshare.io/inato/marketplace). You are encouraged to make good use of open-source code.

## Out of scope

- Usage of third party tools, like a CI service
- Performance
- Security
