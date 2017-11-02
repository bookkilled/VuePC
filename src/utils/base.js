/**
 * 常用方法
 */

// 解析string形式的入参
/* 注：str-例如：'productSide=12003&secondLevelType=%E5%93%88%E5%93%88%E6%98%AF%E6%88%91&tagCode=huijin8'
      decode: true / false  PS:如果str内含有encodeURIComponent('哈哈是我')处理过的数据 就需要true，否则false
      例如：
      getQueryParams('productSide=12003&secondLevelType=%E5%93%88%E5%93%88%E6%98%AF%E6%88%91&tagCode=huijin8',true)
      getQueryParams('productSide=12003&secondLevelType=itsme&tagCode=huijin8',false)
*/
export function getQueryParams(str, decode) {
    var pairs = [];
    if (typeof str === 'boolean') {
      decode = str;
      str = location.search;
    }
    str = str || location.search;
    decode = !!decode;

    var ret = {},
        paris;

    if (/\?/.test(str)) {
      pairs = str ? (str.split('#')[0].split('?')[1] || '').split('&') : [];
    } else {
      pairs = str.split('&');
    }

    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split('=');
      if (kv.length > 1) {
        ret[kv[0]] = decode ? decodeURIComponent(kv[1]) : kv[1];
      }
    }
    return ret;
  }
// 获取url入参(单个) 例如:getUrlParam('tagCode')
export function getUrlParam(name) {
  let search = arguments[1]?arguments[1]:window.location.search.substr(1);
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = search.match(reg);
  if (r != null) return decodeURIComponent(r[2]); return null;
}
// 获取url入参(多个) 例如:getUrlParams(['tagCode','secondLevelType'])
export function getUrlParams(names){
  let search = arguments[1]?arguments[1]:window.location.search.substr(1);
  return names.reduce((pre,cur)=>{
    pre[cur] = getUrlParam(cur,search);
    return  pre;
  },{})
}

// aes atob、btoa 转换(PS: 解决了中文乱码问题)
export function fbtoa(str) {
  return btoa(encodeURIComponent(str))
}

export function fatob(str) {
  return decodeURIComponent(atob(str))
}

// 判断微信
export function isWeiXin() {
  const ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    window.isWeixin = true
  } else {
    window.isWeixin = false
  }
}
// 解决微信下面title设置问题
export function setTit(title) {
  // 利用iframe的onload事件刷新页面
  console.log(title)
  document.title = title
  const iframe = document.createElement('iframe')
  iframe.src = '//www.leadfund.com.cn/common/images/favicon.ico'
  iframe.style.visibility = 'hidden'
  iframe.style.width = '1px'
  iframe.style.height = '1px'
  iframe.onload = function () {
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 0)
  }
  document.body.appendChild(iframe)
}