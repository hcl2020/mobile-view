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

interface MobileViewOption {
  tips?: string;
  message?: string;
  threshold?: number;
  noThrowError?: boolean;
}

let MobileView = function MobileView(option: MobileViewOption = {}): boolean {
  let {
    tips = '扫描二维码用手机查看~',
    message = '建议使用手机访问此页面',
    threshold = 981,
    noThrowError = false
  } = option;

  if (window.innerWidth <= threshold || window.screen.width <= threshold) {
    return false;
  }

  if (!isDOMContentLoaded()) {
    setTimeout(MobileView, 25, option);
    return true;
  }

  let pageUrl = location.href;
  let strTpl = `
<div id="mobile-view">
  <div id="mobile-view-mobile">
    <iframe src="${pageUrl}"></iframe>
  </div>
  <div id="mobile-view-message">${message}</div>
  <div id="mobile-view-qrcode">
    <div id="mobile-view-qrcode-img"></div>
    <p>${tips}</p>
  </div>
</div>
<style>${strStyle}</style>`;

  let $body = document.body;
  $body.innerHTML = strTpl;

  // 移除 head 中的各种
  document.head.innerHTML = '';

  let $iframe = document.getElementsByTagName('iframe')[0];
  $iframe.onload = function() {
    let { contentWindow } = $iframe;
    /* 处理滚动条 */
    let strCss =
      '::-webkit-scrollbar{width:6px;height:5px;background-color:rgba(0,0,0,0.05)}' +
      '::-webkit-scrollbar-thumb{border-radius:3px;background-color:rgba(0,0,0,0.3)}' +
      '::-webkit-scrollbar-thumb:hover{border-radius:3px;background-color:rgba(0,0,0,0.7)}';
    let $style = contentWindow.document.createElement('style');
    $style.innerHTML = strCss;
    contentWindow.document.head.appendChild($style);
    /* 处理地址栏 */
    let { pathname } = contentWindow.location;

    makeQrCode(contentWindow.location.href);

    history.pushState(null, contentWindow.document.title, pathname);
    contentWindow.addEventListener('hashchange', function(Event) {
      window.location.hash = contentWindow.location.hash;
    });

    contentWindow.addEventListener('popstate', function(Event) {
      makeQrCode(contentWindow.location.href);
    });

    let _replaceState = contentWindow.history.replaceState;
    if (_replaceState) {
      contentWindow.history.replaceState = function() {
        _replaceState.apply(contentWindow.history, arguments);
        history.replaceState.apply(history, arguments);
        makeQrCode(contentWindow.location.href);
      };
    }
    let _pushState = contentWindow.history.pushState;
    if (_pushState) {
      contentWindow.history.pushState = function() {
        _pushState.apply(contentWindow.history, arguments);
        history.replaceState.apply(history, arguments);
        makeQrCode(contentWindow.location.href);
      };
    }
  };


  if (noThrowError) {
    return true;
  } else {
    let { onerror } = window;
    window.onerror = function mv_onerror(message) {
      console.log('MobileView: __VERSION__');
      window.onerror = onerror;
      return true;
    };
    throw new Error('MobileView：阻止后续代码执行');
  }
};

export default MobileView;
