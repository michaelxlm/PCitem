function anysignCommentCore(a, b, c) {
    function Q() {
        if (y) {
            var a = document.createElement("canvas"),
                b = a.getContext("2d"),
                d = window.devicePixelRatio ? window.devicePixelRatio : 1;
            a.width = y.width / d, a.height = y.height / d;
            var e = 1;
            c.mass_word_width / c.mass_word_height <= a.width / a.height ? c.mass_word_width <= a.width && (e = c.mass_word_width / a.width) : c.singleHeight <= a.height && (e = c.mass_word_height / a.height), a.width *= e, a.height *= e, w = a.width, x = a.height, b.scale(1 / d * e, 1 / d * e);
            var f = document.createElement("canvas");
            f.width = y.width, f.height = y.height, f.getContext("2d").putImageData(y, 0, 0), b.drawImage(f, 0, 0);
            var g = a.toDataURL();
            return g
        }
        return null
    }

    function S() {
        if (A <= 0) alert("已移除完，请重新进行签名！"), D = 0;
        else {
            var d = document.getElementById("img" + A),
                e = document.getElementById("signImage");
            e.removeChild(d), A--, F--;
            var f = document.getElementById("signTitle");
            f.innerHTML = I[A], 0 == A ? (D = 0, F = 0) : F - 1 < 0 ? (F = b, E > 0 && E--, D = 0) : D = F * c.mass_word_width;
            var g = document.getElementById("comment_title");
            g.innerHTML = a, g.style.color = "black", g.innerHTML = a.substring(0, A) + I[A].replace(I[A], '<font color="#FF0000">$&</font>') + a.substring(A + 1, I.length)
        }
    }

    function T() {
        document.documentElement.style.overflow = "auto", signResCallback && signResCallback(c.cid, null, null, 0), V()
    }

    function U() {
        return A != I.length ? void custom_alert("请完成签名", "确认") : (X(), signResCallback && signResCallback(c.cid, W[0].substring(22, W[0].length), W[0].substring(22, W[0].length), p, q, G, H), void V())
    }

    function V() {
        var a = document.getElementById("comment_dialog");
        a.style.display = "none", g = 9999, h = 9999, i = 0, j = 0, document.body.parentNode.style.overflow = "scroll";
        var d = (document.getElementById("comment_sign"), document.getElementById("comment_title"));
        d.innerHTML = "", d.style.color = "black";
        var e = document.getElementById("signTitle");
        e.innerHTML = "";
        for (var f = 0; f < B.length; f++) K.removeChild(B[f]);
        c = null
    }

    function X() {
        function i(a) {
            a < h ? (f >= c.mass_words_in_single_line && (g += c.mass_word_height, f = 0), d.drawImage(B[a], c.mass_word_width * f, g, c.mass_word_width, c.mass_word_height), f++, i(a + 1)) : W.push(b.toDataURL("image/png", 1))
        }

        var b = document.createElement("canvas"),
            d = b.getContext("2d"),
            e = c.mass_words_in_single_line;
        G = c.mass_word_width * e, H = c.mass_word_height * (a.length / c.mass_words_in_single_line + 1), b.width = G, b.height = H, d.rect(0, 0, b.width, b.height), d.fillStyle = "#fff", d.fill();
        var f = 0,
            g = 0,
            h = I.length;
        i(0)
    }

    var u, v, y, a, G, H, d = window.innerWidth >= 480 ? 15 : 10,
        f = !1,
        g = 9999,
        h = 9999,
        i = 0,
        j = 0,
        k = 0,
        l = 0,
        m = [],
        n = [],
        o = 0,
        p = "",
        q = 0,
        r = 10,
        s = 0,
        t = 0,
        w = 0,
        x = 0,
        A = 0,
        B = new Array,
        C = null,
        D = 0,
        E = 0,
        F = 0,
        I = a.replace(/(.)(?=[^$])/g, "$1,").split(","),
        u = document.getElementById("comment_canvas"),
        J = document.getElementById("comment_title"),
        K = document.getElementById("signImage"),
        L = document.getElementById("comment_ok"),
        M = document.getElementById("comment_back"),
        N = document.getElementById("comment_cancel");
    v = u.getContext("2d");
    var O = document.getElementById("signTitle");
    O.innerHTML = I[A], J.innerHTML = I[0].replace(I[0], '<font color="#FF0000">$&</font>') + a.substring(1, I.length);
    window.devicePixelRatio ? window.devicePixelRatio : 1;
    v.strokeStyle = c.penColor, v.lineWidth = d, v.lineCap = "round", v.lineJoin = "round", v.shadowBlur = 5, L.onclick = function () {
        U()
    }, M.onclick = function () {
        S()
    }, N.onclick = function () {
        T()
    }, document.body.onselectstart = document.body.oncontextmenu = function () {
        return !1
    }, K.ontouchstart = function (a) {
        a.preventDefault()
    }, "ontouchstart" in document.documentElement ? (u.ontouchstart = function (a) {
        null != C && clearInterval(C), f = !0
    }, u.ontouchmove = function (a) {
        if (f) {
            var b = JQuery_Capable.offset(a.target);
            "undefined" != typeof a.targetTouches ? (k = Math.floor(a.targetTouches[0].pageX - b.left), l = Math.floor(a.targetTouches[0].pageY - b.top)) : (k = Math.floor(a.pageX - b.left), l = Math.floor(a.pageY - b.top));
            var c = a.timeStamp;
            0 !== q || isNaN(c) || (o = c), k > 0 && l <= u.height && (p += isNaN(c) ? k + "," + l + "," + d + ",0\n" : k + "," + l + "," + d + "," + (c - o) + "\n", q += 1, k > i && (i = k), k < g && (g = k), l > j && (j = l), l < h && (h = l), m.push({
                x: k,
                y: l
            }), R(), n.push({
                x: k,
                y: l
            }), s = k, t = l), preventDefault(a)
        }
    }, u.ontouchend = function (b) {
        var d = b.timeStamp;
        p += isNaN(d) ? "0,0,-1,0\n" : "0,0,-1," + (d - o) + "\n", q += 1;
        var e = document.getElementById("comment_canvas"),
            k = e.getContext("2d");
        if (k.drawImage(u, 0, 0), f) {
            var l = document.getElementById("signTitle");
            A >= I.length ? (alert("已签署完毕！"), l.innerHTML = "", v.clearRect(0, 0, u.width, u.height)) : n.length > 10 && (C = setInterval(function () {
                A++, A == I.length ? (l.innerHTML = "", J.innerHTML = "已签署完毕！", J.style.color = "Red", clearInterval(C)) : (l.innerHTML = I[A], J.innerHTML = a, J.innerHTML = a.substring(0, A) + I[A].replace(I[A], '<font color="#FF0000">$&</font>') + a.substring(A + 1, I.length));
                var b = document.createElement("img");
                if (b.id = "img" + A, b.width = c.mass_word_width, b.height = c.mass_word_height, checkText(I[A - 1])) b.src = e.toDataURL("image/png");
                else {
                    var n, d = i - g,
                        f = j - h,
                        k = (i + g) / 2,
                        m = (j + h) / 2;
                    n = d < 20 && f < 20 ? c.mass_word_width : d > f ? d / 2 : f / 2, y = u.getContext("2d").getImageData(k - n - r, m - n - r, 2 * (n + r), 2 * (n + r));
                    var o = Q();
                    b.src = o
                }
                B[A - 1] = b, K.appendChild(b), K.scrollTop = K.scrollHeight, v.clearRect(0, 0, u.width, u.height), g = 9999, h = 9999, i = 0, j = 0, o = null, clearInterval(C)
            }, 1e3))
        }
        f = !1, m = []
    }, u.ontouchcancel = u.ontouchend) : (u.onmousedown = function (a) {
        null != C && clearInterval(C), f = !0
    }, u.onmousemove = function (a) {
        if (f) {
            var b = JQuery_Capable.offset(a.target),
                c = document.body.scrollTop | document.documentElement.scrollTop,
                e = document.body.scrollLeft | document.documentElement.scrollLeft;
            "undefined" != typeof a.targetTouches ? (k = Math.floor(a.targetTouches[0].clientX - b.left), l = Math.floor(a.targetTouches[0].clientY - b.top)) : (k = Math.floor(a.clientX - b.left), l = Math.floor(a.clientY - b.top));
            var r = a.timeStamp;
            0 !== q || isNaN(r) || (o = r), k > 0 && (p += isNaN(r) ? k + "," + l + "," + d + ",0\n" : k + "," + l + "," + d + "," + (r - o) + "\n", q += 1, l += c, k += e, k > i && (i = k), k < g && (g = k), l > j && (j = l), l < h && (h = l), m.push({
                x: k,
                y: l
            }), R(), n.push({
                x: k,
                y: l
            }), s = k, t = l), preventDefault(a)
        }
    }, u.onmouseup = function (b) {
        var d = JQuery_Capable.offset(b.target);
        "undefined" != typeof b.targetTouches ? (k = Math.floor(b.targetTouches[0].clientX - d.left), l = Math.floor(b.targetTouches[0].clientY - d.top)) : (k = Math.floor(b.clientX - d.left), l = Math.floor(b.clientY - d.top));
        var e = b.timeStamp;
        p += isNaN(e) ? "0,0,-1,0\n" : "0,0,-1," + (e - o) + "\n", q += 1;
        var s = document.getElementById("comment_canvas"),
            t = s.getContext("2d");
        if (t.drawImage(u, 0, 0), f) {
            var w = document.getElementById("signTitle");
            A >= I.length ? (alert("已签署完毕！"), w.innerHTML = "", v.clearRect(0, 0, u.width, u.height)) : n.length > 10 && (C = setInterval(function () {
                A++, A == I.length ? (w.innerHTML = "", J.innerHTML = "已签署完毕！", J.style.color = "Red", clearInterval(C)) : (w.innerHTML = I[A], J.innerHTML = a, J.innerHTML = a.substring(0, A) + I[A].replace(I[A], '<font color="#FF0000">$&</font>') + a.substring(A + 1, I.length));
                var b = document.createElement("img");
                if (b.id = "img" + A, b.width = c.mass_word_width, b.height = c.mass_word_height, checkText(I[A - 1])) b.src = s.toDataURL("image/png");
                else {
                    var l, d = i - g,
                        e = j - h,
                        f = (i + g) / 2,
                        k = (j + h) / 2;
                    l = d < 20 && e < 20 ? c.mass_word_width : d > e ? d / 2 : e / 2, y = u.getContext("2d").getImageData(f - l - r, k - l - r, 2 * (l + r), 2 * (l + r));
                    var m = Q();
                    b.src = m
                }
                B[A - 1] = b, K.appendChild(b), K.scrollTop = K.scrollHeight, v.clearRect(0, 0, u.width, u.height), g = 9999, h = 9999, i = 0, j = 0, m = null, clearInterval(C)
            }, 1e3))
        }
        f = !1, m = []
    }, u.onmouseout = u.onmouseup);
    var R = function () {
            if (m.length < 3) {
                var a = m[0];
                return v.beginPath(), v.strokeStyle = c.penColor, v.fillStyle = c.penColor, v.arc(a.x, a.y, v.lineWidth / 2, 0, 2 * Math.PI, !0), v.fill(), void v.closePath()
            }
            v.clearRect(0, 0, v.width, v.height), v.beginPath(), v.strokeStyle = c.penColor, v.fillStyle = c.penColor, v.moveTo(m[0].x, m[0].y);
            for (var b = 1; b < m.length - 2; b++) {
                var d = (m[b].x + m[b + 1].x) / 2,
                    e = (m[b].y + m[b + 1].y) / 2;
                v.quadraticCurveTo(m[b].x, m[b].y, d, e)
            }
            v.stroke()
        },
        W = [];
    window.addEventListener("resize", function () {
        null != C && clearInterval(C);
        var b = document.getElementById("signTitle");
        J.innerHTML = a.substring(0, A) + I[A].replace(I[A], '<font color="#FF0000">$&</font>') + a.substring(A + 1, I.length), A >= I.length ? b.innerHTML = "" : b.innerHTML = I[A], v.strokeStyle = c.penColor, v.lineWidth = d, v.lineCap = "round", v.lineJoin = "round", v.shadowBlur = 5
    }), window.addEventListener("orientationchange", function () {
        null != C && clearInterval(C);
        document.getElementById("signTitle");
        J.innerHTML = a.substring(0, A) + I[A].replace(I[A], '<font color="#FF0000">$&</font>') + a.substring(A + 1, I.length), v.strokeStyle = c.penColor, v.lineWidth = d, v.lineCap = "round", v.lineJoin = "round", v.shadowBlur = 5
    })
}

function BigInteger(a, b, c) {
    null != a && ("number" == typeof a ? this.fromNumber(a, b, c) : null == b && "string" != typeof a ? this.fromString(a, 256) : this.fromString(a, b))
}

function nbi() {
    return new BigInteger(null)
}

function am1(a, b, c, d, e, f) {
    for (; --f >= 0;) {
        var g = b * this[a++] + c[d] + e;
        e = Math.floor(g / 67108864), c[d++] = 67108863 & g
    }
    return e
}

function am2(a, b, c, d, e, f) {
    for (var g = 32767 & b, h = b >> 15; --f >= 0;) {
        var i = 32767 & this[a],
            j = this[a++] >> 15,
            k = h * i + j * g;
        i = g * i + ((32767 & k) << 15) + c[d] + (1073741823 & e), e = (i >>> 30) + (k >>> 15) + h * j + (e >>> 30), c[d++] = 1073741823 & i
    }
    return e
}

function am3(a, b, c, d, e, f) {
    for (var g = 16383 & b, h = b >> 14; --f >= 0;) {
        var i = 16383 & this[a],
            j = this[a++] >> 14,
            k = h * i + j * g;
        i = g * i + ((16383 & k) << 14) + c[d] + e, e = (i >> 28) + (k >> 14) + h * j, c[d++] = 268435455 & i
    }
    return e
}

function int2char(a) {
    return BI_RM.charAt(a)
}

function intAt(a, b) {
    var c = BI_RC[a.charCodeAt(b)];
    return null == c ? -1 : c
}

function bnpCopyTo(a) {
    for (var b = this.t - 1; b >= 0; --b) a[b] = this[b];
    a.t = this.t, a.s = this.s
}

function bnpFromInt(a) {
    this.t = 1, this.s = a < 0 ? -1 : 0, a > 0 ? this[0] = a : a < -1 ? this[0] = a + this.DV : this.t = 0
}

function nbv(a) {
    var b = nbi();
    return b.fromInt(a), b
}

function bnpFromString(a, b) {
    var c;
    if (16 == b) c = 4;
    else if (8 == b) c = 3;
    else if (256 == b) c = 8;
    else if (2 == b) c = 1;
    else if (32 == b) c = 5;
    else {
        if (4 != b) return void this.fromRadix(a, b);
        c = 2
    }
    this.t = 0, this.s = 0;
    for (var d = a.length, e = !1, f = 0; --d >= 0;) {
        var g = 8 == c ? 255 & a[d] : intAt(a, d);
        g < 0 ? "-" == a.charAt(d) && (e = !0) : (e = !1, 0 == f ? this[this.t++] = g : f + c > this.DB ? (this[this.t - 1] |= (g & (1 << this.DB - f) - 1) << f, this[this.t++] = g >> this.DB - f) : this[this.t - 1] |= g << f, f += c, f >= this.DB && (f -= this.DB))
    }
    8 == c && 0 != (128 & a[0]) && (this.s = -1, f > 0 && (this[this.t - 1] |= (1 << this.DB - f) - 1 << f)), this.clamp(), e && BigInteger.ZERO.subTo(this, this)
}

function bnpClamp() {
    for (var a = this.s & this.DM; this.t > 0 && this[this.t - 1] == a;) --this.t
}

function bnToString(a) {
    if (this.s < 0) return "-" + this.negate().toString(a);
    var b;
    if (16 == a) b = 4;
    else if (8 == a) b = 3;
    else if (2 == a) b = 1;
    else if (32 == a) b = 5;
    else {
        if (4 != a) return this.toRadix(a);
        b = 2
    }
    var d, c = (1 << b) - 1,
        e = !1,
        f = "",
        g = this.t,
        h = this.DB - g * this.DB % b;
    if (g-- > 0)
        for (h < this.DB && (d = this[g] >> h) > 0 && (e = !0, f = int2char(d)); g >= 0;) h < b ? (d = (this[g] & (1 << h) - 1) << b - h, d |= this[--g] >> (h += this.DB - b)) : (d = this[g] >> (h -= b) & c, h <= 0 && (h += this.DB, --g)), d > 0 && (e = !0), e && (f += int2char(d));
    return e ? f : "0"
}

function bnNegate() {
    var a = nbi();
    return BigInteger.ZERO.subTo(this, a), a
}

function bnAbs() {
    return this.s < 0 ? this.negate() : this
}

function bnCompareTo(a) {
    var b = this.s - a.s;
    if (0 != b) return b;
    var c = this.t;
    if (b = c - a.t, 0 != b) return this.s < 0 ? -b : b;
    for (; --c >= 0;)
        if (0 != (b = this[c] - a[c])) return b;
    return 0
}

function nbits(a) {
    var c, b = 1;
    return 0 != (c = a >>> 16) && (a = c, b += 16), 0 != (c = a >> 8) && (a = c, b += 8), 0 != (c = a >> 4) && (a = c, b += 4), 0 != (c = a >> 2) && (a = c, b += 2), 0 != (c = a >> 1) && (a = c, b += 1), b
}

function bnBitLength() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}

function bnpDLShiftTo(a, b) {
    var c;
    for (c = this.t - 1; c >= 0; --c) b[c + a] = this[c];
    for (c = a - 1; c >= 0; --c) b[c] = 0;
    b.t = this.t + a, b.s = this.s
}

function bnpDRShiftTo(a, b) {
    for (var c = a; c < this.t; ++c) b[c - a] = this[c];
    b.t = Math.max(this.t - a, 0), b.s = this.s
}

function bnpLShiftTo(a, b) {
    var h, c = a % this.DB,
        d = this.DB - c,
        e = (1 << d) - 1,
        f = Math.floor(a / this.DB),
        g = this.s << c & this.DM;
    for (h = this.t - 1; h >= 0; --h) b[h + f + 1] = this[h] >> d | g, g = (this[h] & e) << c;
    for (h = f - 1; h >= 0; --h) b[h] = 0;
    b[f] = g, b.t = this.t + f + 1, b.s = this.s, b.clamp()
}

function bnpRShiftTo(a, b) {
    b.s = this.s;
    var c = Math.floor(a / this.DB);
    if (c >= this.t) return void(b.t = 0);
    var d = a % this.DB,
        e = this.DB - d,
        f = (1 << d) - 1;
    b[0] = this[c] >> d;
    for (var g = c + 1; g < this.t; ++g) b[g - c - 1] |= (this[g] & f) << e, b[g - c] = this[g] >> d;
    d > 0 && (b[this.t - c - 1] |= (this.s & f) << e), b.t = this.t - c, b.clamp()
}

function bnpSubTo(a, b) {
    for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] - a[c], b[c++] = d & this.DM, d >>= this.DB;
    if (a.t < this.t) {
        for (d -= a.s; c < this.t;) d += this[c], b[c++] = d & this.DM, d >>= this.DB;
        d += this.s
    } else {
        for (d += this.s; c < a.t;) d -= a[c], b[c++] = d & this.DM, d >>= this.DB;
        d -= a.s
    }
    b.s = d < 0 ? -1 : 0, d < -1 ? b[c++] = this.DV + d : d > 0 && (b[c++] = d), b.t = c, b.clamp()
}

function bnpMultiplyTo(a, b) {
    var c = this.abs(),
        d = a.abs(),
        e = c.t;
    for (b.t = e + d.t; --e >= 0;) b[e] = 0;
    for (e = 0; e < d.t; ++e) b[e + c.t] = c.am(0, d[e], b, e, 0, c.t);
    b.s = 0, b.clamp(), this.s != a.s && BigInteger.ZERO.subTo(b, b)
}

function bnpSquareTo(a) {
    for (var b = this.abs(), c = a.t = 2 * b.t; --c >= 0;) a[c] = 0;
    for (c = 0; c < b.t - 1; ++c) {
        var d = b.am(c, b[c], a, 2 * c, 0, 1);
        (a[c + b.t] += b.am(c + 1, 2 * b[c], a, 2 * c + 1, d, b.t - c - 1)) >= b.DV && (a[c + b.t] -= b.DV, a[c + b.t + 1] = 1)
    }
    a.t > 0 && (a[a.t - 1] += b.am(c, b[c], a, 2 * c, 0, 1)), a.s = 0, a.clamp()
}

function bnpDivRemTo(a, b, c) {
    var d = a.abs();
    if (!(d.t <= 0)) {
        var e = this.abs();
        if (e.t < d.t) return null != b && b.fromInt(0), void(null != c && this.copyTo(c));
        null == c && (c = nbi());
        var f = nbi(),
            g = this.s,
            h = a.s,
            i = this.DB - nbits(d[d.t - 1]);
        i > 0 ? (d.lShiftTo(i, f), e.lShiftTo(i, c)) : (d.copyTo(f), e.copyTo(c));
        var j = f.t,
            k = f[j - 1];
        if (0 != k) {
            var l = k * (1 << this.F1) + (j > 1 ? f[j - 2] >> this.F2 : 0),
                m = this.FV / l,
                n = (1 << this.F1) / l,
                o = 1 << this.F2,
                p = c.t,
                q = p - j,
                r = null == b ? nbi() : b;
            for (f.dlShiftTo(q, r), c.compareTo(r) >= 0 && (c[c.t++] = 1, c.subTo(r, c)), BigInteger.ONE.dlShiftTo(j, r), r.subTo(f, f); f.t < j;) f[f.t++] = 0;
            for (; --q >= 0;) {
                var s = c[--p] == k ? this.DM : Math.floor(c[p] * m + (c[p - 1] + o) * n);
                if ((c[p] += f.am(0, s, c, q, 0, j)) < s)
                    for (f.dlShiftTo(q, r), c.subTo(r, c); c[p] < --s;) c.subTo(r, c)
            }
            null != b && (c.drShiftTo(j, b), g != h && BigInteger.ZERO.subTo(b, b)), c.t = j, c.clamp(), i > 0 && c.rShiftTo(i, c), g < 0 && BigInteger.ZERO.subTo(c, c)
        }
    }
}

function bnMod(a) {
    var b = nbi();
    return this.abs().divRemTo(a, null, b), this.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && a.subTo(b, b), b
}

function Classic(a) {
    this.m = a
}

function cConvert(a) {
    return a.s < 0 || a.compareTo(this.m) >= 0 ? a.mod(this.m) : a
}

function cRevert(a) {
    return a
}

function cReduce(a) {
    a.divRemTo(this.m, null, a)
}

function cMulTo(a, b, c) {
    a.multiplyTo(b, c), this.reduce(c)
}

function cSqrTo(a, b) {
    a.squareTo(b), this.reduce(b)
}

function bnpInvDigit() {
    if (this.t < 1) return 0;
    var a = this[0];
    if (0 == (1 & a)) return 0;
    var b = 3 & a;
    return b = b * (2 - (15 & a) * b) & 15, b = b * (2 - (255 & a) * b) & 255, b = b * (2 - ((65535 & a) * b & 65535)) & 65535, b = b * (2 - a * b % this.DV) % this.DV, b > 0 ? this.DV - b : -b
}

function Montgomery(a) {
    this.m = a, this.mp = a.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << a.DB - 15) - 1, this.mt2 = 2 * a.t
}

function montConvert(a) {
    var b = nbi();
    return a.abs().dlShiftTo(this.m.t, b), b.divRemTo(this.m, null, b), a.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(b, b), b
}

function montRevert(a) {
    var b = nbi();
    return a.copyTo(b), this.reduce(b), b
}

function montReduce(a) {
    for (; a.t <= this.mt2;) a[a.t++] = 0;
    for (var b = 0; b < this.m.t; ++b) {
        var c = 32767 & a[b],
            d = c * this.mpl + ((c * this.mph + (a[b] >> 15) * this.mpl & this.um) << 15) & a.DM;
        for (c = b + this.m.t, a[c] += this.m.am(0, d, a, b, 0, this.m.t); a[c] >= a.DV;) a[c] -= a.DV, a[++c]++
    }
    a.clamp(), a.drShiftTo(this.m.t, a), a.compareTo(this.m) >= 0 && a.subTo(this.m, a)
}

function montSqrTo(a, b) {
    a.squareTo(b), this.reduce(b)
}

function montMulTo(a, b, c) {
    a.multiplyTo(b, c), this.reduce(c)
}

function bnpIsEven() {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}

function bnpExp(a, b) {
    if (a > 4294967295 || a < 1) return BigInteger.ONE;
    var c = nbi(),
        d = nbi(),
        e = b.convert(this),
        f = nbits(a) - 1;
    for (e.copyTo(c); --f >= 0;)
        if (b.sqrTo(c, d), (a & 1 << f) > 0) b.mulTo(d, e, c);
        else {
            var g = c;
            c = d, d = g
        }
    return b.revert(c)
}

function bnModPowInt(a, b) {
    var c;
    return c = a < 256 || b.isEven() ? new Classic(b) : new Montgomery(b), this.exp(a, c)
}

function Arcfour() {
    this.i = 0, this.j = 0, this.S = new Array
}

function ARC4init(a) {
    var b, c, d;
    for (b = 0; b < 256; ++b) this.S[b] = b;
    for (c = 0, b = 0; b < 256; ++b) c = c + this.S[b] + a[b % a.length] & 255, d = this.S[b], this.S[b] = this.S[c], this.S[c] = d;
    this.i = 0, this.j = 0
}

function ARC4next() {
    var a;
    return this.i = this.i + 1 & 255, this.j = this.j + this.S[this.i] & 255, a = this.S[this.i], this.S[this.i] = this.S[this.j], this.S[this.j] = a, this.S[a + this.S[this.i] & 255]
}

function prng_newstate() {
    return new Arcfour
}

function rng_seed_int(a) {
    rng_pool[rng_pptr++] ^= 255 & a, rng_pool[rng_pptr++] ^= a >> 8 & 255, rng_pool[rng_pptr++] ^= a >> 16 & 255, rng_pool[rng_pptr++] ^= a >> 24 & 255, rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
}

function rng_seed_time() {
    rng_seed_int((new Date).getTime())
}

function rng_get_byte() {
    if (null == rng_state) {
        for (rng_seed_time(), rng_state = prng_newstate(), rng_state.init(rng_pool), rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
        rng_pptr = 0
    }
    return rng_state.next()
}

function rng_get_bytes(a) {
    var b;
    for (b = 0; b < a.length; ++b) a[b] = rng_get_byte()
}

function SecureRandom() {
}

function parseBigInt(a, b) {
    return new BigInteger(a, b)
}

function linebrk(a, b) {
    for (var c = "", d = 0; d + b < a.length;) c += a.substring(d, d + b) + "\n", d += b;
    return c + a.substring(d, a.length)
}

function byte2Hex(a) {
    return a < 16 ? "0" + a.toString(16) : a.toString(16)
}

function pkcs1pad2(a, b) {
    if (b < a.length + 11) return alert("Message too long for RSA"), null;
    for (var c = new Array, d = a.length - 1; d >= 0 && b > 0;) {
        var e = a.charCodeAt(d--);
        e < 128 ? c[--b] = e : e > 127 && e < 2048 ? (c[--b] = 63 & e | 128, c[--b] = e >> 6 | 192) : (c[--b] = 63 & e | 128, c[--b] = e >> 6 & 63 | 128, c[--b] = e >> 12 | 224)
    }
    c[--b] = 0;
    for (var f = new SecureRandom, g = new Array; b > 2;) {
        for (g[0] = 0; 0 == g[0];) f.nextBytes(g);
        c[--b] = g[0]
    }
    return c[--b] = 2, c[--b] = 0, new BigInteger(c)
}

function pkcs1pad2Uint8(a, b) {
    if (b < a.length + 11) return alert("Message too long for RSA"), null;
    for (var c = new Array, d = a.length - 1; d >= 0 && b > 0;) {
        var e = a[d--];
        c[--b] = e
    }
    c[--b] = 0;
    for (var f = new SecureRandom, g = new Array; b > 2;) {
        for (g[0] = 0; 0 == g[0];) f.nextBytes(g);
        c[--b] = g[0]
    }
    return c[--b] = 2, c[--b] = 0, new BigInteger(c)
}

function RSAKey() {
    this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null
}

function RSASetPublic(a, b) {
    null != a && null != b && a.length > 0 && b.length > 0 ? (this.n = parseBigInt(a, 16), this.e = parseInt(b, 16)) : alert("Invalid RSA public key")
}

function RSADoPublic(a) {
    return a.modPowInt(this.e, this.n)
}

function RSAEncrypt(a) {
    var b = pkcs1pad2(a, this.n.bitLength() + 7 >> 3);
    if (null == b) return null;
    var c = this.doPublic(b);
    if (null == c) return null;
    var d = c.toString(16);
    return 0 == (1 & d.length) ? d : "0" + d
}

function RSAUint8ArrayEncrypt(a) {
    var b = pkcs1pad2Uint8(a, this.n.bitLength() + 7 >> 3);
    if (null == b) return null;
    var c = this.doPublic(b);
    if (null == c) return null;
    var d = c.toString(16);
    return 0 == (1 & d.length) ? d : "0" + d
}

function aesEncrypt(a, b) {
    var c = CryptoJS.enc.Hex.parse(b),
        d = CryptoJS.AES.encrypt(a, c);
    return d
}

function tripleDesEncrypt(a, b) {
    var c = CryptoJS.enc.Hex.parse(b),
        d = CryptoJS.TripleDES.encrypt(a, c, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    return d
}

function tripleDesDecrypt(a, b) {
    var c = CryptoJS.enc.Hex.parse(b),
        d = CryptoJS.TripleDES.decrypt(a, c, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    return d
}

function sha1DigestBase64(a) {
    return Base64.encodeUint8Array(anysign.hex.hexStrToUint8Array(CryptoJS.SHA1(a) + ""))
}

function sha1Digest(a) {
    return CryptoJS.SHA1(a)
}

function md5Digest(a) {
    return CryptoJS.MD5(a)
}

function rsaPubkeyEnc(a, b, c) {
    var d = new RSAKey;
    d.setPublic(a, b);
    var e = d.encrypt(c),
        f = anysign.hex.hexStrToUint8Array(e);
    return Base64.encodeUint8Array(f)
}

function rsaPubkeyUint8Enc(a, b, c) {
    var d = new RSAKey;
    d.setPublic(a, b);
    var e = d.encryptUint8(c),
        f = anysign.hex.hexStrToUint8Array(e);
    return Base64.encodeUint8Array(f)
}

function rsaPubkeyEncByDefault(a) {
    return rsaPubkeyEnc(pubN, pubE, a)
}

function rsaPubkeyUint8EncByDefault(a) {
    return rsaPubkeyUint8Enc(pubN, pubE, a)
}
var dbits, canary = 0xdeadbeefcafe,
    j_lm = 15715070 == (16777215 & canary);
j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = am2, dbits = 30) : j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = am1, dbits = 26) : (BigInteger.prototype.am = am3, dbits = 28), BigInteger.prototype.DB = dbits, BigInteger.prototype.DM = (1 << dbits) - 1, BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP), BigInteger.prototype.F1 = BI_FP - dbits, BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz",
    BI_RC = new Array,
    rr, vv;
for (rr = "0".charCodeAt(0), vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
for (rr = "a".charCodeAt(0), vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
for (rr = "A".charCodeAt(0), vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
Classic.prototype.convert = cConvert, Classic.prototype.revert = cRevert, Classic.prototype.reduce = cReduce, Classic.prototype.mulTo = cMulTo, Classic.prototype.sqrTo = cSqrTo, Montgomery.prototype.convert = montConvert, Montgomery.prototype.revert = montRevert, Montgomery.prototype.reduce = montReduce, Montgomery.prototype.mulTo = montMulTo, Montgomery.prototype.sqrTo = montSqrTo, BigInteger.prototype.copyTo = bnpCopyTo, BigInteger.prototype.fromInt = bnpFromInt, BigInteger.prototype.fromString = bnpFromString, BigInteger.prototype.clamp = bnpClamp, BigInteger.prototype.dlShiftTo = bnpDLShiftTo, BigInteger.prototype.drShiftTo = bnpDRShiftTo, BigInteger.prototype.lShiftTo = bnpLShiftTo, BigInteger.prototype.rShiftTo = bnpRShiftTo, BigInteger.prototype.subTo = bnpSubTo, BigInteger.prototype.multiplyTo = bnpMultiplyTo, BigInteger.prototype.squareTo = bnpSquareTo, BigInteger.prototype.divRemTo = bnpDivRemTo, BigInteger.prototype.invDigit = bnpInvDigit, BigInteger.prototype.isEven = bnpIsEven, BigInteger.prototype.exp = bnpExp, BigInteger.prototype.toString = bnToString, BigInteger.prototype.negate = bnNegate, BigInteger.prototype.abs = bnAbs, BigInteger.prototype.compareTo = bnCompareTo, BigInteger.prototype.bitLength = bnBitLength, BigInteger.prototype.mod = bnMod, BigInteger.prototype.modPowInt = bnModPowInt, BigInteger.ZERO = nbv(0), BigInteger.ONE = nbv(1), Arcfour.prototype.init = ARC4init, Arcfour.prototype.next = ARC4next;
var rng_psize = 256,
    rng_state, rng_pool, rng_pptr;
if (null == rng_pool) {
    rng_pool = new Array, rng_pptr = 0;
    var t;
    if (window.crypto && window.crypto.getRandomValues) {
        var ua = new Uint8Array(32);
        for (window.crypto.getRandomValues(ua), t = 0; t < 32; ++t) rng_pool[rng_pptr++] = ua[t]
    }
    if ("Netscape" == navigator.appName && navigator.appVersion < "5" && window.crypto) {
        var z = window.crypto.random(32);
        for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = 255 & z.charCodeAt(t)
    }
    for (; rng_pptr < rng_psize;) t = Math.floor(65536 * Math.random()), rng_pool[rng_pptr++] = t >>> 8, rng_pool[rng_pptr++] = 255 & t;
    rng_pptr = 0, rng_seed_time()
}
SecureRandom.prototype.nextBytes = rng_get_bytes, RSAKey.prototype.doPublic = RSADoPublic, RSAKey.prototype.setPublic = RSASetPublic, RSAKey.prototype.encrypt = RSAEncrypt, RSAKey.prototype.encryptUint8 = RSAUint8ArrayEncrypt;
var pubN = "85f93d089244ce7b444784fb6e4a3b78e68ffb92f4e5d249cf10a8253698f3e3ce04b916268b3f9a592b6437a073b2a33f41f224809eacfcc44bfd40fbc91a62703d014f6614a27b066ac836abca83c1cbf443df3eac52aa602f279c64a780c079841df922ddbccb1b296d2b09ec30d8d123a7b4f7de44bea190b1db9b9a9511", pubE = "10001",
    encCertSN = "‎096099000000afffaa";
var anysign = anysign && {
        logger: {
            openLog: !1,
            e: function (a) {
                anysign.logger.openLog && console.log("anysign error:" + a)
            },
            w: function (a) {
                anysign.logger.openLog && console.log("anysign warning:" + a)
            }
        }
    };
var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encodeUint8Array: function (a) {
            for (var f, b = 32768, c = 0, d = a.length, e = "", g = ""; c < d;) {
                f = a.subarray(c, Math.min(c + b, d));
                for (var h = 0, i = f.length; h < i; h++) g += String.fromCharCode(f[h]);
                e += g, c += b, g = ""
            }
            return btoa(e)
        },
        decodeUint8ArrayB64: function (a) {
            return new Uint8Array(atob(a).split("").map(function (a) {
                return a.charCodeAt(0)
            }))
        },
        encode: function (a) {
            var c, d, e, f, g, h, i, b = "",
                j = 0;
            for (a = Base64._utf8_encode(a); j < a.length;) c = a.charCodeAt(j++), d = a.charCodeAt(j++), e = a.charCodeAt(j++), f = c >> 2, g = (3 & c) << 4 | d >> 4, h = (15 & d) << 2 | e >> 6, i = 63 & e, isNaN(d) ? h = i = 64 : isNaN(e) && (i = 64), b = b + this._keyStr.charAt(f) + this._keyStr.charAt(g) + this._keyStr.charAt(h) + this._keyStr.charAt(i);
            return b
        },
        decode: function (a) {
            var c, d, e, f, g, h, i, b = "",
                j = 0;
            for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); j < a.length;) f = this._keyStr.indexOf(a.charAt(j++)), g = this._keyStr.indexOf(a.charAt(j++)), h = this._keyStr.indexOf(a.charAt(j++)), i = this._keyStr.indexOf(a.charAt(j++)), c = f << 2 | g >> 4, d = (15 & g) << 4 | h >> 2, e = (3 & h) << 6 | i, b += String.fromCharCode(c), 64 != h && (b += String.fromCharCode(d)), 64 != i && (b += String.fromCharCode(e));
            return b = Base64._utf8_decode(b)
        },
        _utf8_encode: function (a) {
            a = a.replace(/\r\n/g, "\n");
            for (var b = "", c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                d < 128 ? b += String.fromCharCode(d) : d > 127 && d < 2048 ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128))
            }
            return b
        },
        _utf8_decode: function (a) {
            for (var b = "", c = 0, d = 0, f = 0, g = 0; c < a.length;) d = a.charCodeAt(c), d < 128 ? (b += String.fromCharCode(d), c++) : d > 191 && d < 224 ? (f = a.charCodeAt(c + 1), b += String.fromCharCode((31 & d) << 6 | 63 & f), c += 2) : (f = a.charCodeAt(c + 1), g = a.charCodeAt(c + 2), b += String.fromCharCode((15 & d) << 12 | (63 & f) << 6 | 63 & g), c += 3);
            return b
        }
    },
    anysign = anysign || {
            binary: {
                uint32ArrayToUint8Array: function (a) {
                    if (!a) return null;
                    for (var c, b = new Uint8Array(4 * a.length), d = 0, e = a.length; d < e; d++) c = d << 2, b[c] = a[d] >> 24 & 255, b[c + 1] = a[d] >> 16 & 255, b[c + 2] = a[d] >> 8 & 255, b[c + 3] = 255 & a[d];
                    return b
                }
            },
            hex: {
                hexEncodeArray: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
                uint8ArrayToHexStr: function (a) {
                    if (!a) return null;
                    for (var b = "", c = 0; c < a.length; c++) {
                        var d = a[c];
                        b += this.hexEncodeArray[d >>> 4], b += this.hexEncodeArray[15 & d]
                    }
                    return b
                },
                hexStrToUint8Array: function (a) {
                    if (!a || a.length % 2 != 0) return null;
                    for (var b = [], c = 0; c < a.length; c += 2) b.push(parseInt("0x" + a.substr(c, 2), 16));
                    return new Uint8Array(b)
                },
                hexStrToUint8Str: function (a) {
                    if (!a || a.length % 2 != 0) return null;
                    for (var b = "", c = 0; c < a.length; c += 2) b += String.fromCharCode(parseInt("0x" + a.substr(c, 2), 16));
                    return decodeURIComponent(escape(b))
                }
            },
            charset: {
                strToUtf8ArrayUint8: function (a) {
                    for (var b = unescape(encodeURIComponent(a)), c = new Uint8Array(b.length), d = 0; d < b.length; d++) c[d] = b.charCodeAt(d);
                    return c
                },
                utf8ArrayUint8ToStr: function (a) {
                    for (var b = "", c = 0; c < a.length; c++) b += String.fromCharCode(a[c]);
                    return decodeURIComponent(escape(b))
                },
                toUtf8str: function (a) {
                    return unescape(encodeURIComponent(a))
                },
                uint8ArrayAscIIToStr: function (a) {
                    return String.fromCharCode.apply(null, a)
                },
                strToUint8ArrayAscII: function (a) {
                    for (var b = new Uint8Array(a.length), c = 0, d = a.length; c < d; ++c) b[c] = a.charCodeAt(c);
                    return b
                }
            },
            zip: {
                compressToB64: function (a) {
                    var b = new Zlib.Deflate(a),
                        c = b.compress();
                    if (c instanceof Array) {
                        for (var d = new Uint8Array(c.length), e = 0, f = d.length; e < f; ++e) d[e] = c[e];
                        c = d
                    }
                    return Base64.encodeUint8Array(c)
                }
            },
            json: {
                stringify: function (a) {
                    return JSON.stringify(a)
                },
                stringToObj: function (a) {
                    return JSON.parse(a)
                }
            },
            digest: {
                crc32: function (a) {
                    var b = [];
                    if (window.crcTable) b = window.crcTable;
                    else {
                        for (var c, d = 0; d < 256; d++) {
                            c = d;
                            for (var e = 0; e < 8; e++) c = 1 & c ? 3988292384 ^ c >>> 1 : c >>> 1;
                            b[d] = c
                        }
                        window.crcTable = b
                    }
                    for (var f = -1, g = 0; g < a.length; g++) f = f >>> 8 ^ b[255 & (f ^ a.charCodeAt(g))];
                    return (f ^ -1) >>> 0
                }
            }
        };
!function (a) {
    function b() {
        for (var c, b = !0, d = k, e = j.length; d < e && b;)
            if (c = j[d], void 0 !== c && null !== c) {
                if ("string" == typeof c) {
                    var f = h.cloneNode(!1);
                    f.text = c, i.parentNode.insertBefore(f, i)
                } else c.apply(a);
                c = d, j[c] = null, k = c + 1, d += 1
            } else b = !1
    }

    function c() {
        if (j.length) {
            var d, b = j.pop();
            "string" == typeof b ? (d = h.cloneNode(!0), d.type = "text/javascript", d.async = !0, d.src = b, d.onload = d.onreadystatechange = function () {
                d.readyState && !/loaded|complete/.test(d.readyState) || (d.onload = d.onreadystatechange = null, d = void 0, c())
            }, i.parentNode.insertBefore(d, i)) : (b.apply(a), c())
        }
    }

    function d(a, c) {
        return function () {
            j[c] = a.responseText, b(), a = void 0
        }
    }

    function e() {
        var c, e, a = arguments.length;
        for (c = 0; c < a; c += 1) "string" == typeof arguments[c] ? (e = l(arguments[c]), e.onload = d(e, j.length), j[j.length] = null, e.send()) : (j[j.length] = arguments[c], b())
    }

    function f() {
        j.push(Array.prototype.slice.call(arguments, 0).reverse()), c()
    }

    var l, m, n, g = a.document,
        h = g.createElement("script"),
        i = g.getElementsByTagName("script")[0],
        j = [],
        k = 0;
    a.XMLHttpRequest && (m = new a.XMLHttpRequest, "withCredentials" in m ? n = function (b) {
        return m = new a.XMLHttpRequest, m.open("get", b, !0), m
    } : a.XDomainRequest && (n = function (b) {
        return m = new a.XDomainRequest, m.open("get", b), m
    })), l = n, a.JcorsLoader = {
        load: l ? e : f
    }
}(window);

function ismobile(a) {
    var b = navigator.userAgent;
    navigator.appVersion;
    if (!/AppleWebKit.*Mobile/i.test(navigator.userAgent) && !/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent)) return b.indexOf("iPad") > -1 ? "0" : "1";
    if (window.location.href.indexOf("?mobile") < 0) try {
        return /iPhone|mac|iPod|iPad/i.test(navigator.userAgent) ? "0" : "1"
    } catch (a) {
    }
}

function getWindowWidth() {
    var a = 630,
        b = 460;
    return document.body && document.body.offsetWidth && (a = document.body.offsetWidth, b = document.body.offsetHeight), "CSS1Compat" == document.compatMode && document.documentElement && document.documentElement.offsetWidth && (a = document.documentElement.offsetWidth, b = document.documentElement.offsetHeight), window.innerWidth && window.innerHeight && (a = window.innerWidth, b = window.innerHeight), .99 * a
}

function getWindowHeight() {
    var a = 630,
        b = 460;
    return document.body && document.body.offsetWidth && (a = document.body.offsetWidth, b = document.body.offsetHeight), "CSS1Compat" == document.compatMode && document.documentElement && document.documentElement.offsetWidth && (a = document.documentElement.offsetWidth, b = document.documentElement.offsetHeight), window.innerWidth && window.innerHeight && (a = window.innerWidth, b = window.innerHeight), .99 * b
}

function isSignOrCom(a) {
    return a >= 20 && a <= 29 || (a >= 200 && a <= 299 || !(a >= 30 && a <= 39) && (!(a >= 300 && a <= 399) && null))
}

function checkText(a) {
    var b = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    return !!b.test(a)
}
var AnySignRoot = function () {
        this.Version = "4.7", this.EncCertSN = null, this.EncKey = null, this.TermSrc = "PAD", this.Digest = null, this.EncData = null
    },
    Digest = function () {
        this.Alg = null, this.Value = null
    },
    FormInfo = function () {
        this.WONo = null, this.WOHash = null, this.IsSync = !1, this.IsUnit = !1, this.EncAlg = "RSA", this.FlowID = null, this.Channel = null, this.USignArray = [], this.DataArray = [], this.CachetArray = [], this.ExtInfo = null
    },
    SaveFormInfo = function () {
        this.WONo = null, this.WOHash = null, this.Channel = null, this.EncAlg = "RSA", this.USignObjs = [], this.USignConfigs = [], this.DataObjs = [], this.DataConfigs = [], this.CachetArray = []
    },
    ExtInfo = function () {
    },
    PlainData = function () {
        this.P10Data = null, this.CertOID = null
    },
    P10Data = function () {
        this.RawHash = null, this.Hash = null, this.Value = null, this.ValueType = null, this.P10SignValue = null, this.Hashalg = null, this.Dn = null, this.IDType = null, this.IDNumber = null, this.Templname = "3", this.Channel = "10000"
    },
    CertOID = function () {
        this.Version = "3.2", this.IDType = null, this.IDNumber = null, this.RawHash = null, this.BioFeature = null, this.ClientOS = null
    },
    BioFeature = function () {
        this.PhotoArray = [], this.SoundArray = [], this.Script = null
    },
    Script = function () {
        this.Format = "zip", this.Width = "180", this.Color = null, this.Count = null, this.Data = null, this.Device = null, this.RefHeight = 99999, this.RefWidth = 99999, this.Geoloca = null
    },
    Device = function () {
        this.DeviceName = "ANDROID_PAD_" + navigator.appName, this.SampleRate = "1024", this.PressMax = "1024", this.Width = 99999, this.Height = 99999, this.DriverVer = "v1.0", this.DeviceID = navigator.appVersion, this.CertInfo = null
    },
    ClientOS = function () {
        this.Name = "WeiXin_" + navigator.platform, this.Edition = navigator.appCodeName, this.ServicePack = "None", this.Version = navigator.appVersion, this.OSArch = "32/64", this.DeviceID = navigator.appVersion
    },
    ImageSize = function (a, b) {
        this.Width = a, this.Height = b, this.Unit = "dp"
    },
    SignatureObj = function () {
        this.Cid = 0, this.SignRule = null, this.Signer = null, this.Image = null, this.ImageSize = null, this.IsTSS = !1, this.Points = null, this.KeyPair = null, this.ImageFMT = DataFormat.IMAGE_PNG, this.TimeTag = null
    },
    PhotoEvidence = function () {
        this.Format = null, this.Hash = null, this.BioType = null
    },
    SoundEvidence = function () {
        this.Format = null, this.Hash = null, this.BioType = null
    },
    DataObj = function () {
        this.Cid = 0, this.OwnerCid = 0, this.PointHash = null, this.Data = null, this.Name = null, this.Format = null, this.PDFCrdRule = null
    },
    PDFCrdRule = function () {
        this.DocCrdTid = null, this.DocFormat = null, this.DocStyleTid = null
    };

function anysignWebImpl() {
    function u() {
        b = !1, c = null, i = null, d = !1, e = !1, j = [], k = [], n = [], p = []
    }

    function v(a) {
        for (var b in o) {
            var c = o[b];
            if (c && c.cid == a) return c
        }
        return null
    }

    function w(a, b, c, d, e, f) {
        a.Points || (a.Points = new PlainData), a.Points.P10Data || (a.Points.P10Data = new P10Data), a.Points.CertOID || (a.Points.CertOID = new CertOID), a.Points.CertOID.BioFeature || (a.Points.CertOID.BioFeature = new BioFeature), a.Points.CertOID.BioFeature.Script = new Script, a.Points.CertOID.ClientOS = new ClientOS;
        var g = a.Points.CertOID.BioFeature.Script;
        g.Color = parseInt("0x" + b.substr(1)) + "", g.Data = anysign.zip.compressToB64(anysign.charset.strToUint8ArrayAscII(c)), g.Count = d + "", g.Device = new Device, g.RefWidth = e, g.RefHeight = f
    }

    function x(b) {
        return a.FORMDATA_XML <= b && b <= a.FORMDATA_PRESERVED
    }

    function y(a) {
        return a >= 20 && a <= 29 || a >= 200 && a <= 299
    }

    function z(a) {
        return a >= 30 && a <= 39 || a >= 300 && a <= 399
    }

    function A(a) {
        return !!(a >= 50 && a <= 59 || a >= 500 && a <= 599 || x(a))
    }

    var c, f, g, h, i, a = {
            FORMDATA_XML: 10,
            FORMDATA_HTML: 11,
            FORMDATA_PDF: 12,
            FORMDATA_JSON: 13,
            FORMDATA_PRESERVED: 19
        },
        b = !1,
        d = !1,
        e = !1,
        j = [],
        k = [],
        n = [],
        o = [],
        p = [];
    this._initAnySignApi = function (a, b) {
        return !(!a || !b) && (u(), c = a, i = b, !0)
    }, this._addDataObj = function (a, b) {
        if (!d && A(a)) {
            b.cid = a, o[a] = b;
            var c = new DataObj;
            return c.Format = b.format, c.Name = b.name, c.Cid = a, n[a] = c, !0
        }
        return !1
    }, this._addSignatureObj = function (a, b) {
        if (!d && b && y(a)) {
            b.cid = a, k[a] = b;
            var c = new SignatureObj;
            return c.Cid = a, c.Signer = b.signer, c.SignRule = b.signRule, c.IsTSS = b.isTSS, c.TimeTag = b.timeTag, j[a] = c, !0
        }
        return !1
    }, this._addCommentObj = function (a, b) {
        if (!d && b && z(a)) {
            b.cid = a, k[a] = b;
            var c = new SignatureObj;
            return c.Cid = a, c.Signer = b.signer, c.SignRule = b.signRule, c.IsTSS = b.isTSS, c.TimeTag = b.timeTag, j[a] = c, !0
        }
        return !1
    }, this._addEvidence = function (a, b, c, d, e) {
        var f = j[a];
        if (f.Points || (f.Points = new PlainData), f.Points.P10Data || (f.Points.P10Data = new P10Data), f.Points.CertOID || (f.Points.CertOID = new CertOID), f.Points.CertOID.BioFeature || (f.Points.CertOID.BioFeature = new BioFeature), f.Points.CertOID.BioFeature.Script) return !1;
        if (d == BioType.PHOTO_SIGNER_IDENTITY_CARD_BACK || d == BioType.PHOTO_SIGNER_IDENTITY_CARD_FRONT) {
            var g = new PhotoEvidence;
            g.Format = c;
            var h = sha1Digest(b);
            return g.Hash = "BS64:" + h.toString().toUpperCase(), g.BioType = d, f.Points.CertOID.BioFeature.PhotoArray[e] = g, !0
        }
        if (d == BioType.SOUND_SIGNER_RETELL || d == BioType.SOUND_SIGNER_OTHER) {
            var i = new SoundEvidence;
            i.Format = c;
            var k = sha1Digest(b);
            return i.Hash = "BS64:" + k.toString().toUpperCase(), i.BioType = d, f.Points.CertOID.BioFeature.SoundArray[e] = i, !0
        }
        return !1
    }, this._addEvidenceV2 = function (a, b, c, d) {
        var e = j[a];
        if (e.Points || (e.Points = new PlainData), e.Points.P10Data || (e.Points.P10Data = new P10Data), e.Points.CertOID || (e.Points.CertOID = new CertOID), e.Points.CertOID.BioFeature || (e.Points.CertOID.BioFeature = new BioFeature), e.Points.CertOID.BioFeature.Script) return !1;
        if (c == BioType.PHOTO_SIGNER_IDENTITY_CARD_BACK || c == BioType.PHOTO_SIGNER_IDENTITY_CARD_FRONT) {
            var f = new PhotoEvidence;
            f.Format = DataFormat.IMAGE_JPEG;
            var g = sha1Digest(b);
            return f.Hash = "BS64:" + g.toString().toUpperCase(), f.BioType = c, e.Points.CertOID.BioFeature.PhotoArray[d] = f, !0
        }
        if (c == BioType.SOUND_SIGNER_RETELL || c == BioType.SOUND_SIGNER_OTHER) {
            var h = new SoundEvidence;
            h.Format = DataFormat.MEDIA_3GP;
            var i = sha1Digest(b);
            return h.Hash = "BS64:" + i.toString().toUpperCase(), h.BioType = c, e.Points.CertOID.BioFeature.SoundArray[d] = h, !0
        }
        return !1
    }, this._addChachetObj = function (a) {
        return !(d || !a) && (p.push(a), !0)
    }, this._addPhotoObj = function (a, b, c) {
        return !1
    }, this._addMediaObj = function (a, b, c) {
        return !1
    }, this._setTemplate = function (b, c, d, f) {
        if (!e && x(b)) {
            if (null == c || 0 === c.length) return anysign.logger.e("contentUtf8Str must not be null or empty"), !1;
            if (null == d || 0 === d.length) return anysign.logger.e("businessId must not be null or empty"), !1;
            if (null == f || 0 === f.length) return anysign.logger.e("template_serial must not be null or empty"), !1;
            g = d, h = sha1DigestBase64(d) + "";
            var i = new DataObj;
            if (i.Cid = b, i.Data = c, a.FORMDATA_XML === b || a.FORMDATA_JSON === b) {
                var j = new PDFCrdRule;
                j.DocFormat = b, j.DocStyleTid = f, i.PDFCrdRule = j
            }
            var k = new DataConfig;
            return k.cid = b, k.nessesary = !0, n[b] = i, o[b] = k, e = !0, !0
        }
        return !1
    }, this._setTID = function (a) {
        return f = a, !0
    }, this._setData = function (a, b) {
        if (v(a) && b) {
            if ("string" == typeof b) {
                var c = n[a];
                c.Data = Base64.encodeUint8Array(anysign.charset.strToUtf8ArrayUint8(b))
            } else if (b instanceof Uint8Array) {
                var c = n[a];
                c.Data = Base64.encodeUint8Array(b)
            }
            return !0
        }
        return !1
    }, this._commitConfig = function () {
        return d = !0, !0
    }, this._resetConfig = function () {
        return u(), !0
    }, this._showSignatureDialog = function (a) {
        if (d) {
            if (e) {
                if (null == k[a]) return EC_WRONG_CONTEXT_ID;
                onloadAnysignView(!0);
                var b = k[a],
                    f = getWindowHeight(),
                    g = getWindowWidth(),
                    h = document.getElementById("dialog");
                h.style.height = f, h.style.width = g, h.style.display = "block";
                var i = document.getElementById("anysign_title"),
                    l = b.title,
                    m = l.substring(b.titleSpanFromOffset, b.titleSpanToOffset + 1).big();
                return i.innerHTML = l.substring(0, b.titleSpanFromOffset) + m + l.substring(b.titleSpanToOffset + 1, l.length), setSignResCallback(b, function (a, d, e, f, g, h, i) {
                    if (c) {
                        if (e) {
                            var k = j[a];
                            if (w(k, b.penColor, f, g, h, i), k.ImageSize = new ImageSize(calculatedSigWidth, calculatedSigHeight), k.Image = d, k.SignRule && k.SignRule instanceof SignRule_XYZ) {
                                var l = k.SignRule.XYZRule;
                                "dp" === l.Unit ? k.SignRule.XYZRule = {
                                    Left: l.Left,
                                    Top: l.Top,
                                    Right: l.Left + calculatedSigWidth,
                                    Bottom: l.Top - calculatedSigHeight,
                                    Pageno: l.Pageno,
                                    Unit: l.Unit
                                } : "pt" === l.Unit && (k.SignRule.XYZRule = {
                                    Left: l.Left,
                                    Top: l.Top,
                                    Right: l.Left + .45 * calculatedSigWidth,
                                    Bottom: l.Top - .45 * calculatedSigHeight,
                                    Pageno: l.Pageno,
                                    Unit: l.Unit
                                })
                            }
                            c(b.cid, CALLBACK_TYPE_SIGNATURE, e)
                        } else c(b.cid, CALLBACK_TYPE_DIALOG_CANCEL, null);
                        clear_canvas();
                        var m = document.getElementById("dialog");
                        m.style.display = "none", setIsAnysignInputDlgShown(!1)
                    }
                }), setIsAnysignInputDlgShown(!0), RESULT_OK
            }
            return EC_TEMPLATE_NOT_SET
        }
        return EC_API_NOT_INITED
    }, this._showCommentDialog = function (a) {
        if (d) {
            if (e) {
                if (null == k[a]) return EC_WRONG_CONTEXT_ID;
                if (isCommentShow) return EC_COMMENT_ALREADY_SHOW;
                var b = k[a];
                setSignResCallback(b, function (a, d, e, f, g, h, i) {
                    if (c) {
                        if (e) {
                            var k = j[a];
                            if (w(k, b.penColor, f, g, h, i), k.ImageSize = new ImageSize(h, i), k.Image = d, k.SignRule && k.SignRule instanceof SignRule_XYZ) {
                                var l = k.SignRule.XYZRule;
                                "dp" === l.Unit ? k.SignRule.XYZRule = {
                                    Left: l.Left,
                                    Top: l.Top,
                                    Right: l.Left + h,
                                    Bottom: l.Top - i,
                                    Pageno: l.Pageno,
                                    Unit: l.Unit
                                } : "pt" === l.Unit && (k.SignRule.XYZRule = {
                                    Left: l.Left,
                                    Top: l.Top,
                                    Right: l.Left + .45 * h,
                                    Bottom: l.Top - .45 * i,
                                    Pageno: l.Pageno,
                                    Unit: l.Unit
                                })
                            }
                            c(b.cid, CALLBACK_TYPE_COMMENTSIGN, e)
                        } else c(b.cid, CALLBACK_TYPE_DIALOG_CANCEL, null);
                        clear_canvas();
                        var m = document.getElementById("dialog");
                        m.style.display = "none", setIsAnysignInputDlgShown(!1)
                    }
                });
                var f = new anysignCommentUI;
                return f.onload_commentSignCanvas(b), setIsAnysignInputDlgShown(!0), RESULT_OK
            }
            return EC_TEMPLATE_NOT_SET
        }
        return EC_API_NOT_INITED
    }, this._takePicture = function (a) {
        return !1
    }, this._picturePreview = function (a) {
        return !1
    }, this._startMediaRecording = function (a) {
        return !1
    }, this._audioPreview = function (a) {
        return !1
    }, this._mediaPreview = function (a) {
        return !1
    }, this._startMediaRecording = function (a) {
        return !1
    }, this._finishMediaRecording = function (a) {
        return !1
    }, this._isReadyToUpload = function () {
        if (!d || !e) return !1;
        for (var a in k) {
            var b = k[a],
                c = b.cid;
            if (b.nessesary) {
                var f = j[c];
                if (null == f || null == f.Points || null == f.Points.CertOID || null == f.Points.CertOID.BioFeature || null == f.Points.CertOID.BioFeature.Script) return !1
            }
        }
        for (a in o) {
            var b = o[a],
                g = n[b.cid];
            if ((null == g || null == g.Data) && b.nessesary) return !1
        }
        return !0
    }, this._saveBusinessSession = function (a) {
        a = md5Digest("424A4341" + a) + "", a = a.substring(0, 24);
        var b = new SaveFormInfo;
        b.WONo = g, b.WOHash = h, b.Channel = i;
        var c;
        for (var d in k) c = k[d], b.USignConfigs.push(c), b.USignObjs.push(j[c.cid]);
        for (d in o) c = o[d], b.DataConfigs.push(c), b.DataObjs.push(n[c.cid]);
        b.CachetArray = p, b.EncAlg = EncAlgType.EncAlg;
        var e = anysign.json.stringify(b),
            f = tripleDesEncrypt(e, a) + "";
        return f
    }, this._restoreBusinessSession = function (a, b) {
        b = md5Digest("424A4341" + b) + "", b = b.substring(0, 24);
        var c = tripleDesDecrypt(a, b) + "",
            f = anysign.hex.hexStrToUint8Str(c),
            l = anysign.json.stringToObj(f);
        g = l.WONo, h = l.WOHash, i = l.Channel, EncAlgType.EncAlg = l.EncAlg;
        var m, q;
        for (var r in l.USignConfigs) {
            m = l.USignConfigs[r].cid;
            for (var s in l.USignObjs) q = l.USignObjs[s].Cid, m == q && (k[m] = l.USignConfigs[r], j[q] = l.USignObjs[s])
        }
        for (var r in l.DataConfigs) {
            m = l.DataConfigs[r].cid;
            for (var s in l.DataObjs) q = l.DataObjs[s].Cid, m == q && (o[m] = l.DataConfigs[r], n[q] = l.DataObjs[s])
        }
        return p = l.CachetArray, d = !0, e = !0, !0
    }, this._getUploadDataGram = function () {
        if (d && this._isReadyToUpload() && e) {
            var a = new AnySignRoot,
                b = new FormInfo,
                c = new Uint8Array(24);
            void 0 != window.crypto ? window.crypto.getRandomValues(c) : void 0 != window.msCrypto ? window.msCrypto.getRandomValues(c) : capabal.crypto.getRandomValues(c), a.EncKey = rsaPubkeyUint8EncByDefault(c), a.EncCertSN = encCertSN;
            var l, f = [];
            for (var m in k) l = k[m], f.push(j[l.cid]);
            var q = [];
            for (m in o) l = o[m], q.push(n[l.cid]);
            b.WONo = g, b.WOHash = h, b.Channel = i, null != p && p.length > 0 && (b.IsUnit = !0), b.USignArray = f, b.DataArray = q, b.CachetArray = p, b.ExtInfo = new ExtInfo, b.EncAlg = EncAlgType.EncAlg;
            var r = anysign.json.stringify(b);
            return a.EncData = tripleDesEncrypt(r, anysign.hex.uint8ArrayToHexStr(c)) + "", a.Digest = new Digest, a.Digest.Alg = "CRC32", a.Digest.Value = anysign.digest.crc32(a.EncData).toString(16).toUpperCase(), anysign.json.stringify(a)
        }
        return null
    }, this._getOSInfo = function () {
        if (isMobile.Android()) {
            var a = navigator.userAgent.toLowerCase();
            alert(a);
            var b = a.indexOf("android"),
                c = a.indexOf(";", b);
            b += 8;
            var d = a.substring(b, c);
            return "android##" + d
        }
        if (isMobile.iOS()) {
            var b, c, d, a = navigator.userAgent;
            if ((b = a.indexOf("OS")) != -1 && (c = a.indexOf("like Mac OS")) != -1) return d = a.substring(b + 3, c - 1), d = d.replace(/_/g, "."), "ios##" + d
        }
        return "unknown"
    }
}

function onBridgeReady() {
    WeixinJSBridge.call("hideOptionMenu")
}
var CALLBACK_TYPE_SIGNATURE = 1,
    CALLBACK_TYPE_DIALOG_DISMISS = 2,
    CALLBACK_TYPE_DIALOG_CANCEL = 3,
    CALLBACK_TYPE_BUFFER_SAVED = 4,
    CALLBACK_TYPE_ON_PICTURE_TAKEN = 5,
    CALLBACK_TYPE_DATA_DELETED = 6,
    CALLBACK_TYPE_START_RECORDING = 7,
    CALLBACK_TYPE_STOP_RECORDING = 8,
    CALLBACK_TYPE_ON_MEDIA_DATA = 9,
    CALLBACK_TYPE_COMMENTSIGN = 10,
    CALLBACK_TYPE_ERROR = -1,
    CALLBACK_TYPE_ERROR_PICTURE = -2,
    CALLBACK_TYPE_OPERATION_CANCELED = -3,
    CALLBACK_TYPE_GETVERSION = 10,
    RESULT_OK = 0,
    RESULT_ERROR = -1,
    EC_API_NOT_INITED = 1,
    EC_WRONG_CONTEXT_ID = 2,
    EC_CAMERA_INIT_FAILED = 3,
    EC_NATIVE_EXCEPTION = 4,
    EC_DEVICE_NOT_SUPPORTED = 5,
    EC_TEMPLATE_NOT_SET = 6,
    EC_COMMENT_ALREADY_SHOW = 7,
    isCommentShow = !1,
    isMobile = {
        Android: function () {
            return !!navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function () {
            return !!navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function () {
            return !!navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Windows: function () {
            return !!navigator.userAgent.match(/IEMobile/i)
        },
        any: function () {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows()
        }
    };
"undefined" == typeof WeixinJSBridge ? document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", onBridgeReady, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", onBridgeReady), document.attachEvent("onWeixinJSBridgeReady", onBridgeReady)) : onBridgeReady();

function onloadAnysignView(a) {
    this.isSign = a, onload_singleSignCanvas(), onload_singleSingScrollAction()
}

function onload_singleSignCanvas() {
    if (document.getElementById("anysignCanvas")) {
        var a = document.getElementById("anysignCanvas"),
            b = a.getContext("2d"),
            c = getWindowHeight(),
            d = getWindowWidth();

        a.width < 10 && (a.width = d * a.width * .99), a.width < d && (a.width = .99 * d);
        var e = document.getElementById("container");
        e.style.overflowX = "scroll", e.style.overflowY = "hidden", a.height = .7 * c;
        var f = document.getElementById("anysign_title");
        f.style.height = .1 * c + "px";
        var g = document.getElementById("single_scrollbar");
        g.style.height = .1 * c + "px";
        var e = document.getElementById("btnContainerOuter");
        e.style.height = .1 * c + "px";
        var h = window.devicePixelRatio ? window.devicePixelRatio : 1,
            i = d * a.height / 142560;
        base_stroke_width = h * i * 2.4;
        var e = document.getElementById("container");
        tmp_canvas = document.createElement("canvas"), tmp_ctx = tmp_canvas.getContext("2d"), tmp_canvas.id = "tmp_canvas", tmp_canvas.width = a.width, tmp_canvas.height = a.height, e.appendChild(tmp_canvas), "ontouchstart" in document.documentElement ? (tmp_canvas.ontouchstart = function (a) {
            return !isCopyingImg && (a.preventDefault(), isDown = !0, a.touches && (a = a.touches[0]), !1)
        }, tmp_canvas.ontouchmove = function (b) {
            if (isDown && !isCopyingImg) {
                var c = JQuery_Capable.offset(b.target);
                "undefined" != typeof b.targetTouches ? (curX = Math.floor(b.targetTouches[0].pageX - c.left), curY = Math.floor(b.targetTouches[0].pageY - c.top)) : (curX = Math.floor(b.pageX - c.left), curY = Math.floor(b.pageY - c.top));
                var d = b.timeStamp;
                0 !== signTrachPointCount || isNaN(d) || (firstPointTime = d), curX > 0 && curY <= a.height && (signTrack += isNaN(d) ? curX + "," + curY + "," + base_stroke_width + ",0\n" : curX + "," + curY + "," + base_stroke_width + "," + (d - firstPointTime) + "\n", signTrachPointCount += 1, curX > maxX && (maxX = curX), curX < minX && (minX = curX), curY > maxY && (maxY = curY), curY < minY && (minY = curY), points.push({
                    x: curX,
                    y: curY
                }), onPaint(), lastX = curX, lastY = curY), preventDefault(b)
            }
        }, tmp_canvas.ontouchend = function (a) {
            var b = a.timeStamp;
            signTrack += isNaN(b) ? "0,0,-1,0\n" : "0,0,-1," + (b - firstPointTime) + "\n", signTrachPointCount += 1, isCopyingImg = !0, isDown = !1;
            var c = document.getElementById("anysignCanvas"),
                d = c.getContext("2d");
            d.drawImage(tmp_canvas, 0, 0), tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height), points = [], isCopyingImg = !1
        }, tmp_canvas.ontouchcancel = tmp_canvas.ontouchend) : (tmp_canvas.onmousedown = function (a) {
            isDown = !0
        }, tmp_canvas.onmousemove = function (a) {
            if (isDown) {
                var b = JQuery_Capable.offset(a.target),
                    c = document.body.scrollTop | document.documentElement.scrollTop,
                    d = document.body.scrollLeft | document.documentElement.scrollLeft;
                "undefined" != typeof a.targetTouches ? (curX = Math.floor(a.targetTouches[0].clientX - b.left), curY = Math.floor(a.targetTouches[0].clientY - b.top)) : (curX = Math.floor(a.clientX - b.left), curY = Math.floor(a.clientY - b.top));
                var e = a.timeStamp;
                0 !== signTrachPointCount || isNaN(e) || (firstPointTime = e), curX > 0 && (signTrack += isNaN(e) ? curX + "," + curY + "," + base_stroke_width + ",0\n" : curX + "," + curY + "," + base_stroke_width + "," + (e - firstPointTime) + "\n", signTrachPointCount += 1, curY += c, curX += d, curX > maxX && (maxX = curX), curX < minX && (minX = curX), curY > maxY && (maxY = curY), curY < minY && (minY = curY), points.push({
                    x: curX,
                    y: curY
                }), onPaint(), lastX = curX, lastY = curY), preventDefault(a)
            }
        }, tmp_canvas.onmouseup = function (a) {
            var b = JQuery_Capable.offset(a.target);
            "undefined" != typeof a.targetTouches ? (curX = Math.floor(a.targetTouches[0].clientX - b.left), curY = Math.floor(a.targetTouches[0].clientY - b.top)) : (curX = Math.floor(a.clientX - b.left), curY = Math.floor(a.clientY - b.top));
            var c = a.timeStamp;
            signTrack += isNaN(c) ? "0,0,-1,0\n" : "0,0,-1," + (c - firstPointTime) + "\n", signTrachPointCount += 1, isDown = !1;
            var d = document.getElementById("anysignCanvas"),
                e = d.getContext("2d");
            e.drawImage(tmp_canvas, 0, 0), tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height), points = []
        }, tmp_canvas.onmouseout = tmp_canvas.onmouseup);
        window.devicePixelRatio ? window.devicePixelRatio : 1;
        b.strokeStyle = signObjTmp ? signObjTmp.penColor : "black", b.lineWidth = base_stroke_width, b.lineCap = "round", b.lineJoin = "round", b.shadowBlur = 5, tmp_ctx.strokeStyle = signObjTmp ? signObjTmp.penColor : "black", tmp_ctx.lineWidth = base_stroke_width, tmp_ctx.lineCap = "round", tmp_ctx.lineJoin = "round", tmp_ctx.shadowBlur = 5
    } else alert("获取签名控件失败,请使用safari和chrome浏览器进行签名。\n\n当前浏览器详情如下：" + navigator.userAgent)
}

function onload_singleSingScrollAction() {
    function i() {
        b -= h, b > c ? (setTimeout(i, g), d.scrollLeft = b) : (b = c, d.scrollLeft = b), b <= 0 && (d.style.borderColor = "#FF0000", setTimeout(function () {
            d.style.borderColor = "gray"
        }, 1e3))
    }

    function j() {
        b += h, b < c ? (d.scrollLeft = b, setTimeout(j, g)) : (b = c, d.scrollLeft = b), b >= d.scrollWidth - d.clientWidth && (d.style.borderColor = "#FF0000", setTimeout(function () {
            d.style.borderColor = "gray"
        }, 1e3))
    }

    var a = 0,
        b = 0,
        c = 0,
        d = document.getElementById("container");
    d.addEventListener("scroll", function () {
        b = d.scrollLeft
    });
    var e = document.getElementById("single_scrollbar_up");
    e.addEventListener("click", function () {
        var e = d.clientWidth;
        d.scrollWidth;
        a = Math.ceil(1 * e / 3), c = b - a >= 0 ? b - a : 0, i()
    });
    var f = document.getElementById("single_scrollbar_down");
    f.addEventListener("click", function () {
        var e = d.clientWidth,
            f = d.scrollWidth;
        a = Math.ceil(1 * e / 3), c = b + a >= f - e ? f - e : b + a, j()
    });
    var g = 50,
        h = 20
}

function clear_canvas() {
    var a = document.getElementById("anysignCanvas"),
        b = a.getContext("2d");
    b.clearRect(0, 0, a.width, a.height), b.closePath();
    var c = a.width,
        d = a.height;
    a.width = a.height = 0, a.width = c, a.height = d, calculatedSigWidth = 0, calculatedSigHeight = 0, signTrack = "", signTrachPointCount = 0, firstPointTime = 0, points = [], minX = 9999, minY = 9999, maxX = 0, maxY = 0, imageDataTmp = null, isDrawn = !1
}

function sign_confirm() {
    if (!isDrawn) return void custom_alert("请手写签名", "确认");
    var a = document.getElementById("anysignCanvas"),
        b = a.getContext("2d"),
        c = maxX - minX + paste_padding + paste_padding,
        d = maxY - minY + paste_padding + paste_padding;
    if (imageDataTmp = b.getImageData(minX - paste_padding, minY - paste_padding, c + paste_padding, d + paste_padding), signResCallback) {
        var e = getSigData(),
            a = document.getElementById("anysignCanvas");
        signResCallback(signObjTmp.cid, e[0].substr(22, e[0].length), e[1].substr(22, e[1].length), signTrack, signTrachPointCount, a.width, a.height)
    }
    document.body.parentNode.style.overflow = "scroll", isSign = !1
}

function setSignResCallback(a, b) {
    if (isSignOrCom(a.cid)) {
        signObjTmp = a, signResCallback = b;
        var c = document.getElementById("anysignCanvas"),
            d = c.getContext("2d");
        d.strokeStyle = signObjTmp ? signObjTmp.penColor : "black"
    } else {
        commentObjTmp = a, signResCallback = b;
        var c = document.getElementById("comment_canvas"),
            d = c.getContext("2d");
        d.strokeStyle = commentObjTmp ? commentObjTmp.penColor : "black", comment_canvas.strokeStyle = commentObjTmp ? commentObjTmp.penColor : "black"
    }
}

function setCanvasHeight(a) {
    var b = document.getElementById("anysignCanvas");
    a > 0 && (b.height = a, tmp_canvas && (tmp_canvas.height = a))
}

function getSigData() {
    var a = new Array;
    if (imageDataTmp) {
        var b = document.createElement("canvas"),
            c = b.getContext("2d"),
            d = window.devicePixelRatio ? window.devicePixelRatio : 1;
        b.width = imageDataTmp.width / d, b.height = imageDataTmp.height / d;
        var e = 1;
        signObjTmp.singleWidth / signObjTmp.singleHeight <= b.width / b.height ? signObjTmp.singleWidth <= b.width && (e = signObjTmp.singleWidth / b.width) : signObjTmp.singleHeight <= b.height && (e = signObjTmp.singleHeight / b.height), b.width *= e, b.height *= e, calculatedSigWidth = b.width, calculatedSigHeight = b.height, c.scale(1 / d * e, 1 / d * e);
        var f = document.createElement("canvas");
        f.width = imageDataTmp.width, f.height = imageDataTmp.height, f.getContext("2d").putImageData(imageDataTmp, 0, 0), c.drawImage(f, 0, 0);
        var g = signObjTmp.signatureImgRatio,
            h = 1 / d * e * g,
            i = document.createElement("canvas"),
            j = i.getContext("2d");
        h < 1 ? (i.width = imageDataTmp.width * h, i.height = imageDataTmp.height * h, j.scale(h, h)) : (i.width = imageDataTmp.width, i.height = imageDataTmp.height);
        var k = document.createElement("canvas");
        return k.width = imageDataTmp.width, k.height = imageDataTmp.height, k.getContext("2d").putImageData(imageDataTmp, 0, 0), j.drawImage(k, 0, 0), a[0] = i.toDataURL(), a[1] = b.toDataURL(), a
    }
    return null
}

function getRawSigHeight() {
    return imageDataTmp ? void 0 !== window.devicePixelRatio ? imageDataTmp.height / window.devicePixelRatio : imageDataTmp.height : 0
}

function getRawSigWidth() {
    return imageDataTmp ? void 0 !== window.devicePixelRatio ? imageDataTmp.width / window.devicePixelRatio : imageDataTmp.width : 0
}

function cancelSign() {
    clear_canvas();
    var a = document.getElementById("dialog");
    sessionStorage.hidedialog = 'Y';
    a.style.display = "none", document.body.scroll = "yes", isSign = !1, signResCallback && signResCallback(signObjTmp.cid, null, null, 0)
}

function setIsAnysignInputDlgShown(a) {
    isAnysignInputDlgShown = a
}

function testGetImageData() {
}

function testEnc() {
    var a = tripleDesEncrypt("abcdefg", "000102030405060708090a0b0c0d0e0f"),
        b = document.getElementById("result");
    b.value = a
}

function testEncAndDec() {
    var a = "133434",
        b = "abdfdsafdasfcdef132432432432g你好吗,,,fdafdas",
        c = tripleDesEncrypt(b, a) + "",
        d = tripleDesDecrypt(c, a) + "",
        e = anysign.hex.hexStrToUint8Str(d),
        f = b + "\n";
    f += c + "\n", f += e + "\n";
    var g = '{"Alg":"111","Value":"2222"}',
        i = (anysign.json.stringToObj(g), document.getElementById("result"));
    i.value = f
}

function custom_alert(a, b) {
    showMsgDialog(a)
}

function preventDefault(a) {
    a = a || window.event, a.preventDefault && a.preventDefault(), a.returnValue = !1
}

function setSelectState(a) {
    for (var b = document.getElementsByTagName("select"), c = 0; c < b.length; c++) b[c].style.visibility = a
}

function showMessageBox2(a, b, c, d) {
    closeWindow();
    var e = getWindowHeight(),
        f = getWindowWidth();
    isIe && setSelectState("hidden");
    var g = document.createElement("div");
    g.id = "back";
    var h = "font-size:15pt; text-align:center; z-index:7;top:0px;left:0px;position:fixed;background:#666;width:" + f + "px;height:" + e + "px;";
    h += isIe ? "filter:alpha(opacity=0);" : "opacity:0;", g.style.cssText = h;
    var i = document.createElement("div");
    i.id = "mesWindow", i.innerHTML = "<div id='mesWindowContent'>" + b + "</div><div id='mesWindowBottom'><input id='mesWindowBtnOk' type='button' onclick='closeWindow();'value='确认' /></div>", g.appendChild(i), document.body.appendChild(g), showBackground(g, 80), "ontouchstart" in document.documentElement ? (g.ontouchstart = function (a) {
        return "mesWindowBtnOk" === a.target.id || (preventDefault(a), !1)
    }, g.ontouchmove = function (a) {
        preventDefault(a)
    }) : (g.onmousedown = function (a) {
        "mesWindowBtnOk" !== a.target.id && preventDefault(a)
    }, g.onmousemove = function (a) {
        preventDefault(a)
    })
}

function showBackground(a, b) {
    if (isIe) a.filters.alpha.opacity += 1, a.filters.alpha.opacity < b && setTimeout(function () {
        showBackground(a, b)
    }, 5);
    else {
        var c = parseFloat(a.style.opacity);
        c += .01, a.style.opacity = c, c < b / 100 && setTimeout(function () {
            showBackground(a, b)
        }, 5)
    }
}

function closeWindow() {
    null != document.getElementById("back") && document.getElementById("back").parentNode.removeChild(document.getElementById("back")), null != document.getElementById("mesWindow") && document.getElementById("mesWindow").parentNode.removeChild(document.getElementById("mesWindow")), isIe && setSelectState("")
}

function showMsgDialog(a) {
    showMessageBox2("修改小结内容", a, null, 350)
}
var points = [],
    firstPointTime = 0,
    signTrack = "",
    signTrachPointCount = 0,
    calculatedSigWidth = 0,
    calculatedSigHeight = 0,
    minX = 9999,
    minY = 9999,
    maxX = 0,
    maxY = 0,
    curX = 0,
    curY = 0,
    lastX = 0,
    lastY = 0,
    paste_padding = 10,
    imageDataTmp, isDown = !1,
    isDrawn = !1,
    isAnysignInputDlgShown = !1,
    isCopyingImg = !1,
    base_stroke_width = window.innerWidth >= 480 ? 7.5 : 5,
    tmp_canvas, tmp_ctx, signResCallback, signObjTmp, bh_temp = getWindowHeight(),
    bw_temp = getWindowWidth(),
    isSign;
window.addEventListener("resize", function () {
    if (isSign) {
        var a = ismobile(1);
        if (1 == a) {
            var d, e, f, g, h, b = document.getElementById("anysignCanvas"),
                c = b.getContext("2d");
            if (isDrawn) {
                d = document.createElement("canvas"), e = d.getContext("2d");
                var n, o, p, q, i = paste_padding,
                    j = i,
                    k = i,
                    l = i,
                    m = i;
                (n = minX - i) < 0 && (j = minX, n = 0), (o = minY - i) < 0 && (k = minY, o = 0), (p = maxX + i) > b.width && (l = 0, p = b.width), (q = maxY + i) > b.height && (m = 0, q = b.height), f = maxX - minX + j + l, g = maxY - minY + k + m, h = c.getImageData(n, o, p - n, q - o), d.width = f, d.height = g
            }
            var r = getWindowHeight(),
                s = getWindowWidth(),
                t = document.getElementById("dialog");
            t.style.height = r + "px", t.style.width = s + "px", b.width < 10 && (b.width = s * b.width), b.width < s && (b.width = s), b.height = .65 * r;
            var u = document.getElementById("container");
            u.style.overflowX = "scroll", u.style.overflowY = "hidden", u.style.height = .65 * r + "px";
            var v = document.getElementById("anysign_title");
            v.style.height = .1 * r + "px";
            var w = document.getElementById("single_scrollbar");
            w.style.height = .1 * r + "px";
            var x = document.getElementById("btnContainerOuter");
            x.style.height = .1 * r + "px"
        } else if (0 == a) {
            var r, s;
            if (0 == window.orientation || 180 == window.orientation) r = bh_temp, s = bw_temp;
            else {
                var y = getWindowHeight(),
                    z = getWindowWidth();
                r = y, s = z
            }
            var d, e, f, g, h, b = document.getElementById("anysignCanvas"),
                c = b.getContext("2d");
            if (isDrawn) {
                d = document.createElement("canvas"), e = d.getContext("2d");
                var n, o, p, q, i = paste_padding,
                    j = i,
                    k = i,
                    l = i,
                    m = i;
                (n = minX - i) < 0 && (j = minX, n = 0), (o = minY - i) < 0 && (k = minY, o = 0), (p = maxX + i) > b.width && (l = 0, p = b.width), (q = maxY + i) > b.height && (m = 0, q = b.height), f = maxX - minX + j + l, g = maxY - minY + k + m, h = c.getImageData(n, o, p - n, q - o), d.width = f, d.height = g
            }
            var t = document.getElementById("dialog");
            if (t.style.height = r + "px", t.style.width = s + "px", b.height = r, b.width < 10 && (b.width = s * b.width), b.width < s && (b.width = s), 0 == window.orientation || 180 == window.orientation) {
                b.height = .7 * b.height;
                var u = document.getElementById("container");
                u.style.overflowX = "scroll", u.style.overflowY = "hidden", u.style.height = .7 * r + "px";
                var v = document.getElementById("anysign_title");
                v.style.height = .1 * r + "px";
                var x = document.getElementById("btnContainerOuter");
                x.style.height = .2 * r + "px";
                var A = document.getElementById("btnContainerInner");
                A.style.marginBottom = 0
            } else {
                b.height = .6 * b.height;
                var u = document.getElementById("container");
                u.style.overflowX = "scroll", u.style.overflowY = "hidden", u.style.height = .6 * r + "px";
                var v = document.getElementById("anysign_title");
                v.style.height = .1 * r + "px";
                var x = document.getElementById("btnContainerOuter");
                x.style.height = .3 * r + "px";
                var A = document.getElementById("btnContainerInner");
                A.style.marginBottom = x.style.height
            }
        }
        null != tmp_canvas && (tmp_canvas.width = b.width, tmp_canvas.height = b.height);
        var B = window.devicePixelRatio ? window.devicePixelRatio : 1,
            C = z * b.height / 142560;
        if (base_stroke_width = B * C * 2.4, c.strokeStyle = signObjTmp ? signObjTmp.penColor : "black", c.lineWidth = base_stroke_width, c.lineCap = "round", c.lineJoin = "round", c.shadowBlur = 5, tmp_ctx.strokeStyle = signObjTmp ? signObjTmp.penColor : "black", tmp_ctx.lineWidth = base_stroke_width, tmp_ctx.lineCap = "round", tmp_ctx.lineJoin = "round", tmp_ctx.shadowBlur = 5, !isDrawn) return void tmp_canvas.getContext("2d").clearRect(0, 0, b.width, b.height);
        var D;
        D = b.width > f ? b.height >= g ? 1 : b.height / g : b.width / b.height > f / g ? b.height / g : b.width / f, e.putImageData(h, 0, 0);
        var E = document.createElement("canvas"),
            F = E.getContext("2d");
        E.width = f * D, E.height = g * D, F.scale(D, D), F.drawImage(d, 0, 0), c.clearRect(0, 0, b.width, b.height), c.drawImage(E, 0, 0), minX = 0, minY = 0, maxX *= D, maxY *= D, tmp_canvas.getContext("2d").clearRect(0, 0, b.width, b.height)
    }
});
var onPaint = function () {
        if (points.length < 3) {
            var a = points[0];
            return tmp_ctx.beginPath(), tmp_ctx.strokeStyle = signObjTmp.penColor, tmp_ctx.fillStyle = signObjTmp.penColor, tmp_ctx.arc(a.x, a.y, tmp_ctx.lineWidth / 2, 0, 2 * Math.PI, !0), tmp_ctx.fill(), void tmp_ctx.closePath()
        }
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height), tmp_ctx.beginPath(), tmp_ctx.strokeStyle = signObjTmp.penColor, tmp_ctx.fillStyle = signObjTmp.penColor, tmp_ctx.moveTo(points[0].x, points[0].y);
        for (var b = 1; b < points.length - 2; b++) {
            var c = (points[b].x + points[b + 1].x) / 2,
                d = (points[b].y + points[b + 1].y) / 2;
            tmp_ctx.quadraticCurveTo(points[b].x, points[b].y, c, d)
        }
        tmp_ctx.quadraticCurveTo(points[b].x, points[b].y, points[b + 1].x, points[b + 1].y), tmp_ctx.stroke(), isDrawn = !0
    },
    JQuery_Capable = {
        offset: function (a) {
            var c, d, b = "undefined",
                e = {
                    top: 0,
                    left: 0
                },
                f = a,
                g = f && f.ownerDocument;
            if (g) return c = g.documentElement, typeof f.getBoundingClientRect !== b && (e = f.getBoundingClientRect()), d = JQuery_Capable.getWindow(g), {
                top: e.top + (d.pageYOffset || c.scrollTop) - (c.clientTop || 0),
                left: e.left + (d.pageXOffset || c.scrollLeft) - (c.clientLeft || 0)
            }
        },
        getWindow: function (a) {
            return JQuery_Capable.isWindow(a) ? a : 9 === a.nodeType && (a.defaultView || a.parentWindow)
        },
        isWindow: function (a) {
            return null != a && a == a.window
        }
    },
    isIe = !!document.all,
    messContent;

function toUInt(a) {
    return a < 0 ? a + 4294967296 : a
}

function bytes32(a) {
    return [a >>> 24 & 255, a >>> 16 & 255, a >>> 8 & 255, 255 & a]
}

function bytes16sw(a) {
    return [255 & a, a >>> 8 & 255]
}

function adler32(a, b, c) {
    switch (arguments.length) {
        case 1:
            b = 0;
        case 2:
            c = a.length - b
    }
    for (var d = 1, e = 0, f = 0; f < c; f++) d = (d + a[b + f]) % 65521, e = (e + d) % 65521;
    return toUInt(e << 16 | d)
}

function crc32(a, b, c) {
    switch (arguments.length) {
        case 1:
            b = 0;
        case 2:
            c = a.length - b
    }
    var d = arguments.callee.crctable;
    if (!d) {
        d = [];
        for (var e, f = 0; f < 256; f++) {
            e = f;
            for (var g = 0; g < 8; g++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
            d[f] = toUInt(e)
        }
        arguments.callee.crctable = d
    }
    for (var e = 4294967295, h = 0; h < c; h++) e = d[255 & (e ^ a[b + h])] ^ e >>> 8;
    return toUInt(4294967295 ^ e)
}
!function () {
    function b(a, b) {
        return this.slice(a, b)
    }

    function c(a, b) {
        arguments.length < 2 && (b = 0);
        for (var c = 0, d = a.length; c < d; ++c, ++b) this[b] = 255 & a[c]
    }

    function d(a) {
        var d;
        if ("number" == typeof a) {
            d = new Array(a);
            for (var e = 0; e < a; ++e) d[e] = 0
        } else d = a.slice(0);
        return d.subarray = b, d.buffer = d, d.byteLength = d.length, d.set = c, "object" == typeof a && a.buffer && (d.buffer = a.buffer), d
    }

    try {
        new Uint8Array(1);
        return
    } catch (a) {
    }
    window.Uint8Array = d, window.Uint32Array = d, window.Int32Array = d
}(),
    function () {
        "response" in XMLHttpRequest.prototype || "mozResponseArrayBuffer" in XMLHttpRequest.prototype || "mozResponse" in XMLHttpRequest.prototype || "responseArrayBuffer" in XMLHttpRequest.prototype || Object.defineProperty(XMLHttpRequest.prototype, "response", {
            get: function () {
                return new Uint8Array(new VBArray(this.responseBody).toArray())
            }
        })
    }(),
    function () {
        if (!("btoa" in window)) {
            var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            window.btoa = function (b) {
                var d, e, c = "";
                for (d = 0, e = b.length; d < e; d += 3) {
                    var f = 255 & b.charCodeAt(d),
                        g = 255 & b.charCodeAt(d + 1),
                        h = 255 & b.charCodeAt(d + 2),
                        i = f >> 2,
                        j = (3 & f) << 4 | g >> 4,
                        k = d + 1 < e ? (15 & g) << 2 | h >> 6 : 64,
                        l = d + 2 < e ? 63 & h : 64;
                    c += a.charAt(i) + a.charAt(j) + a.charAt(k) + a.charAt(l)
                }
                return c
            }
        }
    }();
var capabal = capabal || {
        crypto: {
            getRandomValues: function (a) {
                var b, c, d = a.length;
                if (d)
                    for (; --d;) c = Math.floor(Math.random() * (d + 1)), b = a[c], a[c] = a[d], a[d] = b;
                return a
            }
        }
    };
!function () {
    var a = function () {
            var a = Array.prototype.slice.call(this.getContext("2d").getImageData(0, 0, this.width, this.height).data),
                b = this.width,
                c = this.height,
                d = [137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82];
            Array.prototype.push.apply(d, bytes32(b)), Array.prototype.push.apply(d, bytes32(c)), d.push(8, 6, 0, 0, 0), Array.prototype.push.apply(d, bytes32(crc32(d, 12, 17)));
            for (var e = c * (4 * b + 1), f = 0; f < c; f++) a.splice(f * (4 * b + 1), 0, 0);
            var g = Math.ceil(e / 32768);
            Array.prototype.push.apply(d, bytes32(e + 5 * g + 6));
            var h = d.length,
                i = e + 5 * g + 6 + 4;
            d.push(73, 68, 65, 84, 120, 1);
            for (var j = 0; j < g; j++) {
                var k = Math.min(32768, e - 32768 * j);
                d.push(j == g - 1 ? 1 : 0), Array.prototype.push.apply(d, bytes16sw(k)), Array.prototype.push.apply(d, bytes16sw(~k));
                var l = a.slice(32768 * j, 32768 * j + k);
                Array.prototype.push.apply(d, l)
            }
            return Array.prototype.push.apply(d, bytes32(adler32(a))), Array.prototype.push.apply(d, bytes32(crc32(d, h, i))), d.push(0, 0, 0, 0, 73, 69, 78, 68), Array.prototype.push.apply(d, bytes32(crc32(d, d.length - 4, 4))), "data:image/png;base64," + btoa(d.map(function (a) {
                return String.fromCharCode(a)
            }).join(""))
        },
        b = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (c) {
        var d = b.apply(this, arguments);
        return "data:," == d ? (HTMLCanvasElement.prototype.toDataURL = a, this.toDataURL()) : (HTMLCanvasElement.prototype.toDataURL = b, d)
    }
}();
