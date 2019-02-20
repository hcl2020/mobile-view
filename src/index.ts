let strStyle = `#mobile-view{padding-top:50px;text-align:center}
#mobile-view-mobile{background:#333;display:inline-block;padding:3px;border-radius:20px;-webkit-box-shadow:#000 6px 6px 20px 2px;box-shadow:#666 8px 20px 26px;border:#333 1px solid}
#mobile-view-mobile iframe{width:375px;height:734px;background:#fff;border:#000 2px solid;border-radius:17px;margin:0;padding:0;display:block}
#mobile-view-message{position:fixed;top:0;right:0;left:0;background:rgba(204,204,204,0.5);padding:10px;color:#666;text-align:center;font-size:16px}
#mobile-view-message a{color:#666}
#mobile-view-qrcode{font-size: 14px;color: #999;text-align: center;position: fixed;top: 50%;right: 0;transform: translateY(-50%);background: #fff;padding: 10px;}`;

// import QRCode from 'qrcode_js';
import QRCode from './libs/qrcode';

// TODO: 浏览器兼容

let qrcode;

function changeQrCode(text) {
  console.log('MobileView: QrCode', text);
  if (text.match(/^http(s)?:\/\//)) {
    text += text.match(/\?/) ? '&' : '?';
    text += 'from=MobileView';
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

function stopLoadNextEl() {
  try {
    window.stop();
  } catch (error) {
    // For IE
    document.execCommand('stop');
  }
}

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

  let { userAgent = '' } = navigator;
  if (!userAgent.match(/chrome/i) || userAgent.match(/edge/i)) {
    // 暂时只支持Chrome浏览器
    return false;
  }

  let bodyTpl = `
<div id="mobile-view">
  <div id="mobile-view-mobile">
    <iframe src="${location.href}"></iframe>
  </div>
  <div id="mobile-view-message">${message}</div>
  <div id="mobile-view-qrcode">
    <div id="mobile-view-qrcode-img"></div>
    <p>${tips}</p>
  </div>
</div>
<style>${strStyle}</style>`;

  // 停止网页解析和资源加载，构造body对象 (only Chrome)
  stopLoadNextEl();
  document.open();
  document.close();

  // 移除 head 中的各种 (For Chrome 36...)
  document.head.innerHTML = '';

  let $body = document.body;
  if ($body) {
    $body.innerHTML = bodyTpl;
  } else {
    console.warn('no body');
    document.open();
    document.write(bodyTpl);
    document.close();
  }

  function insertStyle(doc) {
      /* 处理滚动条 */
      let strCss =
        '::-webkit-scrollbar{width:6px;height:5px;background-color:rgba(0,0,0,0.05)}' +
        '::-webkit-scrollbar-thumb{border-radius:3px;background-color:rgba(0,0,0,0.3)}' +
        '::-webkit-scrollbar-thumb:hover{border-radius:3px;background-color:rgba(0,0,0,0.7)}';
      let $style = doc.createElement('style');
      $style.innerHTML = strCss;
      doc.head.appendChild($style);
  }

  function initIframe() {
    let { contentDocument, contentWindow } = this;

    if (contentDocument) {

    insertStyle(contentDocument);
    /* 处理地址栏 */
    let _location = contentWindow.location;

    history.replaceState(null, '', _location.href);
    changeQrCode(_location.href);

    let { replaceState, pushState } = contentWindow.history;
    contentWindow.history.replaceState = function() {
      replaceState.apply(this, arguments);
      history.replaceState.apply(history, arguments);
      changeQrCode(_location.href);
    };
    contentWindow.history.pushState = function() {
      pushState.apply(this, arguments);
      history.replaceState.apply(history, arguments);
      changeQrCode(_location.href);
    };

    contentWindow.addEventListener('hashchange', function(event) {
      window.location.hash = _location.hash;
    });

    contentWindow.addEventListener('popstate', function(event) {
      changeQrCode(_location.href);
    });
  } else {
    // 跨域外部链接
    // TODO: 获取外部链接，生成二维码，地址栏给出提示
  }

  }

  let $iframe = document.getElementsByTagName('iframe')[0];
  if ($iframe) {
    $iframe.onload = initIframe;
  }

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
