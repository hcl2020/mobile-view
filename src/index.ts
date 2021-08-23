// @ts-ignore
import QRCode from './libs/qrcode'; // from 'qrcode_js';
const strStyle = '__CSS_CONTENT__';

let qrcode: any;

function changeQrCode(text: string) {
  console.log('MobileView: QrCode', text);
  text = addParam(text, 'from=MobileView');
  if (qrcode) {
    qrcode.clear(); // clear the code.
    qrcode.makeCode(text); // make another code.
  } else {
    qrcode = new QRCode(document.getElementById('mobile-view-qrcode-img'), {
      text: text,
      width: 156,
      height: 156,
      colorDark: '#000000',
      colorLight: '#ffffff'
      // correctLevel: QRCode.CorrectLevel.H
    });
  }
}

function addParam(text: string, param: string) {
  if (param && text.match(/^http(s)?:\/\//)) {
    text += text.includes('?') ? '&' : '?';
    text += param;
  }
  return text;
}

function syncTitle(contentDocument: Document, document: Document) {
  let $title = contentDocument.getElementsByTagName('title')[0];
  if ($title) {
    new MutationObserver(records => {
      records.forEach(record => {
        document.title = contentDocument.title;
      });
    }).observe($title, { subtree: true, childList: true, characterData: true });
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
  logo?: string;
}

const MobileView = function MobileView(option: MobileViewOption = {}): boolean {
  let {
    tips = '扫描二维码用手机查看~',
    message = '建议使用手机访问此页面',
    threshold = 981,
    noThrowError = false,
    logo = ''
  } = option;

  if (window.innerWidth <= threshold || window.screen.width <= threshold) {
    return false;
  }

  let bodyTpl = `
<div id="mobile-view">
  <div id="mobile-view-message">${message}</div>
  <div id="mobile-view-qrcode">
    <div id="mobile-view-qrcode-img"></div>
    ${logo ? `<img id="mobile-view-qrcode-logo" src="${logo}" alt="logo" />` : ''} 
    <p>${tips}</p>
  </div>
  <div id="mobile-view-mobile">
    <mark></mark>
    <iframe src="${location.href}"></iframe>
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
  if (!$body) {
    $body = document.createElement('body');
    document.getElementsByTagName('html')[0].append($body);
  }
  $body.innerHTML = bodyTpl;

  changeQrCode(location.href);

  function insertStyle(doc: Document) {
    let strCss =
      '* {-ms-overflow-style: -ms-autohiding-scrollbar;scrollbar-width: thin;}' +
      '::-webkit-scrollbar{width:6px;height:6px;background:transparent}' +
      '::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.5)}' +
      '::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.5)}' +
      '::-webkit-scrollbar-corner{display: none}';

    let $style = doc.createElement('style');
    $style.innerHTML = strCss;
    doc.head.appendChild($style);
  }

  let $iframe = document.getElementsByTagName('iframe')[0];
  if ($iframe) {
    $iframe.onload = function initIframe() {
      let { contentDocument, contentWindow } = $iframe;

      if (contentDocument && contentWindow) {
        insertStyle(contentDocument);
        /* 处理地址栏 */
        let _location = contentWindow.location;

        history.replaceState(null, '', _location.href);
        changeQrCode(_location.href);

        let { replaceState, pushState } = contentWindow.history;
        contentWindow.history.replaceState = function (
          data: any,
          unused: string,
          url?: string | URL | null | undefined
        ) {
          replaceState.apply(this, [data, unused, url]);
          history.replaceState.apply(history, [data, unused, url]);
          changeQrCode(_location.href);
        };
        contentWindow.history.pushState = function (data: any, unused: string, url?: string | URL | null | undefined) {
          pushState.apply(this, [data, unused, url]);
          history.replaceState.apply(history, [data, unused, url]);
          changeQrCode(_location.href);
        };

        contentWindow.addEventListener('hashchange', function (event) {
          window.location.hash = _location.hash;
        });

        contentWindow.addEventListener('popstate', function (event) {
          changeQrCode(_location.href);
        });

        document.title = contentDocument.title;
        syncTitle(contentDocument, document);
      } else {
        // 跨域外部链接
        // TODO: 获取外部链接，生成二维码，地址栏给出提示
      }
    };
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
