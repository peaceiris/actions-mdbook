[![license](https://img.shields.io/github/license/peaceiris/actions-mdbook.svg)](https://github.com/peaceiris/actions-mdbook/blob/master/LICENSE)
[![release](https://img.shields.io/github/release/peaceiris/actions-mdbook.svg)](https://github.com/peaceiris/actions-mdbook/releases/latest)
[![GitHub release date](https://img.shields.io/github/release-date/peaceiris/actions-mdbook.svg)](https://github.com/peaceiris/actions-mdbook/releases)
![GitHub Actions status](https://github.com/peaceiris/actions-mdbook/workflows/Test/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/peaceiris/actions-mdbook/badge)](https://www.codefactor.io/repository/github/peaceiris/actions-mdbook)

<img width="400" alt="GitHub Actions for mdBook" src="./images/ogp.jpg">



## GitHub Actions for mdBook

[rust-lang/mdBook] Setup Action.

[rust-lang/mdBook]: https://github.com/rust-lang/mdBook

We can run **mdBook** on a virtual machine of **GitHub Actions** by this mdBook action.
Linux, macOS, and Windows are supported.

| OS (runs-on) | ubuntu-18.04 | macos-latest | windows-2019 |
|---|:---:|:---:|:---:|
| Support | ✅️ | ✅️ | ✅️ |



## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting started](#getting-started)
  - [⭐️ Create your workflow](#%EF%B8%8F-create-your-workflow)
- [Options](#options)
  - [⭐️ Use the latest version of mdBook](#%EF%B8%8F-use-the-latest-version-of-mdbook)
- [License](#license)
- [About the author](#about-the-author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Getting started

### ⭐️ Create your workflow

An example workflow `.github/workflows/gh-pages.yml` with [GitHub Actions for GitHub Pages]

[GitHub Actions for GitHub Pages]: https://github.com/peaceiris/actions-gh-pages

[![peaceiris/actions-gh-pages - GitHub](https://gh-card.dev/repos/peaceiris/actions-gh-pages.svg?fullname)](https://github.com/peaceiris/actions-gh-pages)

![peaceiris/actions-mdbook latest version](https://img.shields.io/github/release/peaceiris/actions-mdbook.svg?label=peaceiris%2Factions-mdbook)
![peaceiris/actions-gh-pages latest version](https://img.shields.io/github/release/peaceiris/actions-gh-pages.svg?label=peaceiris%2Factions-gh-pages)

```yaml
name: github pages

on:
  push:
    branches:
    - master

jobs:
  build-deploy:
    runs-on: ubuntu-18.04
    steps:
    - uses: actions/checkout@master

    - name: Setup mdBook
      uses: peaceiris/actions-mdbook@v1
      with:
        mdbook-version: '0.3.5'
        # mdbook-version: 'latest'

    - run: mdbook build

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v2.5.0
      env:
        ACTIONS_DEPLOY_KEY: ${{ secrets.ACTIONS_DEPLOY_KEY }}
        PUBLISH_BRANCH: gh-pages
        PUBLISH_DIR: ./book
```

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>



## Options

### ⭐️ Use the latest version of mdBook

Set `mdbook-version: 'latest'` to use the latest version of mdBook.

```yaml
- name: Setup mdBook
  uses: peaceiris/actions-mdbook@v1
  with:
    mdbook-version: 'latest'
```

This action fetches the latest version of mdBook by [mdbook — Homebrew Formulae](https://formulae.brew.sh/formula/mdbook)

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>



## License

- [MIT License - peaceiris/actions-mdbook]

[MIT License - peaceiris/actions-mdbook]: https://github.com/peaceiris/actions-mdbook/blob/master/LICENSE



## About the author

- [peaceiris's homepage](https://peaceiris.com/)



<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>
