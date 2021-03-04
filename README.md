<p>
  <h1 align="center">MobileView</h1>
</p>

<p align="center">
  <a href="https://snyk.io/test/github/hcl2020/mobile-view?targetFile=package.json"><img src="https://snyk.io/test/github/hcl2020/mobile-view/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/hcl2020/mobile-view?targetFile=package.json" style="max-width:100%;"></a>
  <a href="https://codecov.io/gh/hcl2020/mobile-view"><img src="https://codecov.io/gh/hcl2020/mobile-view/branch/master/graph/badge.svg" alt="Coverage Status"></a>
  <a href="https://npmcharts.com/compare/mobile-view?minimal=true"><img src="https://img.shields.io/npm/dm/mobile-view.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/mobile-view"><img src="https://img.shields.io/npm/v/mobile-view.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/mobile-view"><img src="https://img.shields.io/npm/l/mobile-view.svg" alt="License"></a>
</p>

使用 MobileView 让移动端竖屏网页快速适配大屏幕的横屏展示。提供与当前网址保持同步的二维码。支持单页和多页应用。

Use MobileView to quickly adapt the vertical web page of mobile to the horizontal display of large screen. Provide a QRCode of the current web address.  
Support SPA and MPA.

## 演示 Demo

<a href="https://unpkg.com/mobile-view/example/index.html">Demo</a>

## 安装 Install

npm install mobile-view --save

## 使用 Usage

尽可能将以下代码放在所有代码之前。

Put the following code before all code as much as possible.

```html
<script src="https://unpkg.com/mobile-view"></script>
<script>
  MobileView();
</script>
```

```typescript
import MobileView from 'mobile-view';
MobileView();
```

### 配置示例 Options Example

```typescript
MobileView({
  message: '建议使用手机访问此页面, 或访问此页面的<a href="#">电脑版</a>',
  tips: '扫描二维码用手机查看~',
  threshold: 800
});
```

## License

MIT © [HeChanglin](https://github.com/hcl2020)
