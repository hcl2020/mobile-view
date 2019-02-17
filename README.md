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

----------

    new MobileView();

----------

    new MobileView({
        message: '建议使用手机访问此页面, 或访问此页面的<a href="#">电脑版</a>',
        tips: '扫描二维码用手机查看~',
        threshold: 800
    });

## License

MIT © [HeChanglin](https://github.com/hcl2020)