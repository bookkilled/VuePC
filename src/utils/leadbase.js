/**
 * leadbase 模块化
 */

/**
 * 常量定义
 */
const ua = navigator.userAgent.toUpperCase();
// 当前环境是否为Android平台
export const IS_ANDROID = ua.indexOf('ANDROID') != -1;
// 当前环境是否为IOS平台
export const IS_IOS = ua.indexOf('IPHONE OS') != -1;
// 当前环境是否为WP平台
export const IS_WP = ua.indexOf('WINDOWS') != -1 && ua.indexOf('PHONE') != -1;
// 判断微信 true or false
export const IS_WX = ua.match(/MicroMessenger/i) == 'MICROMESSENGER'

// rsa加密
export function encrypts (a) {
  function b(a, b, c) {
    this.e = s(a), this.d = s(b), this.m = s(c), this.chunkSize = 128, this.radix = 16, this.barrett = new d(this.m)
  }

  function c(a, b) {
    for (var c = new Array, d = b.length, e = 0; d > e;)c[e] = b.charCodeAt(e), e++;
    for (; c.length % a.chunkSize != 0;)c[e++] = 0;
    var f, g, h, j = c.length, k = "";
    for (e = 0; j > e; e += a.chunkSize) {
      for (h = new i, f = 0, g = e; g < e + a.chunkSize; ++f)h.digits[f] = c[g++], h.digits[f] += c[g++] << 8;
      var l = a.barrett.powMod(h, a.e), m = 16 == a.radix ? p(l) : n(l, a.radix);
      k += m + " "
    }
    return k.substring(0, k.length - 1)
  }

  function d(a) {
    this.modulus = k(a), this.k = v(this.modulus) + 1;
    var b = new i;
    b.digits[2 * this.k] = 1, this.mu = H(b, this.modulus), this.bkplus1 = new i, this.bkplus1.digits[this.k + 1] = 1, this.modulo = e, this.multiplyMod = f, this.powMod = g
  }

  function e(a) {
    var b = D(a, this.k - 1), c = x(b, this.mu), d = D(c, this.k + 1), e = E(a, this.k + 1), f = x(d, this.modulus), g = E(f, this.k + 1), h = u(e, g);
    h.isNeg && (h = t(h, this.bkplus1));
    for (var i = F(h, this.modulus) >= 0; i;)h = u(h, this.modulus), i = F(h, this.modulus) >= 0;
    return h
  }

  function f(a, b) {
    var c = x(a, b);
    return this.modulo(c)
  }

  function g(a, b) {
    var c = new i;
    c.digits[0] = 1;
    for (var d = a, e = b; ;) {
      if (0 != (1 & e.digits[0]) && (c = this.multiplyMod(c, d)), e = B(e, 1), 0 == e.digits[0] && 0 == v(e))break;
      d = this.multiplyMod(d, d)
    }
    return c
  }

  function h(a) {
    I = a, J = new Array(I);
    for (var b = 0; b < J.length; b++)J[b] = 0;
    K = new i, L = new i, L.digits[0] = 1
  }

  function i(a) {
    "boolean" == typeof a && 1 == a ? this.digits = null : this.digits = J.slice(0), this.isNeg = !1
  }

  function k(a) {
    var b = new i(!0);
    return b.digits = a.digits.slice(0), b.isNeg = a.isNeg, b
  }

  function l(a) {
    var b = new i;
    b.isNeg = 0 > a, a = Math.abs(a);
    for (var c = 0; a > 0;)b.digits[c++] = a & R, a = Math.floor(a / O);
    return b
  }

  function m(a) {
    for (var b = "", c = a.length - 1; c > -1; --c)b += a.charAt(c);
    return b
  }

  function n(a, b) {
    var c = new i;
    c.digits[0] = b;
    for (var d = G(a, c), e = S[d[1].digits[0]]; 1 == F(d[0], K);)d = G(d[0], c), digit = d[1].digits[0], e += S[d[1].digits[0]];
    return (a.isNeg ? "-" : "") + m(e)
  }

  function o(a) {
    var b = 15, c = "";
    for (var X = 0; 4 > X; ++X)c += T[a & b], a >>>= 4;
    return m(c)
  }

  function p(a) {
    for (var b = "", c = (v(a), v(a)); c > -1; --c)b += o(a.digits[c]);
    return b
  }

  function q(a) {
    var b, c = 48, d = c + 9, e = 97, f = e + 25, g = 65, h = 90;
    return b = a >= c && d >= a ? a - c : a >= g && h >= a ? 10 + a - g : a >= e && f >= a ? 10 + a - e : 0
  }

  function r(a) {
    for (var b = 0, c = Math.min(a.length, 4), d = 0; c > d; ++d)b <<= 4, b |= q(a.charCodeAt(d));
    return b
  }

  function s(a) {
    for (var b = new i, c = a.length, d = c, e = 0; d > 0; d -= 4, ++e)b.digits[e] = r(a.substr(Math.max(d - 4, 0), Math.min(d, 4)));
    return b
  }

  function t(a, b) {
    var c;
    if (a.isNeg != b.isNeg) b.isNeg = !b.isNeg, c = u(a, b), b.isNeg = !b.isNeg; else {
      c = new i;
      for (var d, e = 0, f = 0; f < a.digits.length; ++f)d = a.digits[f] + b.digits[f] + e, c.digits[f] = d % O, e = Number(d >= O);
      c.isNeg = a.isNeg
    }
    return c
  }

  function u(a, b) {
    var c;
    if (a.isNeg != b.isNeg) b.isNeg = !b.isNeg, c = t(a, b), b.isNeg = !b.isNeg; else {
      c = new i;
      var d, e;
      e = 0;
      for (var f = 0; f < a.digits.length; ++f)d = a.digits[f] - b.digits[f] + e, c.digits[f] = d % O, c.digits[f] < 0 && (c.digits[f] += O), e = 0 - Number(0 > d);
      if (-1 == e) {
        e = 0;
        for (var f = 0; f < a.digits.length; ++f)d = 0 - c.digits[f] + e, c.digits[f] = d % O, c.digits[f] < 0 && (c.digits[f] += O), e = 0 - Number(0 > d);
        c.isNeg = !a.isNeg
      } else c.isNeg = a.isNeg
    }
    return c
  }

  function v(a) {
    for (var b = a.digits.length - 1; b > 0 && 0 == a.digits[b];)--b;
    return b
  }

  function w(a) {
    var b, c = v(a), d = a.digits[c], e = (c + 1) * N;
    for (b = e; b > e - N && 0 == (32768 & d); --b)d <<= 1;
    return b
  }

  function x(a, b) {
    let j;
    for (var c, d, e, f = new i, g = v(a), h = v(b), k = 0; h >= k; ++k) {
      for (c = 0, e = k, j = 0; j <= g; ++j, ++e)d = f.digits[e] + a.digits[j] * b.digits[k] + c, f.digits[e] = d & R, c = d >>> M;
      f.digits[k + g + 1] = c
    }
    return f.isNeg = a.isNeg != b.isNeg, f
  }

  function y(a, b) {
    var c, d, e;
    let result = new i;
    c = v(a), d = 0;
    for (var f = 0; c >= f; ++f)e = result.digits[f] + a.digits[f] * b + d, result.digits[f] = e & R, d = e >>> M;
    return result.digits[1 + c] = d, result
  }

  function z(a, b, c, d, e) {
    for (var f = Math.min(b + e, a.length), g = b, h = d; f > g; ++g, ++h)c[h] = a[g]
  }

  function A(a, b) {
    var c = Math.floor(b / N), d = new i;
    z(a.digits, 0, d.digits, c, d.digits.length - c);
    for (var e = b % N, f = N - e, g = d.digits.length - 1, h = g - 1; g > 0; --g, --h)d.digits[g] = d.digits[g] << e & R | (d.digits[h] & U[e]) >>> f;
    return d.digits[0] = d.digits[g] << e & R, d.isNeg = a.isNeg, d
  }

  function B(a, b) {
    var c = Math.floor(b / N), d = new i;
    z(a.digits, c, d.digits, 0, a.digits.length - c);
    for (var e = b % N, f = N - e, g = 0, h = g + 1; g < d.digits.length - 1; ++g, ++h)d.digits[g] = d.digits[g] >>> e | (d.digits[h] & V[e]) << f;
    return d.digits[d.digits.length - 1] >>>= e, d.isNeg = a.isNeg, d
  }

  function C(a, b) {
    var c = new i;
    return z(a.digits, 0, c.digits, b, c.digits.length - b), c
  }

  function D(a, b) {
    var c = new i;
    return z(a.digits, b, c.digits, 0, c.digits.length - b), c
  }

  function E(a, b) {
    var c = new i;
    return z(a.digits, 0, c.digits, 0, b), c
  }

  function F(a, b) {
    if (a.isNeg != b.isNeg)return 1 - 2 * Number(a.isNeg);
    for (var c = a.digits.length - 1; c >= 0; --c)if (a.digits[c] != b.digits[c])return a.isNeg ? 1 - 2 * Number(a.digits[c] > b.digits[c]) : 1 - 2 * Number(a.digits[c] < b.digits[c]);
    return 0
  }

  function G(a, b) {
    var c, d, e = w(a), f = w(b), g = b.isNeg;
    if (f > e)return a.isNeg ? (c = k(L), c.isNeg = !b.isNeg, a.isNeg = !1, b.isNeg = !1, d = u(b, a), a.isNeg = !0, b.isNeg = g) : (c = new i, d = k(a)), new Array(c, d);
    c = new i, d = a;
    for (var h = Math.ceil(f / N) - 1, j = 0; b.digits[h] < P;)b = A(b, 1), ++j, ++f, h = Math.ceil(f / N) - 1;
    d = A(d, j), e += j;
    for (var l = Math.ceil(e / N) - 1, m = C(b, l - h); -1 != F(d, m);)++c.digits[l - h], d = u(d, m);
    for (var n = l; n > h; --n) {
      var o = n >= d.digits.length ? 0 : d.digits[n], p = n - 1 >= d.digits.length ? 0 : d.digits[n - 1], q = n - 2 >= d.digits.length ? 0 : d.digits[n - 2], r = h >= b.digits.length ? 0 : b.digits[h], s = h - 1 >= b.digits.length ? 0 : b.digits[h - 1];
      o == r ? c.digits[n - h - 1] = R : c.digits[n - h - 1] = Math.floor((o * O + p) / r);
      for (var x = c.digits[n - h - 1] * (r * O + s), z = o * Q + (p * O + q); x > z;)--c.digits[n - h - 1], x = c.digits[n - h - 1] * (r * O | s), z = o * O * O + (p * O + q);
      m = C(b, n - h - 1), d = u(d, y(m, c.digits[n - h - 1])), d.isNeg && (d = t(d, m), --c.digits[n - h - 1])
    }
    return d = B(d, j), c.isNeg = a.isNeg != g, a.isNeg && (c = g ? t(c, L) : u(c, L), b = B(b, j), d = u(b, d)), 0 == d.digits[0] && 0 == v(d) && (d.isNeg = !1), new Array(c, d)
  }

  function H(a, b) {
    return G(a, b)[0]
  }

  var I, J, K, L, M = 16, N = M, O = 65536, P = O >>> 1, Q = O * O, R = O - 1;
  h(20);
  var S = (l(1e15), new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z")), T = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"), U = new Array(0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535), V = new Array(0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535);

  function encryptString(a) {
    var d = "10001", e = a.split("").reverse().join(""), f = "d741760e63aab01eecf8f2237468da2c9a1f3dfb7de74d8bed23de8eb734b0771aa88ab3acfe3d223f24c057a37f8976cd592a5061fba10cfa212ac7448ef4ce9710a3c5ecb176ed10f55612de976edda1a000faf74923efa80645d0654588c1bc314a28879aeda2ed08b0b83c3582ef3de1fe9125aa67130cdfcd3128732461";
    h(130);
    for (var g = new b(d, "", f), i = e.length, j = "", k = 0, l = "", m = 0, n = 128; i - k > 0;)l = i - k > n ? c(g, e.substr(k, n)) : c(g, e.substr(k, i - k)), j = l + j, m++, k = m * n;
    return j
  }

  return encryptString(a);
}

/**
 * URL取值
 */ 
// 获取url入参(单个) 例如:getUrlParam('http://m.leadfund.com.cn/?name=123', 'tagCode') 或者 getUrlParam('tagCode')
export function getUrlParam (name) {
  let search = arguments[1]?arguments[1]:window.location.search.substr(1);
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = search.match(reg);
  if (r != null) return decodeURIComponent(r[2]); return null;
}

// 获取url入参(多个) 例如:getUrlParams(['tagCode','secondLevelType'])
export function getUrlParams (names){
  let search = arguments[1]?arguments[1]:window.location.search.substr(1);
  return names.reduce((pre,cur)=>{
    pre[cur] = getUrlParam(cur,search);
    return  pre;
  },{})
}

// atob、btoa 转换(PS: 解决了中文乱码问题)
export function fbtoa (str) {
  return btoa(encodeURIComponent(str))
}

export function fatob (str) {
  return decodeURIComponent(atob(str))
}

// 数字转大写 ToDX('8007630.27')
export function ToDX (n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
    var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}

// 日期转换星期  dateWeek('2017-07-11')
export function dateWeek (datas) {
    var array = new Array();
    var date = datas;
    array = date.split('-');
    var ndate = new Date(array[0], parseInt(array[1] - 1), array[2]);
    var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var weekDay = weekArray[ndate.getDay()];
    return weekDay
}

// Extend prototype for Date
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
// 往后一天
export function setNewDate (date) {
    var curDate = new Date(date);
    var day = 1;
    var newDate;
    if (curDate.getDay() == 0) {
        day = 1;
    } else if (curDate.getDay() == 6) {
        day = 2;
    } else if (curDate.getDay() == 5) {
        day = 3;
    } else {
        day = 1;
    }
    newDate = new Date(curDate.setDate(curDate.getDate() + day));
    return newDate.Format("yyyy-MM-dd");
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

