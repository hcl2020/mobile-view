<p align="center">
  <a href="https://snyk.io/test/github/hcl2020/mobile-view?targetFile=package.json"><img src="https://snyk.io/test/github/hcl2020/mobile-view/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/hcl2020/mobile-view?targetFile=package.json" style="max-width:100%;"></a>
  <a href="https://codecov.io/gh/hcl2020/mobile-view"><img src="https://codecov.io/gh/hcl2020/mobile-view/branch/master/graph/badge.svg" alt="Coverage Status"></a>
  <a href="https://npmcharts.com/compare/mobile-view?minimal=true"><img src="https://img.shields.io/npm/dm/mobile-view.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/mobile-view"><img src="https://img.shields.io/npm/v/mobile-view.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/mobile-view"><img src="https://img.shields.io/npm/l/mobile-view.svg" alt="License"></a>
</p>

# mobile-view

> A front-end tool for previewing mobile web page on a large screen.

## Install

    npm install mobile-view --save

## Usage

### Broswer

    <script src="dist/mobile-view.js"></script>

### UMD

    var MobileView = require('mobile-view');

### ES6

    import MobileView from 'mobile-view';

---

    new MobileView();

---

    new MobileView({
        message: '建议使用手机访问此页面, 或访问此页面的<a href="#">电脑版</a>',
        tips: '扫描二维码用手机查看~',
        threshold: 800
    });

## License

MIT © [HeChanglin](https://github.com/hcl2020)
