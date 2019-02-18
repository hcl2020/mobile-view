let strStyle = `#mobile-view{padding-top:50px;text-align:center}
#mobile-view-mobile{background:#333;display:inline-block;padding:3px;border-radius:20px;-webkit-box-shadow:#000 6px 6px 20px 2px;box-shadow:#666 8px 20px 26px;border:#333 1px solid}
#mobile-view-mobile iframe{width:375px;height:734px;background:#fff;border:#000 2px solid;border-radius:17px;margin:0;padding:0;display:block}
#mobile-view-message{position:fixed;top:0;right:0;left:0;background:rgba(204,204,204,0.5);padding:10px;color:#666;text-align:center;font-size:16px}
#mobile-view-message a{color:#666}
#mobile-view-qrcode{font-size: 14px;color: #999;text-align: center;position: fixed;top: 50%;right: 0;transform: translateY(-50%);background: #fff;padding: 10px;}`;

// import QRCode from 'qrcode_js';
import QRCode from './libs/qrcode';

let qrcode;

function makeQrCode(text) {
  console.log('changeTo:', text);
  if (text.match(/^http(s)?:\/\//)) {
    text += text.match(/\?/) ? '&' : '?';
    text += 'from=QrCode';
  }

  if (qrcode) {
    qrcode.clear(); // clear the code.
    qrcode.makeCode(text); // make another code.
  } else {
    qrcode = new QRCode(document.getElementById('mobile-view-qrcode-img'), {
      text: text,
      width: 128,
      height: 128,
      colorDark: '#000000',
      colorLight: '#ffffff'
      // correctLevel: QRCode.CorrectLevel.H
    });
  }
}

let isDOMContentLoaded = function() {
  return !!document.body;
};

let defaultOpt = {
  message: '建议使用手机访问此页面',
  tips: '扫描二维码用手机查看~',
  threshold: 800 // maxWidth: 800
};

let MobileView = function MobileView(opt) {
  opt = opt || {};
  let message = opt.message || defaultOpt.message;
  let tips = opt.tips || defaultOpt.tips;
  let threshold = opt.threshold || defaultOpt.threshold;
  if (window.innerWidth <= threshold || window.screen.width <= threshold) {
    return false;
  }

  // document.write('<hr>')

  if (!isDOMContentLoaded()) {
    setTimeout(MobileView, 25, opt);
    return true;
  }

  let pageUrl = location.href;
  // let strTpl = '<div id="mobile-view"><div id="mobile-view-mobile"><p><mark></mark></p><iframe src="' +
  let strTpl =
    '<div id="mobile-view"><div id="mobile-view-mobile"><iframe src="' +
    pageUrl +
    // '"></iframe><span></span></div><div id="mobile-view-message">' +
    '"></iframe></div><div id="mobile-view-message">' +
    message +
    '</div><div id="mobile-view-qrcode"><div id="mobile-view-qrcode-img"></div><p>' +
    tips +
    '</p></div></div><style>' +
    strStyle +
    '</style>';

  let $body = document.body;
  $body.innerHTML = strTpl;
  document.head.innerHTML = '';

  let $iframe = document.getElementsByTagName('iframe')[0];
  $iframe.onload = function() {
    let _window = $iframe.contentWindow;
    /* 处理滚动条 */
    let strCss =
      '::-webkit-scrollbar{width:6px;height:5px;background-color:rgba(0,0,0,0.05)}' +
      '::-webkit-scrollbar-thumb{border-radius:3px;background-color:rgba(0,0,0,0.3)}' +
      '::-webkit-scrollbar-thumb:hover{border-radius:3px;background-color:rgba(0,0,0,0.7)}';
    let $style = _window.document.createElement('style');
    $style.innerHTML = strCss;
    _window.document.head.appendChild($style);
    /* 处理地址栏 */
    let pathname = _window.location.pathname;

    makeQrCode(_window.location.href);

    history.pushState(null, _window.document.title, pathname);
    _window.addEventListener('hashchange', function(Event) {
      window.location.hash = _window.location.hash;
    });

    _window.addEventListener('popstate', function(Event) {
      makeQrCode(_window.location.href);
    });

    let _replaceState = _window.history.replaceState;
    if (_replaceState) {
      _window.history.replaceState = function() {
        _replaceState.apply(_window.history, arguments);
        history.replaceState.apply(history, arguments);
        makeQrCode(_window.location.href);
      };
    }
    let _pushState = _window.history.pushState;
    if (_pushState) {
      _window.history.pushState = function() {
        _pushState.apply(_window.history, arguments);
        history.replaceState.apply(history, arguments);
        makeQrCode(_window.location.href);
      };
    }
  };

  // 移除 head 中的 stylesheet
  let $head = document.head;
  let $heads = $head.children;
  for (let i = 0; $heads[i]; ) {
    if (
      $heads[i]['type'] == 'text/css' ||
      $heads[i]['rel'] == 'stylesheet' ||
      $heads[i]['type'] == 'text/javascript' ||
      $heads[i]['tagName'] == 'SCRIPT'
    ) {
      $head.removeChild($heads[i]);
    } else {
      i++;
    }
  }

  // window.onerror = function(e) {
  // console.log(e);
  // }
  // throw new Error('MobileView');

  return true;
};

export default MobileView;
