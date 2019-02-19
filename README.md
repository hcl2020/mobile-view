<p align="center">
  <a href="https://snyk.io/test/github/hcl2020/mobile-view?targetFile=package.json"><img src="https://snyk.io/test/github/hcl2020/mobile-view/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/hcl2020/mobile-view?targetFile=package.json" style="max-width:100%;"></a>
  <a href="https://codecov.io/gh/hcl2020/mobile-view"><img src="https://codecov.io/gh/hcl2020/mobile-view/branch/master/graph/badge.svg" alt="Coverage Status"></a>
  <a href="https://npmcharts.com/compare/mobile-view?minimal=true"><img src="https://img.shields.io/npm/dm/mobile-view.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/mobile-view"><img src="https://img.shields.io/npm/v/mobile-view.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/mobile-view"><img src="https://img.shields.io/npm/l/mobile-view.svg" alt="License"></a>
</p>

# MobileView

> A front-end tool for previewing mobile web page on a large screen.

## why

    对于专为移动端(竖屏)设计开发的网页，往往不适合在桌面端等大屏幕(横屏)展示，需要做专门的适配处理。而使用 MobileView 可以快速让竖屏移动端网页适配大屏幕的横屏展示，通过iframe的方式直接展示手机的预览效果，并提供二维码方便移动端设备打开，同时地址栏与二维码地址能保持与原网页同步。

    For web pages designed and developed for mobile terminals (vertical screens), they are often not suitable for large screens (horizontal screens) on the desktop, and need to be specially adapted. MobileView can quickly adapt the vertical mobile page to the horizontal display of the large screen, display the preview effect of the mobile phone directly through iframe, and provide qrcode to facilitate the mobile device to open, while the address bar and qrcode address can keep synchronization with the original page.

## Install

    npm install mobile-view --save

## Usage

    Put the following code before all code as much as possible.

### Broswer

    <script src="dist/mobile-view.js"></script>

### UMD

    var MobileView = require('mobile-view');

### ES6

    import MobileView from 'mobile-view';

---

    MobileView();

---

    MobileView({
        message: '建议使用手机访问此页面, 或访问此页面的<a href="#">电脑版</a>',
        tips: '扫描二维码用手机查看~',
        threshold: 800
    });

## License

MIT © [HeChanglin](https://github.com/hcl2020)
