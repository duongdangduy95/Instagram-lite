(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/IT4409/Instagram-lite/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var pe = Object.defineProperty;
var Xe = Object.getOwnPropertyDescriptor;
var Ke = Object.getOwnPropertyNames;
var Qe = Object.prototype.hasOwnProperty;
var Ye = (e)=>{
    throw TypeError(e);
};
var Oe = (e, n)=>{
    for(var i in n)pe(e, i, {
        get: n[i],
        enumerable: !0
    });
}, xe = (e, n, i, t)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let r of Ke(n))!Qe.call(e, r) && r !== i && pe(e, r, {
        get: ()=>n[r],
        enumerable: !(t = Xe(n, r)) || t.enumerable
    });
    return e;
};
var ze = (e)=>xe(pe({}, "__esModule", {
        value: !0
    }), e);
var ne = (e, n, i)=>n.has(e) ? Ye("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(e) : n.set(e, i);
var ii = {};
Oe(ii, {
    Decimal: ()=>Je,
    Public: ()=>ge,
    getRuntime: ()=>_e,
    makeStrictEnum: ()=>qe,
    objectEnumValues: ()=>Ae
});
module.exports = ze(ii);
var ge = {};
Oe(ge, {
    validator: ()=>Re
});
function Re() {
    for(var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++){
        e[_key] = arguments[_key];
    }
    return (n)=>n;
}
var ie = Symbol(), me = new WeakMap, we = class {
    _getName() {
        return this.constructor.name;
    }
    toString() {
        return me.get(this);
    }
    constructor(n){
        n === ie ? me.set(this, "Prisma.".concat(this._getName())) : me.set(this, "new Prisma.".concat(this._getNamespace(), ".").concat(this._getName(), "()"));
    }
}, G = class extends we {
    _getNamespace() {
        return "NullTypes";
    }
}, Ne, J = class extends G {
    constructor(){
        super(...arguments);
        ne(this, Ne);
    }
};
Ne = new WeakMap;
ke(J, "DbNull");
var ve, X = class extends G {
    constructor(){
        super(...arguments);
        ne(this, ve);
    }
};
ve = new WeakMap;
ke(X, "JsonNull");
var Ee, K = class extends G {
    constructor(){
        super(...arguments);
        ne(this, Ee);
    }
};
Ee = new WeakMap;
ke(K, "AnyNull");
var Ae = {
    classes: {
        DbNull: J,
        JsonNull: X,
        AnyNull: K
    },
    instances: {
        DbNull: new J(ie),
        JsonNull: new X(ie),
        AnyNull: new K(ie)
    }
};
function ke(e, n) {
    Object.defineProperty(e, "name", {
        value: n,
        configurable: !0
    });
}
var ye = new Set([
    "toJSON",
    "$$typeof",
    "asymmetricMatch",
    Symbol.iterator,
    Symbol.toStringTag,
    Symbol.isConcatSpreadable,
    Symbol.toPrimitive
]);
function qe(e) {
    return new Proxy(e, {
        get (n, i) {
            if (i in n) return n[i];
            if (!ye.has(i)) throw new TypeError("Invalid enum value: ".concat(String(i)));
        }
    });
}
var en = ()=>{
    var e, n;
    return ((n = (e = globalThis.process) == null ? void 0 : e.release) == null ? void 0 : n.name) === "node";
}, nn = ()=>{
    var e, n;
    return !!globalThis.Bun || !!((n = (e = globalThis.process) == null ? void 0 : e.versions) != null && n.bun);
}, tn = ()=>!!globalThis.Deno, rn = ()=>typeof globalThis.Netlify == "object", sn = ()=>typeof globalThis.EdgeRuntime == "object", on = ()=>{
    var e;
    return ((e = globalThis.navigator) == null ? void 0 : e.userAgent) === "Cloudflare-Workers";
};
function un() {
    var i;
    return (i = [
        [
            rn,
            "netlify"
        ],
        [
            sn,
            "edge-light"
        ],
        [
            on,
            "workerd"
        ],
        [
            tn,
            "deno"
        ],
        [
            nn,
            "bun"
        ],
        [
            en,
            "node"
        ]
    ].flatMap((t)=>t[0]() ? [
            t[1]
        ] : []).at(0)) != null ? i : "";
}
var fn = {
    node: "Node.js",
    workerd: "Cloudflare Workers",
    deno: "Deno and Deno Deploy",
    netlify: "Netlify Edge Functions",
    "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)"
};
function _e() {
    let e = un();
    return {
        id: e,
        prettyName: fn[e] || e,
        isEdge: [
            "workerd",
            "deno",
            "netlify",
            "edge-light"
        ].includes(e)
    };
}
var V = 9e15, H = 1e9, Se = "0123456789abcdef", se = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", oe = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", Me = {
    precision: 20,
    rounding: 4,
    modulo: 1,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -V,
    maxE: V,
    crypto: !1
}, Le, Z, w = !0, fe = "[DecimalError] ", $ = fe + "Invalid argument: ", Ie = fe + "Precision limit exceeded", Ze = fe + "crypto unavailable", Ue = "[object Decimal]", R = Math.floor, C = Math.pow, cn = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, ln = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, an = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, Be = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, D = 1e7, m = 7, dn = 9007199254740991, hn = se.length - 1, Ce = oe.length - 1, h = {
    toStringTag: Ue
};
h.absoluteValue = h.abs = function() {
    var e = new this.constructor(this);
    return e.s < 0 && (e.s = 1), p(e);
};
h.ceil = function() {
    return p(new this.constructor(this), this.e + 1, 2);
};
h.clampedTo = h.clamp = function(e, n) {
    var i, t = this, r = t.constructor;
    if (e = new r(e), n = new r(n), !e.s || !n.s) return new r(NaN);
    if (e.gt(n)) throw Error($ + n);
    return i = t.cmp(e), i < 0 ? e : t.cmp(n) > 0 ? n : new r(t);
};
h.comparedTo = h.cmp = function(e) {
    var n, i, t, r, s = this, o = s.d, u = (e = new s.constructor(e)).d, c = s.s, f = e.s;
    if (!o || !u) return !c || !f ? NaN : c !== f ? c : o === u ? 0 : !o ^ c < 0 ? 1 : -1;
    if (!o[0] || !u[0]) return o[0] ? c : u[0] ? -f : 0;
    if (c !== f) return c;
    if (s.e !== e.e) return s.e > e.e ^ c < 0 ? 1 : -1;
    for(t = o.length, r = u.length, n = 0, i = t < r ? t : r; n < i; ++n)if (o[n] !== u[n]) return o[n] > u[n] ^ c < 0 ? 1 : -1;
    return t === r ? 0 : t > r ^ c < 0 ? 1 : -1;
};
h.cosine = h.cos = function() {
    var e, n, i = this, t = i.constructor;
    return i.d ? i.d[0] ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = pn(t, We(t, i)), t.precision = e, t.rounding = n, p(Z == 2 || Z == 3 ? i.neg() : i, e, n, !0)) : new t(1) : new t(NaN);
};
h.cubeRoot = h.cbrt = function() {
    var e, n, i, t, r, s, o, u, c, f, l = this, a = l.constructor;
    if (!l.isFinite() || l.isZero()) return new a(l);
    for(w = !1, s = l.s * C(l.s * l, 1 / 3), !s || Math.abs(s) == 1 / 0 ? (i = b(l.d), e = l.e, (s = (e - i.length + 1) % 3) && (i += s == 1 || s == -2 ? "0" : "00"), s = C(i, 1 / 3), e = R((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), s == 1 / 0 ? i = "5e" + e : (i = s.toExponential(), i = i.slice(0, i.indexOf("e") + 1) + e), t = new a(i), t.s = l.s) : t = new a(s.toString()), o = (e = a.precision) + 3;;)if (u = t, c = u.times(u).times(u), f = c.plus(l), t = k(f.plus(l).times(u), f.plus(c), o + 2, 1), b(u.d).slice(0, o) === (i = b(t.d)).slice(0, o)) if (i = i.slice(o - 3, o + 1), i == "9999" || !r && i == "4999") {
        if (!r && (p(u, e + 1, 0), u.times(u).times(u).eq(l))) {
            t = u;
            break;
        }
        o += 4, r = 1;
    } else {
        (!+i || !+i.slice(1) && i.charAt(0) == "5") && (p(t, e + 1, 1), n = !t.times(t).times(t).eq(l));
        break;
    }
    return w = !0, p(t, e, a.rounding, n);
};
h.decimalPlaces = h.dp = function() {
    var e, n = this.d, i = NaN;
    if (n) {
        if (e = n.length - 1, i = (e - R(this.e / m)) * m, e = n[e], e) for(; e % 10 == 0; e /= 10)i--;
        i < 0 && (i = 0);
    }
    return i;
};
h.dividedBy = h.div = function(e) {
    return k(this, new this.constructor(e));
};
h.dividedToIntegerBy = h.divToInt = function(e) {
    var n = this, i = n.constructor;
    return p(k(n, new i(e), 0, 1, 1), i.precision, i.rounding);
};
h.equals = h.eq = function(e) {
    return this.cmp(e) === 0;
};
h.floor = function() {
    return p(new this.constructor(this), this.e + 1, 3);
};
h.greaterThan = h.gt = function(e) {
    return this.cmp(e) > 0;
};
h.greaterThanOrEqualTo = h.gte = function(e) {
    var n = this.cmp(e);
    return n == 1 || n === 0;
};
h.hyperbolicCosine = h.cosh = function() {
    var e, n, i, t, r, s = this, o = s.constructor, u = new o(1);
    if (!s.isFinite()) return new o(s.s ? 1 / 0 : NaN);
    if (s.isZero()) return u;
    i = o.precision, t = o.rounding, o.precision = i + Math.max(s.e, s.sd()) + 4, o.rounding = 1, r = s.d.length, r < 32 ? (e = Math.ceil(r / 3), n = (1 / le(4, e)).toString()) : (e = 16, n = "2.3283064365386962890625e-10"), s = j(o, 1, s.times(n), new o(1), !0);
    for(var c, f = e, l = new o(8); f--;)c = s.times(s), s = u.minus(c.times(l.minus(c.times(l))));
    return p(s, o.precision = i, o.rounding = t, !0);
};
h.hyperbolicSine = h.sinh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    if (!r.isFinite() || r.isZero()) return new s(r);
    if (n = s.precision, i = s.rounding, s.precision = n + Math.max(r.e, r.sd()) + 4, s.rounding = 1, t = r.d.length, t < 3) r = j(s, 2, r, r, !0);
    else {
        e = 1.4 * Math.sqrt(t), e = e > 16 ? 16 : e | 0, r = r.times(1 / le(5, e)), r = j(s, 2, r, r, !0);
        for(var o, u = new s(5), c = new s(16), f = new s(20); e--;)o = r.times(r), r = r.times(u.plus(o.times(c.times(o).plus(f))));
    }
    return s.precision = n, s.rounding = i, p(r, n, i, !0);
};
h.hyperbolicTangent = h.tanh = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 7, t.rounding = 1, k(i.sinh(), i.cosh(), t.precision = e, t.rounding = n)) : new t(i.s);
};
h.inverseCosine = h.acos = function() {
    var e = this, n = e.constructor, i = e.abs().cmp(1), t = n.precision, r = n.rounding;
    return i !== -1 ? i === 0 ? e.isNeg() ? F(n, t, r) : new n(0) : new n(NaN) : e.isZero() ? F(n, t + 4, r).times(.5) : (n.precision = t + 6, n.rounding = 1, e = new n(1).minus(e).div(e.plus(1)).sqrt().atan(), n.precision = t, n.rounding = r, e.times(2));
};
h.inverseHyperbolicCosine = h.acosh = function() {
    var e, n, i = this, t = i.constructor;
    return i.lte(1) ? new t(i.eq(1) ? 0 : NaN) : i.isFinite() ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(Math.abs(i.e), i.sd()) + 4, t.rounding = 1, w = !1, i = i.times(i).minus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln()) : new t(i);
};
h.inverseHyperbolicSine = h.asinh = function() {
    var e, n, i = this, t = i.constructor;
    return !i.isFinite() || i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 2 * Math.max(Math.abs(i.e), i.sd()) + 6, t.rounding = 1, w = !1, i = i.times(i).plus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln());
};
h.inverseHyperbolicTangent = h.atanh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isFinite() ? r.e >= 0 ? new s(r.abs().eq(1) ? r.s / 0 : r.isZero() ? r : NaN) : (e = s.precision, n = s.rounding, t = r.sd(), Math.max(t, e) < 2 * -r.e - 1 ? p(new s(r), e, n, !0) : (s.precision = i = t - r.e, r = k(r.plus(1), new s(1).minus(r), i + e, 1), s.precision = e + 4, s.rounding = 1, r = r.ln(), s.precision = e, s.rounding = n, r.times(.5))) : new s(NaN);
};
h.inverseSine = h.asin = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isZero() ? new s(r) : (n = r.abs().cmp(1), i = s.precision, t = s.rounding, n !== -1 ? n === 0 ? (e = F(s, i + 4, t).times(.5), e.s = r.s, e) : new s(NaN) : (s.precision = i + 6, s.rounding = 1, r = r.div(new s(1).minus(r.times(r)).sqrt().plus(1)).atan(), s.precision = i, s.rounding = t, r.times(2)));
};
h.inverseTangent = h.atan = function() {
    var e, n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding;
    if (f.isFinite()) {
        if (f.isZero()) return new l(f);
        if (f.abs().eq(1) && a + 4 <= Ce) return o = F(l, a + 4, d).times(.25), o.s = f.s, o;
    } else {
        if (!f.s) return new l(NaN);
        if (a + 4 <= Ce) return o = F(l, a + 4, d).times(.5), o.s = f.s, o;
    }
    for(l.precision = u = a + 10, l.rounding = 1, i = Math.min(28, u / m + 2 | 0), e = i; e; --e)f = f.div(f.times(f).plus(1).sqrt().plus(1));
    for(w = !1, n = Math.ceil(u / m), t = 1, c = f.times(f), o = new l(f), r = f; e !== -1;)if (r = r.times(c), s = o.minus(r.div(t += 2)), r = r.times(c), o = s.plus(r.div(t += 2)), o.d[n] !== void 0) for(e = n; o.d[e] === s.d[e] && e--;);
    return i && (o = o.times(2 << i - 1)), w = !0, p(o, l.precision = a, l.rounding = d, !0);
};
h.isFinite = function() {
    return !!this.d;
};
h.isInteger = h.isInt = function() {
    return !!this.d && R(this.e / m) > this.d.length - 2;
};
h.isNaN = function() {
    return !this.s;
};
h.isNegative = h.isNeg = function() {
    return this.s < 0;
};
h.isPositive = h.isPos = function() {
    return this.s > 0;
};
h.isZero = function() {
    return !!this.d && this.d[0] === 0;
};
h.lessThan = h.lt = function(e) {
    return this.cmp(e) < 0;
};
h.lessThanOrEqualTo = h.lte = function(e) {
    return this.cmp(e) < 1;
};
h.logarithm = h.log = function(e) {
    var n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding, g = 5;
    if (e == null) e = new l(10), n = !0;
    else {
        if (e = new l(e), i = e.d, e.s < 0 || !i || !i[0] || e.eq(1)) return new l(NaN);
        n = e.eq(10);
    }
    if (i = f.d, f.s < 0 || !i || !i[0] || f.eq(1)) return new l(i && !i[0] ? -1 / 0 : f.s != 1 ? NaN : i ? 0 : 1 / 0);
    if (n) if (i.length > 1) s = !0;
    else {
        for(r = i[0]; r % 10 === 0;)r /= 10;
        s = r !== 1;
    }
    if (w = !1, u = a + g, o = B(f, u), t = n ? ue(l, u + 10) : B(e, u), c = k(o, t, u, 1), Q(c.d, r = a, d)) do if (u += 10, o = B(f, u), t = n ? ue(l, u + 10) : B(e, u), c = k(o, t, u, 1), !s) {
        +b(c.d).slice(r + 1, r + 15) + 1 == 1e14 && (c = p(c, a + 1, 0));
        break;
    }
    while (Q(c.d, r += 10, d))
    return w = !0, p(c, a, d);
};
h.minus = h.sub = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.constructor;
    if (e = new v(e), !g.d || !e.d) return !g.s || !e.s ? e = new v(NaN) : g.d ? e.s = -e.s : e = new v(e.d || g.s !== e.s ? g : NaN), e;
    if (g.s != e.s) return e.s = -e.s, g.plus(e);
    if (f = g.d, d = e.d, u = v.precision, c = v.rounding, !f[0] || !d[0]) {
        if (d[0]) e.s = -e.s;
        else if (f[0]) e = new v(g);
        else return new v(c === 3 ? -0 : 0);
        return w ? p(e, u, c) : e;
    }
    if (i = R(e.e / m), l = R(g.e / m), f = f.slice(), s = l - i, s) {
        for(a = s < 0, a ? (n = f, s = -s, o = d.length) : (n = d, i = l, o = f.length), t = Math.max(Math.ceil(u / m), o) + 2, s > t && (s = t, n.length = 1), n.reverse(), t = s; t--;)n.push(0);
        n.reverse();
    } else {
        for(t = f.length, o = d.length, a = t < o, a && (o = t), t = 0; t < o; t++)if (f[t] != d[t]) {
            a = f[t] < d[t];
            break;
        }
        s = 0;
    }
    for(a && (n = f, f = d, d = n, e.s = -e.s), o = f.length, t = d.length - o; t > 0; --t)f[o++] = 0;
    for(t = d.length; t > s;){
        if (f[--t] < d[t]) {
            for(r = t; r && f[--r] === 0;)f[r] = D - 1;
            --f[r], f[t] += D;
        }
        f[t] -= d[t];
    }
    for(; f[--o] === 0;)f.pop();
    for(; f[0] === 0; f.shift())--i;
    return f[0] ? (e.d = f, e.e = ce(f, i), w ? p(e, u, c) : e) : new v(c === 3 ? -0 : 0);
};
h.modulo = h.mod = function(e) {
    var n, i = this, t = i.constructor;
    return e = new t(e), !i.d || !e.s || e.d && !e.d[0] ? new t(NaN) : !e.d || i.d && !i.d[0] ? p(new t(i), t.precision, t.rounding) : (w = !1, t.modulo == 9 ? (n = k(i, e.abs(), 0, 3, 1), n.s *= e.s) : n = k(i, e, 0, t.modulo, 1), n = n.times(e), w = !0, i.minus(n));
};
h.naturalExponential = h.exp = function() {
    return be(this);
};
h.naturalLogarithm = h.ln = function() {
    return B(this);
};
h.negated = h.neg = function() {
    var e = new this.constructor(this);
    return e.s = -e.s, p(e);
};
h.plus = h.add = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a = this, d = a.constructor;
    if (e = new d(e), !a.d || !e.d) return !a.s || !e.s ? e = new d(NaN) : a.d || (e = new d(e.d || a.s === e.s ? a : NaN)), e;
    if (a.s != e.s) return e.s = -e.s, a.minus(e);
    if (f = a.d, l = e.d, u = d.precision, c = d.rounding, !f[0] || !l[0]) return l[0] || (e = new d(a)), w ? p(e, u, c) : e;
    if (s = R(a.e / m), t = R(e.e / m), f = f.slice(), r = s - t, r) {
        for(r < 0 ? (i = f, r = -r, o = l.length) : (i = l, t = s, o = f.length), s = Math.ceil(u / m), o = s > o ? s + 1 : o + 1, r > o && (r = o, i.length = 1), i.reverse(); r--;)i.push(0);
        i.reverse();
    }
    for(o = f.length, r = l.length, o - r < 0 && (r = o, i = l, l = f, f = i), n = 0; r;)n = (f[--r] = f[r] + l[r] + n) / D | 0, f[r] %= D;
    for(n && (f.unshift(n), ++t), o = f.length; f[--o] == 0;)f.pop();
    return e.d = f, e.e = ce(f, t), w ? p(e, u, c) : e;
};
h.precision = h.sd = function(e) {
    var n, i = this;
    if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error($ + e);
    return i.d ? (n = $e(i.d), e && i.e + 1 > n && (n = i.e + 1)) : n = NaN, n;
};
h.round = function() {
    var e = this, n = e.constructor;
    return p(new n(e), e.e + 1, n.rounding);
};
h.sine = h.sin = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = mn(t, We(t, i)), t.precision = e, t.rounding = n, p(Z > 2 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.squareRoot = h.sqrt = function() {
    var e, n, i, t, r, s, o = this, u = o.d, c = o.e, f = o.s, l = o.constructor;
    if (f !== 1 || !u || !u[0]) return new l(!f || f < 0 && (!u || u[0]) ? NaN : u ? o : 1 / 0);
    for(w = !1, f = Math.sqrt(+o), f == 0 || f == 1 / 0 ? (n = b(u), (n.length + c) % 2 == 0 && (n += "0"), f = Math.sqrt(n), c = R((c + 1) / 2) - (c < 0 || c % 2), f == 1 / 0 ? n = "5e" + c : (n = f.toExponential(), n = n.slice(0, n.indexOf("e") + 1) + c), t = new l(n)) : t = new l(f.toString()), i = (c = l.precision) + 3;;)if (s = t, t = s.plus(k(o, s, i + 2, 1)).times(.5), b(s.d).slice(0, i) === (n = b(t.d)).slice(0, i)) if (n = n.slice(i - 3, i + 1), n == "9999" || !r && n == "4999") {
        if (!r && (p(s, c + 1, 0), s.times(s).eq(o))) {
            t = s;
            break;
        }
        i += 4, r = 1;
    } else {
        (!+n || !+n.slice(1) && n.charAt(0) == "5") && (p(t, c + 1, 1), e = !t.times(t).eq(o));
        break;
    }
    return w = !0, p(t, c, l.rounding, e);
};
h.tangent = h.tan = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 10, t.rounding = 1, i = i.sin(), i.s = 1, i = k(i, new t(1).minus(i.times(i)).sqrt(), e + 10, 0), t.precision = e, t.rounding = n, p(Z == 2 || Z == 4 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.times = h.mul = function(e) {
    var n, i, t, r, s, o, u, c, f, l = this, a = l.constructor, d = l.d, g = (e = new a(e)).d;
    if (e.s *= l.s, !d || !d[0] || !g || !g[0]) return new a(!e.s || d && !d[0] && !g || g && !g[0] && !d ? NaN : !d || !g ? e.s / 0 : e.s * 0);
    for(i = R(l.e / m) + R(e.e / m), c = d.length, f = g.length, c < f && (s = d, d = g, g = s, o = c, c = f, f = o), s = [], o = c + f, t = o; t--;)s.push(0);
    for(t = f; --t >= 0;){
        for(n = 0, r = c + t; r > t;)u = s[r] + g[t] * d[r - t - 1] + n, s[r--] = u % D | 0, n = u / D | 0;
        s[r] = (s[r] + n) % D | 0;
    }
    for(; !s[--o];)s.pop();
    return n ? ++i : s.shift(), e.d = s, e.e = ce(s, i), w ? p(e, a.precision, a.rounding) : e;
};
h.toBinary = function(e, n) {
    return Pe(this, 2, e, n);
};
h.toDecimalPlaces = h.toDP = function(e, n) {
    var i = this, t = i.constructor;
    return i = new t(i), e === void 0 ? i : (q(e, 0, H), n === void 0 ? n = t.rounding : q(n, 0, 8), p(i, e + i.e + 1, n));
};
h.toExponential = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, !0) : (q(e, 0, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e + 1, n), i = L(t, !0, e + 1)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toFixed = function(e, n) {
    var i, t, r = this, s = r.constructor;
    return e === void 0 ? i = L(r) : (q(e, 0, H), n === void 0 ? n = s.rounding : q(n, 0, 8), t = p(new s(r), e + r.e + 1, n), i = L(t, !1, e + t.e + 1)), r.isNeg() && !r.isZero() ? "-" + i : i;
};
h.toFraction = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.d, N = g.constructor;
    if (!v) return new N(g);
    if (f = i = new N(1), t = c = new N(0), n = new N(t), s = n.e = $e(v) - g.e - 1, o = s % m, n.d[0] = C(10, o < 0 ? m + o : o), e == null) e = s > 0 ? n : f;
    else {
        if (u = new N(e), !u.isInt() || u.lt(f)) throw Error($ + u);
        e = u.gt(n) ? s > 0 ? n : f : u;
    }
    for(w = !1, u = new N(b(v)), l = N.precision, N.precision = s = v.length * m * 2; a = k(u, n, 0, 1, 1), r = i.plus(a.times(t)), r.cmp(e) != 1;)i = t, t = r, r = f, f = c.plus(a.times(r)), c = r, r = n, n = u.minus(a.times(r)), u = r;
    return r = k(e.minus(i), t, 0, 1, 1), c = c.plus(r.times(f)), i = i.plus(r.times(t)), c.s = f.s = g.s, d = k(f, t, s, 1).minus(g).abs().cmp(k(c, i, s, 1).minus(g).abs()) < 1 ? [
        f,
        t
    ] : [
        c,
        i
    ], N.precision = l, w = !0, d;
};
h.toHexadecimal = h.toHex = function(e, n) {
    return Pe(this, 16, e, n);
};
h.toNearest = function(e, n) {
    var i = this, t = i.constructor;
    if (i = new t(i), e == null) {
        if (!i.d) return i;
        e = new t(1), n = t.rounding;
    } else {
        if (e = new t(e), n === void 0 ? n = t.rounding : q(n, 0, 8), !i.d) return e.s ? i : e;
        if (!e.d) return e.s && (e.s = i.s), e;
    }
    return e.d[0] ? (w = !1, i = k(i, e, 0, n, 1).times(e), w = !0, p(i)) : (e.s = i.s, i = e), i;
};
h.toNumber = function() {
    return +this;
};
h.toOctal = function(e, n) {
    return Pe(this, 8, e, n);
};
h.toPower = h.pow = function(e) {
    var n, i, t, r, s, o, u = this, c = u.constructor, f = +(e = new c(e));
    if (!u.d || !e.d || !u.d[0] || !e.d[0]) return new c(C(+u, f));
    if (u = new c(u), u.eq(1)) return u;
    if (t = c.precision, s = c.rounding, e.eq(1)) return p(u, t, s);
    if (n = R(e.e / m), n >= e.d.length - 1 && (i = f < 0 ? -f : f) <= dn) return r = He(c, u, i, t), e.s < 0 ? new c(1).div(r) : p(r, t, s);
    if (o = u.s, o < 0) {
        if (n < e.d.length - 1) return new c(NaN);
        if ((e.d[n] & 1) == 0 && (o = 1), u.e == 0 && u.d[0] == 1 && u.d.length == 1) return u.s = o, u;
    }
    return i = C(+u, f), n = i == 0 || !isFinite(i) ? R(f * (Math.log("0." + b(u.d)) / Math.LN10 + u.e + 1)) : new c(i + "").e, n > c.maxE + 1 || n < c.minE - 1 ? new c(n > 0 ? o / 0 : 0) : (w = !1, c.rounding = u.s = 1, i = Math.min(12, (n + "").length), r = be(e.times(B(u, t + i)), t), r.d && (r = p(r, t + 5, 1), Q(r.d, t, s) && (n = t + 10, r = p(be(e.times(B(u, n + i)), n), n + 5, 1), +b(r.d).slice(t + 1, t + 15) + 1 == 1e14 && (r = p(r, t + 1, 0)))), r.s = o, w = !0, c.rounding = s, p(r, t, s));
};
h.toPrecision = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, t.e <= r.toExpNeg || t.e >= r.toExpPos) : (q(e, 1, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e, n), i = L(t, e <= t.e || t.e <= r.toExpNeg, e)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toSignificantDigits = h.toSD = function(e, n) {
    var i = this, t = i.constructor;
    return e === void 0 ? (e = t.precision, n = t.rounding) : (q(e, 1, H), n === void 0 ? n = t.rounding : q(n, 0, 8)), p(new t(i), e, n);
};
h.toString = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() && !e.isZero() ? "-" + i : i;
};
h.truncated = h.trunc = function() {
    return p(new this.constructor(this), this.e + 1, 1);
};
h.valueOf = h.toJSON = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() ? "-" + i : i;
};
function b(e) {
    var n, i, t, r = e.length - 1, s = "", o = e[0];
    if (r > 0) {
        for(s += o, n = 1; n < r; n++)t = e[n] + "", i = m - t.length, i && (s += U(i)), s += t;
        o = e[n], t = o + "", i = m - t.length, i && (s += U(i));
    } else if (o === 0) return "0";
    for(; o % 10 === 0;)o /= 10;
    return s + o;
}
function q(e, n, i) {
    if (e !== ~~e || e < n || e > i) throw Error($ + e);
}
function Q(e, n, i, t) {
    var r, s, o, u;
    for(s = e[0]; s >= 10; s /= 10)--n;
    return --n < 0 ? (n += m, r = 0) : (r = Math.ceil((n + 1) / m), n %= m), s = C(10, m - n), u = e[r] % s | 0, t == null ? n < 3 ? (n == 0 ? u = u / 100 | 0 : n == 1 && (u = u / 10 | 0), o = i < 4 && u == 99999 || i > 3 && u == 49999 || u == 5e4 || u == 0) : o = (i < 4 && u + 1 == s || i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 100 | 0) == C(10, n - 2) - 1 || (u == s / 2 || u == 0) && (e[r + 1] / s / 100 | 0) == 0 : n < 4 ? (n == 0 ? u = u / 1e3 | 0 : n == 1 ? u = u / 100 | 0 : n == 2 && (u = u / 10 | 0), o = (t || i < 4) && u == 9999 || !t && i > 3 && u == 4999) : o = ((t || i < 4) && u + 1 == s || !t && i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 1e3 | 0) == C(10, n - 3) - 1, o;
}
function te(e, n, i) {
    for(var t, r = [
        0
    ], s, o = 0, u = e.length; o < u;){
        for(s = r.length; s--;)r[s] *= n;
        for(r[0] += Se.indexOf(e.charAt(o++)), t = 0; t < r.length; t++)r[t] > i - 1 && (r[t + 1] === void 0 && (r[t + 1] = 0), r[t + 1] += r[t] / i | 0, r[t] %= i);
    }
    return r.reverse();
}
function pn(e, n) {
    var i, t, r;
    if (n.isZero()) return n;
    t = n.d.length, t < 32 ? (i = Math.ceil(t / 3), r = (1 / le(4, i)).toString()) : (i = 16, r = "2.3283064365386962890625e-10"), e.precision += i, n = j(e, 1, n.times(r), new e(1));
    for(var s = i; s--;){
        var o = n.times(n);
        n = o.times(o).minus(o).times(8).plus(1);
    }
    return e.precision -= i, n;
}
var k = function() {
    function e(t, r, s) {
        var o, u = 0, c = t.length;
        for(t = t.slice(); c--;)o = t[c] * r + u, t[c] = o % s | 0, u = o / s | 0;
        return u && t.unshift(u), t;
    }
    function n(t, r, s, o) {
        var u, c;
        if (s != o) c = s > o ? 1 : -1;
        else for(u = c = 0; u < s; u++)if (t[u] != r[u]) {
            c = t[u] > r[u] ? 1 : -1;
            break;
        }
        return c;
    }
    function i(t, r, s, o) {
        for(var u = 0; s--;)t[s] -= u, u = t[s] < r[s] ? 1 : 0, t[s] = u * o + t[s] - r[s];
        for(; !t[0] && t.length > 1;)t.shift();
    }
    return function(t, r, s, o, u, c) {
        var f, l, a, d, g, v, N, A, M, _, E, P, x, I, ae, z, W, de, T, y, ee = t.constructor, he = t.s == r.s ? 1 : -1, O = t.d, S = r.d;
        if (!O || !O[0] || !S || !S[0]) return new ee(!t.s || !r.s || (O ? S && O[0] == S[0] : !S) ? NaN : O && O[0] == 0 || !S ? he * 0 : he / 0);
        for(c ? (g = 1, l = t.e - r.e) : (c = D, g = m, l = R(t.e / g) - R(r.e / g)), T = S.length, W = O.length, M = new ee(he), _ = M.d = [], a = 0; S[a] == (O[a] || 0); a++);
        if (S[a] > (O[a] || 0) && l--, s == null ? (I = s = ee.precision, o = ee.rounding) : u ? I = s + (t.e - r.e) + 1 : I = s, I < 0) _.push(1), v = !0;
        else {
            if (I = I / g + 2 | 0, a = 0, T == 1) {
                for(d = 0, S = S[0], I++; (a < W || d) && I--; a++)ae = d * c + (O[a] || 0), _[a] = ae / S | 0, d = ae % S | 0;
                v = d || a < W;
            } else {
                for(d = c / (S[0] + 1) | 0, d > 1 && (S = e(S, d, c), O = e(O, d, c), T = S.length, W = O.length), z = T, E = O.slice(0, T), P = E.length; P < T;)E[P++] = 0;
                y = S.slice(), y.unshift(0), de = S[0], S[1] >= c / 2 && ++de;
                do d = 0, f = n(S, E, T, P), f < 0 ? (x = E[0], T != P && (x = x * c + (E[1] || 0)), d = x / de | 0, d > 1 ? (d >= c && (d = c - 1), N = e(S, d, c), A = N.length, P = E.length, f = n(N, E, A, P), f == 1 && (d--, i(N, T < A ? y : S, A, c))) : (d == 0 && (f = d = 1), N = S.slice()), A = N.length, A < P && N.unshift(0), i(E, N, P, c), f == -1 && (P = E.length, f = n(S, E, T, P), f < 1 && (d++, i(E, T < P ? y : S, P, c))), P = E.length) : f === 0 && (d++, E = [
                    0
                ]), _[a++] = d, f && E[0] ? E[P++] = O[z] || 0 : (E = [
                    O[z]
                ], P = 1);
                while ((z++ < W || E[0] !== void 0) && I--)
                v = E[0] !== void 0;
            }
            _[0] || _.shift();
        }
        if (g == 1) M.e = l, Le = v;
        else {
            for(a = 1, d = _[0]; d >= 10; d /= 10)a++;
            M.e = a + l * g - 1, p(M, u ? s + M.e + 1 : s, o, v);
        }
        return M;
    };
}();
function p(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor;
    e: if (n != null) {
        if (a = e.d, !a) return e;
        for(r = 1, u = a[0]; u >= 10; u /= 10)r++;
        if (s = n - r, s < 0) s += m, o = n, l = a[d = 0], c = l / C(10, r - o - 1) % 10 | 0;
        else if (d = Math.ceil((s + 1) / m), u = a.length, d >= u) if (t) {
            for(; u++ <= d;)a.push(0);
            l = c = 0, r = 1, s %= m, o = s - m + 1;
        } else break e;
        else {
            for(l = u = a[d], r = 1; u >= 10; u /= 10)r++;
            s %= m, o = s - m + r, c = o < 0 ? 0 : l / C(10, r - o - 1) % 10 | 0;
        }
        if (t = t || n < 0 || a[d + 1] !== void 0 || (o < 0 ? l : l % C(10, r - o - 1)), f = i < 4 ? (c || t) && (i == 0 || i == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (i == 4 || t || i == 6 && (s > 0 ? o > 0 ? l / C(10, r - o) : 0 : a[d - 1]) % 10 & 1 || i == (e.s < 0 ? 8 : 7)), n < 1 || !a[0]) return a.length = 0, f ? (n -= e.e + 1, a[0] = C(10, (m - n % m) % m), e.e = -n || 0) : a[0] = e.e = 0, e;
        if (s == 0 ? (a.length = d, u = 1, d--) : (a.length = d + 1, u = C(10, m - s), a[d] = o > 0 ? (l / C(10, r - o) % C(10, o) | 0) * u : 0), f) for(;;)if (d == 0) {
            for(s = 1, o = a[0]; o >= 10; o /= 10)s++;
            for(o = a[0] += u, u = 1; o >= 10; o /= 10)u++;
            s != u && (e.e++, a[0] == D && (a[0] = 1));
            break;
        } else {
            if (a[d] += u, a[d] != D) break;
            a[d--] = 0, u = 1;
        }
        for(s = a.length; a[--s] === 0;)a.pop();
    }
    return w && (e.e > g.maxE ? (e.d = null, e.e = NaN) : e.e < g.minE && (e.e = 0, e.d = [
        0
    ])), e;
}
function L(e, n, i) {
    if (!e.isFinite()) return je(e);
    var t, r = e.e, s = b(e.d), o = s.length;
    return n ? (i && (t = i - o) > 0 ? s = s.charAt(0) + "." + s.slice(1) + U(t) : o > 1 && (s = s.charAt(0) + "." + s.slice(1)), s = s + (e.e < 0 ? "e" : "e+") + e.e) : r < 0 ? (s = "0." + U(-r - 1) + s, i && (t = i - o) > 0 && (s += U(t))) : r >= o ? (s += U(r + 1 - o), i && (t = i - r - 1) > 0 && (s = s + "." + U(t))) : ((t = r + 1) < o && (s = s.slice(0, t) + "." + s.slice(t)), i && (t = i - o) > 0 && (r + 1 === o && (s += "."), s += U(t))), s;
}
function ce(e, n) {
    var i = e[0];
    for(n *= m; i >= 10; i /= 10)n++;
    return n;
}
function ue(e, n, i) {
    if (n > hn) throw w = !0, i && (e.precision = i), Error(Ie);
    return p(new e(se), n, 1, !0);
}
function F(e, n, i) {
    if (n > Ce) throw Error(Ie);
    return p(new e(oe), n, i, !0);
}
function $e(e) {
    var n = e.length - 1, i = n * m + 1;
    if (n = e[n], n) {
        for(; n % 10 == 0; n /= 10)i--;
        for(n = e[0]; n >= 10; n /= 10)i++;
    }
    return i;
}
function U(e) {
    for(var n = ""; e--;)n += "0";
    return n;
}
function He(e, n, i, t) {
    var r, s = new e(1), o = Math.ceil(t / m + 4);
    for(w = !1;;){
        if (i % 2 && (s = s.times(n), De(s.d, o) && (r = !0)), i = R(i / 2), i === 0) {
            i = s.d.length - 1, r && s.d[i] === 0 && ++s.d[i];
            break;
        }
        n = n.times(n), De(n.d, o);
    }
    return w = !0, s;
}
function Te(e) {
    return e.d[e.d.length - 1] & 1;
}
function Ve(e, n, i) {
    for(var t, r, s = new e(n[0]), o = 0; ++o < n.length;){
        if (r = new e(n[o]), !r.s) {
            s = r;
            break;
        }
        t = s.cmp(r), (t === i || t === 0 && s.s === i) && (s = r);
    }
    return s;
}
function be(e, n) {
    var i, t, r, s, o, u, c, f = 0, l = 0, a = 0, d = e.constructor, g = d.rounding, v = d.precision;
    if (!e.d || !e.d[0] || e.e > 17) return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
    for(n == null ? (w = !1, c = v) : c = n, u = new d(.03125); e.e > -2;)e = e.times(u), a += 5;
    for(t = Math.log(C(2, a)) / Math.LN10 * 2 + 5 | 0, c += t, i = s = o = new d(1), d.precision = c;;){
        if (s = p(s.times(e), c, 1), i = i.times(++l), u = o.plus(k(s, i, c, 1)), b(u.d).slice(0, c) === b(o.d).slice(0, c)) {
            for(r = a; r--;)o = p(o.times(o), c, 1);
            if (n == null) if (f < 3 && Q(o.d, c - t, g, f)) d.precision = c += 10, i = s = u = new d(1), l = 0, f++;
            else return p(o, d.precision = v, g, w = !0);
            else return d.precision = v, o;
        }
        o = u;
    }
}
function B(e, n) {
    var i, t, r, s, o, u, c, f, l, a, d, g = 1, v = 10, N = e, A = N.d, M = N.constructor, _ = M.rounding, E = M.precision;
    if (N.s < 0 || !A || !A[0] || !N.e && A[0] == 1 && A.length == 1) return new M(A && !A[0] ? -1 / 0 : N.s != 1 ? NaN : A ? 0 : N);
    if (n == null ? (w = !1, l = E) : l = n, M.precision = l += v, i = b(A), t = i.charAt(0), Math.abs(s = N.e) < 15e14) {
        for(; t < 7 && t != 1 || t == 1 && i.charAt(1) > 3;)N = N.times(e), i = b(N.d), t = i.charAt(0), g++;
        s = N.e, t > 1 ? (N = new M("0." + i), s++) : N = new M(t + "." + i.slice(1));
    } else return f = ue(M, l + 2, E).times(s + ""), N = B(new M(t + "." + i.slice(1)), l - v).plus(f), M.precision = E, n == null ? p(N, E, _, w = !0) : N;
    for(a = N, c = o = N = k(N.minus(1), N.plus(1), l, 1), d = p(N.times(N), l, 1), r = 3;;){
        if (o = p(o.times(d), l, 1), f = c.plus(k(o, new M(r), l, 1)), b(f.d).slice(0, l) === b(c.d).slice(0, l)) if (c = c.times(2), s !== 0 && (c = c.plus(ue(M, l + 2, E).times(s + ""))), c = k(c, new M(g), l, 1), n == null) if (Q(c.d, l - v, _, u)) M.precision = l += v, f = o = N = k(a.minus(1), a.plus(1), l, 1), d = p(N.times(N), l, 1), r = u = 1;
        else return p(c, M.precision = E, _, w = !0);
        else return M.precision = E, c;
        c = f, r += 2;
    }
}
function je(e) {
    return String(e.s * e.s / 0);
}
function re(e, n) {
    var i, t, r;
    for((i = n.indexOf(".")) > -1 && (n = n.replace(".", "")), (t = n.search(/e/i)) > 0 ? (i < 0 && (i = t), i += +n.slice(t + 1), n = n.substring(0, t)) : i < 0 && (i = n.length), t = 0; n.charCodeAt(t) === 48; t++);
    for(r = n.length; n.charCodeAt(r - 1) === 48; --r);
    if (n = n.slice(t, r), n) {
        if (r -= t, e.e = i = i - t - 1, e.d = [], t = (i + 1) % m, i < 0 && (t += m), t < r) {
            for(t && e.d.push(+n.slice(0, t)), r -= m; t < r;)e.d.push(+n.slice(t, t += m));
            n = n.slice(t), t = m - n.length;
        } else t -= r;
        for(; t--;)n += "0";
        e.d.push(+n), w && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [
            0
        ]));
    } else e.e = 0, e.d = [
        0
    ];
    return e;
}
function gn(e, n) {
    var i, t, r, s, o, u, c, f, l;
    if (n.indexOf("_") > -1) {
        if (n = n.replace(/(\d)_(?=\d)/g, "$1"), Be.test(n)) return re(e, n);
    } else if (n === "Infinity" || n === "NaN") return +n || (e.s = NaN), e.e = NaN, e.d = null, e;
    if (ln.test(n)) i = 16, n = n.toLowerCase();
    else if (cn.test(n)) i = 2;
    else if (an.test(n)) i = 8;
    else throw Error($ + n);
    for(s = n.search(/p/i), s > 0 ? (c = +n.slice(s + 1), n = n.substring(2, s)) : n = n.slice(2), s = n.indexOf("."), o = s >= 0, t = e.constructor, o && (n = n.replace(".", ""), u = n.length, s = u - s, r = He(t, new t(i), s, s * 2)), f = te(n, i, D), l = f.length - 1, s = l; f[s] === 0; --s)f.pop();
    return s < 0 ? new t(e.s * 0) : (e.e = ce(f, l), e.d = f, w = !1, o && (e = k(e, r, u * 4)), c && (e = e.times(Math.abs(c) < 54 ? C(2, c) : Y.pow(2, c))), w = !0, e);
}
function mn(e, n) {
    var i, t = n.d.length;
    if (t < 3) return n.isZero() ? n : j(e, 2, n, n);
    i = 1.4 * Math.sqrt(t), i = i > 16 ? 16 : i | 0, n = n.times(1 / le(5, i)), n = j(e, 2, n, n);
    for(var r, s = new e(5), o = new e(16), u = new e(20); i--;)r = n.times(n), n = n.times(s.plus(r.times(o.times(r).minus(u))));
    return n;
}
function j(e, n, i, t, r) {
    var s, o, u, c, f = 1, l = e.precision, a = Math.ceil(l / m);
    for(w = !1, c = i.times(i), u = new e(t);;){
        if (o = k(u.times(c), new e(n++ * n++), l, 1), u = r ? t.plus(o) : t.minus(o), t = k(o.times(c), new e(n++ * n++), l, 1), o = u.plus(t), o.d[a] !== void 0) {
            for(s = a; o.d[s] === u.d[s] && s--;);
            if (s == -1) break;
        }
        s = u, u = t, t = o, o = s, f++;
    }
    return w = !0, o.d.length = a + 1, o;
}
function le(e, n) {
    for(var i = e; --n;)i *= e;
    return i;
}
function We(e, n) {
    var i, t = n.s < 0, r = F(e, e.precision, 1), s = r.times(.5);
    if (n = n.abs(), n.lte(s)) return Z = t ? 4 : 1, n;
    if (i = n.divToInt(r), i.isZero()) Z = t ? 3 : 2;
    else {
        if (n = n.minus(i.times(r)), n.lte(s)) return Z = Te(i) ? t ? 2 : 3 : t ? 4 : 1, n;
        Z = Te(i) ? t ? 1 : 4 : t ? 3 : 2;
    }
    return n.minus(r).abs();
}
function Pe(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor, v = i !== void 0;
    if (v ? (q(i, 1, H), t === void 0 ? t = g.rounding : q(t, 0, 8)) : (i = g.precision, t = g.rounding), !e.isFinite()) l = je(e);
    else {
        for(l = L(e), o = l.indexOf("."), v ? (r = 2, n == 16 ? i = i * 4 - 3 : n == 8 && (i = i * 3 - 2)) : r = n, o >= 0 && (l = l.replace(".", ""), d = new g(1), d.e = l.length - o, d.d = te(L(d), 10, r), d.e = d.d.length), a = te(l, 10, r), s = c = a.length; a[--c] == 0;)a.pop();
        if (!a[0]) l = v ? "0p+0" : "0";
        else {
            if (o < 0 ? s-- : (e = new g(e), e.d = a, e.e = s, e = k(e, d, i, t, 0, r), a = e.d, s = e.e, f = Le), o = a[i], u = r / 2, f = f || a[i + 1] !== void 0, f = t < 4 ? (o !== void 0 || f) && (t === 0 || t === (e.s < 0 ? 3 : 2)) : o > u || o === u && (t === 4 || f || t === 6 && a[i - 1] & 1 || t === (e.s < 0 ? 8 : 7)), a.length = i, f) for(; ++a[--i] > r - 1;)a[i] = 0, i || (++s, a.unshift(1));
            for(c = a.length; !a[c - 1]; --c);
            for(o = 0, l = ""; o < c; o++)l += Se.charAt(a[o]);
            if (v) {
                if (c > 1) if (n == 16 || n == 8) {
                    for(o = n == 16 ? 4 : 3, --c; c % o; c++)l += "0";
                    for(a = te(l, r, n), c = a.length; !a[c - 1]; --c);
                    for(o = 1, l = "1."; o < c; o++)l += Se.charAt(a[o]);
                } else l = l.charAt(0) + "." + l.slice(1);
                l = l + (s < 0 ? "p" : "p+") + s;
            } else if (s < 0) {
                for(; ++s;)l = "0" + l;
                l = "0." + l;
            } else if (++s > c) for(s -= c; s--;)l += "0";
            else s < c && (l = l.slice(0, s) + "." + l.slice(s));
        }
        l = (n == 16 ? "0x" : n == 2 ? "0b" : n == 8 ? "0o" : "") + l;
    }
    return e.s < 0 ? "-" + l : l;
}
function De(e, n) {
    if (e.length > n) return e.length = n, !0;
}
function wn(e) {
    return new this(e).abs();
}
function Nn(e) {
    return new this(e).acos();
}
function vn(e) {
    return new this(e).acosh();
}
function En(e, n) {
    return new this(e).plus(n);
}
function kn(e) {
    return new this(e).asin();
}
function Sn(e) {
    return new this(e).asinh();
}
function Mn(e) {
    return new this(e).atan();
}
function Cn(e) {
    return new this(e).atanh();
}
function bn(e, n) {
    e = new this(e), n = new this(n);
    var i, t = this.precision, r = this.rounding, s = t + 4;
    return !e.s || !n.s ? i = new this(NaN) : !e.d && !n.d ? (i = F(this, s, 1).times(n.s > 0 ? .25 : .75), i.s = e.s) : !n.d || e.isZero() ? (i = n.s < 0 ? F(this, t, r) : new this(0), i.s = e.s) : !e.d || n.isZero() ? (i = F(this, s, 1).times(.5), i.s = e.s) : n.s < 0 ? (this.precision = s, this.rounding = 1, i = this.atan(k(e, n, s, 1)), n = F(this, s, 1), this.precision = t, this.rounding = r, i = e.s < 0 ? i.minus(n) : i.plus(n)) : i = this.atan(k(e, n, s, 1)), i;
}
function Pn(e) {
    return new this(e).cbrt();
}
function On(e) {
    return p(e = new this(e), e.e + 1, 2);
}
function Rn(e, n, i) {
    return new this(e).clamp(n, i);
}
function An(e) {
    if (!e || typeof e != "object") throw Error(fe + "Object expected");
    var n, i, t, r = e.defaults === !0, s = [
        "precision",
        1,
        H,
        "rounding",
        0,
        8,
        "toExpNeg",
        -V,
        0,
        "toExpPos",
        0,
        V,
        "maxE",
        0,
        V,
        "minE",
        -V,
        0,
        "modulo",
        0,
        9
    ];
    for(n = 0; n < s.length; n += 3)if (i = s[n], r && (this[i] = Me[i]), (t = e[i]) !== void 0) if (R(t) === t && t >= s[n + 1] && t <= s[n + 2]) this[i] = t;
    else throw Error($ + i + ": " + t);
    if (i = "crypto", r && (this[i] = Me[i]), (t = e[i]) !== void 0) if (t === !0 || t === !1 || t === 0 || t === 1) if (t) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[i] = !0;
    else throw Error(Ze);
    else this[i] = !1;
    else throw Error($ + i + ": " + t);
    return this;
}
function qn(e) {
    return new this(e).cos();
}
function _n(e) {
    return new this(e).cosh();
}
function Ge(e) {
    var n, i, t;
    function r(s) {
        var o, u, c, f = this;
        if (!(f instanceof r)) return new r(s);
        if (f.constructor = r, Fe(s)) {
            f.s = s.s, w ? !s.d || s.e > r.maxE ? (f.e = NaN, f.d = null) : s.e < r.minE ? (f.e = 0, f.d = [
                0
            ]) : (f.e = s.e, f.d = s.d.slice()) : (f.e = s.e, f.d = s.d ? s.d.slice() : s.d);
            return;
        }
        if (c = typeof s, c === "number") {
            if (s === 0) {
                f.s = 1 / s < 0 ? -1 : 1, f.e = 0, f.d = [
                    0
                ];
                return;
            }
            if (s < 0 ? (s = -s, f.s = -1) : f.s = 1, s === ~~s && s < 1e7) {
                for(o = 0, u = s; u >= 10; u /= 10)o++;
                w ? o > r.maxE ? (f.e = NaN, f.d = null) : o < r.minE ? (f.e = 0, f.d = [
                    0
                ]) : (f.e = o, f.d = [
                    s
                ]) : (f.e = o, f.d = [
                    s
                ]);
                return;
            }
            if (s * 0 !== 0) {
                s || (f.s = NaN), f.e = NaN, f.d = null;
                return;
            }
            return re(f, s.toString());
        }
        if (c === "string") return (u = s.charCodeAt(0)) === 45 ? (s = s.slice(1), f.s = -1) : (u === 43 && (s = s.slice(1)), f.s = 1), Be.test(s) ? re(f, s) : gn(f, s);
        if (c === "bigint") return s < 0 ? (s = -s, f.s = -1) : f.s = 1, re(f, s.toString());
        throw Error($ + s);
    }
    if (r.prototype = h, r.ROUND_UP = 0, r.ROUND_DOWN = 1, r.ROUND_CEIL = 2, r.ROUND_FLOOR = 3, r.ROUND_HALF_UP = 4, r.ROUND_HALF_DOWN = 5, r.ROUND_HALF_EVEN = 6, r.ROUND_HALF_CEIL = 7, r.ROUND_HALF_FLOOR = 8, r.EUCLID = 9, r.config = r.set = An, r.clone = Ge, r.isDecimal = Fe, r.abs = wn, r.acos = Nn, r.acosh = vn, r.add = En, r.asin = kn, r.asinh = Sn, r.atan = Mn, r.atanh = Cn, r.atan2 = bn, r.cbrt = Pn, r.ceil = On, r.clamp = Rn, r.cos = qn, r.cosh = _n, r.div = Tn, r.exp = Dn, r.floor = Fn, r.hypot = Ln, r.ln = In, r.log = Zn, r.log10 = Bn, r.log2 = Un, r.max = $n, r.min = Hn, r.mod = Vn, r.mul = jn, r.pow = Wn, r.random = Gn, r.round = Jn, r.sign = Xn, r.sin = Kn, r.sinh = Qn, r.sqrt = Yn, r.sub = xn, r.sum = zn, r.tan = yn, r.tanh = ei, r.trunc = ni, e === void 0 && (e = {}), e && e.defaults !== !0) for(t = [
        "precision",
        "rounding",
        "toExpNeg",
        "toExpPos",
        "maxE",
        "minE",
        "modulo",
        "crypto"
    ], n = 0; n < t.length;)e.hasOwnProperty(i = t[n++]) || (e[i] = this[i]);
    return r.config(e), r;
}
function Tn(e, n) {
    return new this(e).div(n);
}
function Dn(e) {
    return new this(e).exp();
}
function Fn(e) {
    return p(e = new this(e), e.e + 1, 3);
}
function Ln() {
    var e, n, i = new this(0);
    for(w = !1, e = 0; e < arguments.length;)if (n = new this(arguments[e++]), n.d) i.d && (i = i.plus(n.times(n)));
    else {
        if (n.s) return w = !0, new this(1 / 0);
        i = n;
    }
    return w = !0, i.sqrt();
}
function Fe(e) {
    return e instanceof Y || e && e.toStringTag === Ue || !1;
}
function In(e) {
    return new this(e).ln();
}
function Zn(e, n) {
    return new this(e).log(n);
}
function Un(e) {
    return new this(e).log(2);
}
function Bn(e) {
    return new this(e).log(10);
}
function $n() {
    return Ve(this, arguments, -1);
}
function Hn() {
    return Ve(this, arguments, 1);
}
function Vn(e, n) {
    return new this(e).mod(n);
}
function jn(e, n) {
    return new this(e).mul(n);
}
function Wn(e, n) {
    return new this(e).pow(n);
}
function Gn(e) {
    var n, i, t, r, s = 0, o = new this(1), u = [];
    if (e === void 0 ? e = this.precision : q(e, 1, H), t = Math.ceil(e / m), this.crypto) if (crypto.getRandomValues) for(n = crypto.getRandomValues(new Uint32Array(t)); s < t;)r = n[s], r >= 429e7 ? n[s] = crypto.getRandomValues(new Uint32Array(1))[0] : u[s++] = r % 1e7;
    else if (crypto.randomBytes) {
        for(n = crypto.randomBytes(t *= 4); s < t;)r = n[s] + (n[s + 1] << 8) + (n[s + 2] << 16) + ((n[s + 3] & 127) << 24), r >= 214e7 ? crypto.randomBytes(4).copy(n, s) : (u.push(r % 1e7), s += 4);
        s = t / 4;
    } else throw Error(Ze);
    else for(; s < t;)u[s++] = Math.random() * 1e7 | 0;
    for(t = u[--s], e %= m, t && e && (r = C(10, m - e), u[s] = (t / r | 0) * r); u[s] === 0; s--)u.pop();
    if (s < 0) i = 0, u = [
        0
    ];
    else {
        for(i = -1; u[0] === 0; i -= m)u.shift();
        for(t = 1, r = u[0]; r >= 10; r /= 10)t++;
        t < m && (i -= m - t);
    }
    return o.e = i, o.d = u, o;
}
function Jn(e) {
    return p(e = new this(e), e.e + 1, this.rounding);
}
function Xn(e) {
    return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
}
function Kn(e) {
    return new this(e).sin();
}
function Qn(e) {
    return new this(e).sinh();
}
function Yn(e) {
    return new this(e).sqrt();
}
function xn(e, n) {
    return new this(e).sub(n);
}
function zn() {
    var e = 0, n = arguments, i = new this(n[e]);
    for(w = !1; i.s && ++e < n.length;)i = i.plus(n[e]);
    return w = !0, p(i, this.precision, this.rounding);
}
function yn(e) {
    return new this(e).tan();
}
function ei(e) {
    return new this(e).tanh();
}
function ni(e) {
    return p(e = new this(e), e.e + 1, 1);
}
h[Symbol.for("nodejs.util.inspect.custom")] = h.toString;
h[Symbol.toStringTag] = "Decimal";
var Y = h.constructor = Ge(Me);
se = new Y(se);
oe = new Y(oe);
var Je = Y;
0 && (module.exports = {
    Decimal,
    Public,
    getRuntime,
    makeStrictEnum,
    objectEnumValues
}); /*! Bundled license information:

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/  //# sourceMappingURL=index-browser.js.map
}),
"[project]/IT4409/Instagram-lite/node_modules/@prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const prisma = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)");
module.exports = prisma;
}),
"[project]/IT4409/Instagram-lite/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ // biome-ignore-all lint: generated file
Object.defineProperty(exports, "__esModule", {
    value: true
});
const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime, skip } = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 6.19.1
 * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
 */ Prisma.prismaVersion = {
    client: "6.19.1",
    engine: "c2990dca591cba766e3b7ef5d9e8a84796e47ab7"
};
Prisma.PrismaClientKnownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.PrismaClientUnknownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.PrismaClientRustPanicError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.PrismaClientInitializationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.PrismaClientValidationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.empty = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("empty is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.join = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("join is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.raw = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("raw is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
Prisma.defineExtension = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error("Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ".concat(runtimeName, ").\nIn case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report"));
};
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;
Prisma.NullTypes = {
    DbNull: objectEnumValues.classes.DbNull,
    JsonNull: objectEnumValues.classes.JsonNull,
    AnyNull: objectEnumValues.classes.AnyNull
};
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.SubmissionScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email'
};
exports.Prisma.Login_webScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    createdAt: 'createdAt'
};
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    username: 'username',
    fullname: 'fullname',
    email: 'email',
    phone: 'phone',
    password: 'password',
    createdAt: 'createdAt'
};
exports.Prisma.BlogScalarFieldEnum = {
    id: 'id',
    caption: 'caption',
    imageUrls: 'imageUrls',
    hashtags: 'hashtags',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    authorId: 'authorId',
    sharedFromId: 'sharedFromId'
};
exports.Prisma.CommentScalarFieldEnum = {
    id: 'id',
    content: 'content',
    createdAt: 'createdAt',
    authorId: 'authorId',
    blogId: 'blogId',
    parentId: 'parentId'
};
exports.Prisma.LikeScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    blogId: 'blogId'
};
exports.Prisma.FollowScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    followerId: 'followerId',
    followingId: 'followingId'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.ModelName = {
    Submission: 'Submission',
    login_web: 'login_web',
    User: 'User',
    Blog: 'Blog',
    Comment: 'Comment',
    Like: 'Like',
    Follow: 'Follow'
};
/**
 * This is a stub Prisma Client that will error at runtime if called.
 */ class PrismaClient {
    constructor(){
        return new Proxy(this, {
            get (target, prop) {
                let message;
                const runtime = getRuntime();
                if (runtime.isEdge) {
                    message = "PrismaClient is not configured to run in ".concat(runtime.prettyName, ". In order to run Prisma Client on edge runtime, either:\n- Use Prisma Accelerate: https://pris.ly/d/accelerate\n- Use Driver Adapters: https://pris.ly/d/driver-adapters\n");
                } else {
                    message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).';
                }
                message += "\nIf this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report";
                throw new Error(message);
            }
        });
    }
}
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "./constants/date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */ /**
 * @constant
 * @name daysInWeek
 * @summary Days in 1 week.
 */ __turbopack_context__.s([
    "constructFromSymbol",
    ()=>constructFromSymbol,
    "daysInWeek",
    ()=>daysInWeek,
    "daysInYear",
    ()=>daysInYear,
    "maxTime",
    ()=>maxTime,
    "millisecondsInDay",
    ()=>millisecondsInDay,
    "millisecondsInHour",
    ()=>millisecondsInHour,
    "millisecondsInMinute",
    ()=>millisecondsInMinute,
    "millisecondsInSecond",
    ()=>millisecondsInSecond,
    "millisecondsInWeek",
    ()=>millisecondsInWeek,
    "minTime",
    ()=>minTime,
    "minutesInDay",
    ()=>minutesInDay,
    "minutesInHour",
    ()=>minutesInHour,
    "minutesInMonth",
    ()=>minutesInMonth,
    "minutesInYear",
    ()=>minutesInYear,
    "monthsInQuarter",
    ()=>monthsInQuarter,
    "monthsInYear",
    ()=>monthsInYear,
    "quartersInYear",
    ()=>quartersInYear,
    "secondsInDay",
    ()=>secondsInDay,
    "secondsInHour",
    ()=>secondsInHour,
    "secondsInMinute",
    ()=>secondsInMinute,
    "secondsInMonth",
    ()=>secondsInMonth,
    "secondsInQuarter",
    ()=>secondsInQuarter,
    "secondsInWeek",
    ()=>secondsInWeek,
    "secondsInYear",
    ()=>secondsInYear
]);
const daysInWeek = 7;
const daysInYear = 365.2425;
const maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000;
const minTime = -maxTime;
const millisecondsInWeek = 604800000;
const millisecondsInDay = 86400000;
const millisecondsInMinute = 60000;
const millisecondsInHour = 3600000;
const millisecondsInSecond = 1000;
const minutesInYear = 525600;
const minutesInMonth = 43200;
const minutesInDay = 1440;
const minutesInHour = 60;
const monthsInQuarter = 3;
const monthsInYear = 12;
const quartersInYear = 4;
const secondsInHour = 3600;
const secondsInMinute = 60;
const secondsInDay = secondsInHour * 24;
const secondsInWeek = secondsInDay * 7;
const secondsInYear = secondsInDay * daysInYear;
const secondsInMonth = secondsInYear / 12;
const secondsInQuarter = secondsInMonth * 3;
const constructFromSymbol = Symbol.for("constructDateFrom");
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/constructFrom.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "constructFrom",
    ()=>constructFrom,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/constants.js [app-client] (ecmascript)");
;
function constructFrom(date, value) {
    if (typeof date === "function") return date(value);
    if (date && typeof date === "object" && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constructFromSymbol"] in date) return date[__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constructFromSymbol"]](value);
    if (date instanceof Date) return new date.constructor(value);
    return new Date(value);
}
const __TURBOPACK__default__export__ = constructFrom;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/constructNow.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "constructNow",
    ()=>constructNow,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/constructFrom.js [app-client] (ecmascript)");
;
function constructNow(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constructFrom"])(date, Date.now());
}
const __TURBOPACK__default__export__ = constructNow;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/formatDistance.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDistance",
    ()=>formatDistance
]);
const formatDistanceLocale = {
    lessThanXSeconds: {
        one: "less than a second",
        other: "less than {{count}} seconds"
    },
    xSeconds: {
        one: "1 second",
        other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
        one: "less than a minute",
        other: "less than {{count}} minutes"
    },
    xMinutes: {
        one: "1 minute",
        other: "{{count}} minutes"
    },
    aboutXHours: {
        one: "about 1 hour",
        other: "about {{count}} hours"
    },
    xHours: {
        one: "1 hour",
        other: "{{count}} hours"
    },
    xDays: {
        one: "1 day",
        other: "{{count}} days"
    },
    aboutXWeeks: {
        one: "about 1 week",
        other: "about {{count}} weeks"
    },
    xWeeks: {
        one: "1 week",
        other: "{{count}} weeks"
    },
    aboutXMonths: {
        one: "about 1 month",
        other: "about {{count}} months"
    },
    xMonths: {
        one: "1 month",
        other: "{{count}} months"
    },
    aboutXYears: {
        one: "about 1 year",
        other: "about {{count}} years"
    },
    xYears: {
        one: "1 year",
        other: "{{count}} years"
    },
    overXYears: {
        one: "over 1 year",
        other: "over {{count}} years"
    },
    almostXYears: {
        one: "almost 1 year",
        other: "almost {{count}} years"
    }
};
const formatDistance = (token, count, options)=>{
    let result;
    const tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
        result = tokenValue;
    } else if (count === 1) {
        result = tokenValue.one;
    } else {
        result = tokenValue.other.replace("{{count}}", count.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.addSuffix) {
        if (options.comparison && options.comparison > 0) {
            return "in " + result;
        } else {
            return result + " ago";
        }
    }
    return result;
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildFormatLongFn.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildFormatLongFn",
    ()=>buildFormatLongFn
]);
function buildFormatLongFn(args) {
    return function() {
        let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        // TODO: Remove String()
        const width = options.width ? String(options.width) : args.defaultWidth;
        const format = args.formats[width] || args.formats[args.defaultWidth];
        return format;
    };
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/formatLong.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatLong",
    ()=>formatLong
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildFormatLongFn.js [app-client] (ecmascript)");
;
const dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
};
const timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
};
const dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
};
const formatLong = {
    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFormatLongFn"])({
        formats: dateFormats,
        defaultWidth: "full"
    }),
    time: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFormatLongFn"])({
        formats: timeFormats,
        defaultWidth: "full"
    }),
    dateTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFormatLongFn"])({
        formats: dateTimeFormats,
        defaultWidth: "full"
    })
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/formatRelative.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatRelative",
    ()=>formatRelative
]);
const formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
};
const formatRelative = (token, _date, _baseDate, _options)=>formatRelativeLocale[token];
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildLocalizeFn.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * The localize function argument callback which allows to convert raw value to
 * the actual type.
 *
 * @param value - The value to convert
 *
 * @returns The converted value
 */ /**
 * The map of localized values for each width.
 */ /**
 * The index type of the locale unit value. It types conversion of units of
 * values that don't start at 0 (i.e. quarters).
 */ /**
 * Converts the unit value to the tuple of values.
 */ /**
 * The tuple of localized era values. The first element represents BC,
 * the second element represents AD.
 */ /**
 * The tuple of localized quarter values. The first element represents Q1.
 */ /**
 * The tuple of localized day values. The first element represents Sunday.
 */ /**
 * The tuple of localized month values. The first element represents January.
 */ __turbopack_context__.s([
    "buildLocalizeFn",
    ()=>buildLocalizeFn
]);
function buildLocalizeFn(args) {
    return (value, options)=>{
        const context = (options === null || options === void 0 ? void 0 : options.context) ? String(options.context) : "standalone";
        let valuesArray;
        if (context === "formatting" && args.formattingValues) {
            const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
            const width = (options === null || options === void 0 ? void 0 : options.width) ? String(options.width) : defaultWidth;
            valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
        } else {
            const defaultWidth = args.defaultWidth;
            const width = (options === null || options === void 0 ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
            valuesArray = args.values[width] || args.values[defaultWidth];
        }
        const index = args.argumentCallback ? args.argumentCallback(value) : value;
        // @ts-expect-error - For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
        return valuesArray[index];
    };
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/localize.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "localize",
    ()=>localize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildLocalizeFn.js [app-client] (ecmascript)");
;
const eraValues = {
    narrow: [
        "B",
        "A"
    ],
    abbreviated: [
        "BC",
        "AD"
    ],
    wide: [
        "Before Christ",
        "Anno Domini"
    ]
};
const quarterValues = {
    narrow: [
        "1",
        "2",
        "3",
        "4"
    ],
    abbreviated: [
        "Q1",
        "Q2",
        "Q3",
        "Q4"
    ],
    wide: [
        "1st quarter",
        "2nd quarter",
        "3rd quarter",
        "4th quarter"
    ]
};
// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
const monthValues = {
    narrow: [
        "J",
        "F",
        "M",
        "A",
        "M",
        "J",
        "J",
        "A",
        "S",
        "O",
        "N",
        "D"
    ],
    abbreviated: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    wide: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
};
const dayValues = {
    narrow: [
        "S",
        "M",
        "T",
        "W",
        "T",
        "F",
        "S"
    ],
    short: [
        "Su",
        "Mo",
        "Tu",
        "We",
        "Th",
        "Fr",
        "Sa"
    ],
    abbreviated: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ],
    wide: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
};
const dayPeriodValues = {
    narrow: {
        am: "a",
        pm: "p",
        midnight: "mi",
        noon: "n",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    },
    abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    },
    wide: {
        am: "a.m.",
        pm: "p.m.",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    }
};
const formattingDayPeriodValues = {
    narrow: {
        am: "a",
        pm: "p",
        midnight: "mi",
        noon: "n",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
    },
    abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "midnight",
        noon: "noon",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
    },
    wide: {
        am: "a.m.",
        pm: "p.m.",
        midnight: "midnight",
        noon: "noon",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
    }
};
const ordinalNumber = (dirtyNumber, _options)=>{
    const number = Number(dirtyNumber);
    // If ordinal numbers depend on context, for example,
    // if they are different for different grammatical genders,
    // use `options.unit`.
    //
    // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
    // 'day', 'hour', 'minute', 'second'.
    const rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
        switch(rem100 % 10){
            case 1:
                return number + "st";
            case 2:
                return number + "nd";
            case 3:
                return number + "rd";
        }
    }
    return number + "th";
};
const localize = {
    ordinalNumber,
    era: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: eraValues,
        defaultWidth: "wide"
    }),
    quarter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: quarterValues,
        defaultWidth: "wide",
        argumentCallback: (quarter)=>quarter - 1
    }),
    month: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: monthValues,
        defaultWidth: "wide"
    }),
    day: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: dayValues,
        defaultWidth: "wide"
    }),
    dayPeriod: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: dayPeriodValues,
        defaultWidth: "wide",
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: "wide"
    })
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildMatchFn.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildMatchFn",
    ()=>buildMatchFn
]);
function buildMatchFn(args) {
    return function(string) {
        let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const width = options.width;
        const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
        const matchResult = string.match(matchPattern);
        if (!matchResult) {
            return null;
        }
        const matchedString = matchResult[0];
        const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
        const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern)=>pattern.test(matchedString)) : findKey(parsePatterns, (pattern)=>pattern.test(matchedString));
        let value;
        value = args.valueCallback ? args.valueCallback(key) : key;
        value = options.valueCallback ? options.valueCallback(value) : value;
        const rest = string.slice(matchedString.length);
        return {
            value,
            rest
        };
    };
}
function findKey(object, predicate) {
    for(const key in object){
        if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
            return key;
        }
    }
    return undefined;
}
function findIndex(array, predicate) {
    for(let key = 0; key < array.length; key++){
        if (predicate(array[key])) {
            return key;
        }
    }
    return undefined;
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildMatchPatternFn",
    ()=>buildMatchPatternFn
]);
function buildMatchPatternFn(args) {
    return function(string) {
        let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const matchResult = string.match(args.matchPattern);
        if (!matchResult) return null;
        const matchedString = matchResult[0];
        const parseResult = string.match(args.parsePattern);
        if (!parseResult) return null;
        let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
        // [TODO] I challenge you to fix the type
        value = options.valueCallback ? options.valueCallback(value) : value;
        const rest = string.slice(matchedString.length);
        return {
            value,
            rest
        };
    };
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/match.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "match",
    ()=>match
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildMatchFn.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchPatternFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js [app-client] (ecmascript)");
;
;
const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
};
const parseEraPatterns = {
    any: [
        /^b/i,
        /^(a|c)/i
    ]
};
const matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
};
const parseQuarterPatterns = {
    any: [
        /1/i,
        /2/i,
        /3/i,
        /4/i
    ]
};
const matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
const parseMonthPatterns = {
    narrow: [
        /^j/i,
        /^f/i,
        /^m/i,
        /^a/i,
        /^m/i,
        /^j/i,
        /^j/i,
        /^a/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ],
    any: [
        /^ja/i,
        /^f/i,
        /^mar/i,
        /^ap/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^au/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ]
};
const matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
const parseDayPatterns = {
    narrow: [
        /^s/i,
        /^m/i,
        /^t/i,
        /^w/i,
        /^t/i,
        /^f/i,
        /^s/i
    ],
    any: [
        /^su/i,
        /^m/i,
        /^tu/i,
        /^w/i,
        /^th/i,
        /^f/i,
        /^sa/i
    ]
};
const matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
const parseDayPeriodPatterns = {
    any: {
        am: /^a/i,
        pm: /^p/i,
        midnight: /^mi/i,
        noon: /^no/i,
        morning: /morning/i,
        afternoon: /afternoon/i,
        evening: /evening/i,
        night: /night/i
    }
};
const match = {
    ordinalNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchPatternFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchPatternFn"])({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: (value)=>parseInt(value, 10)
    }),
    era: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseEraPatterns,
        defaultParseWidth: "any"
    }),
    quarter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: "any",
        valueCallback: (index)=>index + 1
    }),
    month: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: "any"
    }),
    day: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPatterns,
        defaultParseWidth: "any"
    }),
    dayPeriod: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: "any",
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: "any"
    })
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "enUS",
    ()=>enUS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$formatDistance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/formatDistance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$formatLong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/formatLong.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$formatRelative$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/formatRelative.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$localize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/localize.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$match$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US/_lib/match.js [app-client] (ecmascript)");
;
;
;
;
;
const enUS = {
    code: "en-US",
    formatDistance: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$formatDistance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistance"],
    formatLong: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$formatLong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatLong"],
    formatRelative: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$formatRelative$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRelative"],
    localize: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$localize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localize"],
    match: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2f$_lib$2f$match$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["match"],
    options: {
        weekStartsOn: 0 /* Sunday */ ,
        firstWeekContainsDate: 1
    }
};
const __TURBOPACK__default__export__ = enUS;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US.js [app-client] (ecmascript) <export enUS as defaultLocale>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultLocale",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enUS"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US.js [app-client] (ecmascript)");
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/defaultOptions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDefaultOptions",
    ()=>getDefaultOptions,
    "setDefaultOptions",
    ()=>setDefaultOptions
]);
let defaultOptions = {};
function getDefaultOptions() {
    return defaultOptions;
}
function setDefaultOptions(newOptions) {
    defaultOptions = newOptions;
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/toDate.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "toDate",
    ()=>toDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/constructFrom.js [app-client] (ecmascript)");
;
function toDate(argument, context) {
    // [TODO] Get rid of `toDate` or `constructFrom`?
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constructFrom"])(context || argument, argument);
}
const __TURBOPACK__default__export__ = toDate;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTimezoneOffsetInMilliseconds",
    ()=>getTimezoneOffsetInMilliseconds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/toDate.js [app-client] (ecmascript)");
;
function getTimezoneOffsetInMilliseconds(date) {
    const _date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(date);
    const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), _date.getMilliseconds()));
    utcDate.setUTCFullYear(_date.getFullYear());
    return +date - +utcDate;
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/normalizeDates.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeDates",
    ()=>normalizeDates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/constructFrom.js [app-client] (ecmascript)");
;
function normalizeDates(context) {
    for(var _len = arguments.length, dates = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        dates[_key - 1] = arguments[_key];
    }
    const normalize = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constructFrom"].bind(null, context || dates.find((date)=>typeof date === "object"));
    return dates.map(normalize);
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/compareAsc.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compareAsc",
    ()=>compareAsc,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/toDate.js [app-client] (ecmascript)");
;
function compareAsc(dateLeft, dateRight) {
    const diff = +(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(dateLeft) - +(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(dateRight);
    if (diff < 0) return -1;
    else if (diff > 0) return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
    return diff;
}
const __TURBOPACK__default__export__ = compareAsc;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInCalendarMonths.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "differenceInCalendarMonths",
    ()=>differenceInCalendarMonths
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$normalizeDates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/normalizeDates.js [app-client] (ecmascript)");
;
function differenceInCalendarMonths(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$normalizeDates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeDates"])(options === null || options === void 0 ? void 0 : options.in, laterDate, earlierDate);
    const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
    const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
    return yearsDiff * 12 + monthsDiff;
}
const __TURBOPACK__default__export__ = differenceInCalendarMonths;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/endOfDay.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "endOfDay",
    ()=>endOfDay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/toDate.js [app-client] (ecmascript)");
;
function endOfDay(date, options) {
    const _date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(date, options === null || options === void 0 ? void 0 : options.in);
    _date.setHours(23, 59, 59, 999);
    return _date;
}
const __TURBOPACK__default__export__ = endOfDay;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/endOfMonth.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "endOfMonth",
    ()=>endOfMonth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/toDate.js [app-client] (ecmascript)");
;
function endOfMonth(date, options) {
    const _date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(date, options === null || options === void 0 ? void 0 : options.in);
    const month = _date.getMonth();
    _date.setFullYear(_date.getFullYear(), month + 1, 0);
    _date.setHours(23, 59, 59, 999);
    return _date;
}
const __TURBOPACK__default__export__ = endOfMonth;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/isLastDayOfMonth.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "isLastDayOfMonth",
    ()=>isLastDayOfMonth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$endOfDay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/endOfDay.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/endOfMonth.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/toDate.js [app-client] (ecmascript)");
;
;
;
function isLastDayOfMonth(date, options) {
    const _date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(date, options === null || options === void 0 ? void 0 : options.in);
    return +(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$endOfDay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endOfDay"])(_date, options) === +(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endOfMonth"])(_date, options);
}
const __TURBOPACK__default__export__ = isLastDayOfMonth;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInMonths.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "differenceInMonths",
    ()=>differenceInMonths
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$normalizeDates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/normalizeDates.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$compareAsc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/compareAsc.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarMonths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInCalendarMonths.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$isLastDayOfMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/isLastDayOfMonth.js [app-client] (ecmascript)");
;
;
;
;
function differenceInMonths(laterDate, earlierDate, options) {
    const [laterDate_, workingLaterDate, earlierDate_] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$normalizeDates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeDates"])(options === null || options === void 0 ? void 0 : options.in, laterDate, laterDate, earlierDate);
    const sign = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$compareAsc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareAsc"])(workingLaterDate, earlierDate_);
    const difference = Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarMonths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["differenceInCalendarMonths"])(workingLaterDate, earlierDate_));
    if (difference < 1) return 0;
    if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27) workingLaterDate.setDate(30);
    workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);
    let isLastMonthNotFull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$compareAsc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareAsc"])(workingLaterDate, earlierDate_) === -sign;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$isLastDayOfMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastDayOfMonth"])(laterDate_) && difference === 1 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$compareAsc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareAsc"])(laterDate_, earlierDate_) === 1) {
        isLastMonthNotFull = false;
    }
    const result = sign * (difference - +isLastMonthNotFull);
    return result === 0 ? 0 : result;
}
const __TURBOPACK__default__export__ = differenceInMonths;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/getRoundingMethod.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRoundingMethod",
    ()=>getRoundingMethod
]);
function getRoundingMethod(method) {
    return (number)=>{
        const round = method ? Math[method] : Math.trunc;
        const result = round(number);
        // Prevent negative zero
        return result === 0 ? 0 : result;
    };
}
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInMilliseconds.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "differenceInMilliseconds",
    ()=>differenceInMilliseconds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/toDate.js [app-client] (ecmascript)");
;
function differenceInMilliseconds(laterDate, earlierDate) {
    return +(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(laterDate) - +(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$toDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDate"])(earlierDate);
}
const __TURBOPACK__default__export__ = differenceInMilliseconds;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInSeconds.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "differenceInSeconds",
    ()=>differenceInSeconds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$getRoundingMethod$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/getRoundingMethod.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInMilliseconds$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInMilliseconds.js [app-client] (ecmascript)");
;
;
function differenceInSeconds(laterDate, earlierDate, options) {
    const diff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInMilliseconds$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["differenceInMilliseconds"])(laterDate, earlierDate) / 1000;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$getRoundingMethod$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRoundingMethod"])(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}
const __TURBOPACK__default__export__ = differenceInSeconds;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/formatDistance.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "formatDistance",
    ()=>formatDistance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__enUS__as__defaultLocale$3e$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/en-US.js [app-client] (ecmascript) <export enUS as defaultLocale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$defaultOptions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/defaultOptions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$getTimezoneOffsetInMilliseconds$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$normalizeDates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/_lib/normalizeDates.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$compareAsc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/compareAsc.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInMonths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInMonths.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInSeconds$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/differenceInSeconds.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
function formatDistance(laterDate, earlierDate, options) {
    const defaultOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$defaultOptions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultOptions"])();
    var _options_locale, _ref;
    const locale = (_ref = (_options_locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options_locale !== void 0 ? _options_locale : defaultOptions.locale) !== null && _ref !== void 0 ? _ref : __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$en$2d$US$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__enUS__as__defaultLocale$3e$__["defaultLocale"];
    const minutesInAlmostTwoDays = 2520;
    const comparison = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$compareAsc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareAsc"])(laterDate, earlierDate);
    if (isNaN(comparison)) throw new RangeError("Invalid time value");
    const localizeOptions = Object.assign({}, options, {
        addSuffix: options === null || options === void 0 ? void 0 : options.addSuffix,
        comparison: comparison
    });
    const [laterDate_, earlierDate_] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$normalizeDates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeDates"])(options === null || options === void 0 ? void 0 : options.in, ...comparison > 0 ? [
        earlierDate,
        laterDate
    ] : [
        laterDate,
        earlierDate
    ]);
    const seconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInSeconds$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["differenceInSeconds"])(earlierDate_, laterDate_);
    const offsetInSeconds = ((0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$getTimezoneOffsetInMilliseconds$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTimezoneOffsetInMilliseconds"])(earlierDate_) - (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$_lib$2f$getTimezoneOffsetInMilliseconds$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTimezoneOffsetInMilliseconds"])(laterDate_)) / 1000;
    const minutes = Math.round((seconds - offsetInSeconds) / 60);
    let months;
    // 0 up to 2 mins
    if (minutes < 2) {
        if (options === null || options === void 0 ? void 0 : options.includeSeconds) {
            if (seconds < 5) {
                return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
            } else if (seconds < 10) {
                return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
            } else if (seconds < 20) {
                return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
            } else if (seconds < 40) {
                return locale.formatDistance("halfAMinute", 0, localizeOptions);
            } else if (seconds < 60) {
                return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
            } else {
                return locale.formatDistance("xMinutes", 1, localizeOptions);
            }
        } else {
            if (minutes === 0) {
                return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
            } else {
                return locale.formatDistance("xMinutes", minutes, localizeOptions);
            }
        }
    // 2 mins up to 0.75 hrs
    } else if (minutes < 45) {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
    // 0.75 hrs up to 1.5 hrs
    } else if (minutes < 90) {
        return locale.formatDistance("aboutXHours", 1, localizeOptions);
    // 1.5 hrs up to 24 hrs
    } else if (minutes < __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesInDay"]) {
        const hours = Math.round(minutes / 60);
        return locale.formatDistance("aboutXHours", hours, localizeOptions);
    // 1 day up to 1.75 days
    } else if (minutes < minutesInAlmostTwoDays) {
        return locale.formatDistance("xDays", 1, localizeOptions);
    // 1.75 days up to 30 days
    } else if (minutes < __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesInMonth"]) {
        const days = Math.round(minutes / __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesInDay"]);
        return locale.formatDistance("xDays", days, localizeOptions);
    // 1 month up to 2 months
    } else if (minutes < __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesInMonth"] * 2) {
        months = Math.round(minutes / __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesInMonth"]);
        return locale.formatDistance("aboutXMonths", months, localizeOptions);
    }
    months = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$differenceInMonths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["differenceInMonths"])(earlierDate_, laterDate_);
    // 2 months up to 12 months
    if (months < 12) {
        const nearestMonth = Math.round(minutes / __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesInMonth"]);
        return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
    // 1 year up to max Date
    } else {
        const monthsSinceStartOfYear = months % 12;
        const years = Math.trunc(months / 12);
        // N years up to 1 years 3 months
        if (monthsSinceStartOfYear < 3) {
            return locale.formatDistance("aboutXYears", years, localizeOptions);
        // N years 3 months up to N years 9 months
        } else if (monthsSinceStartOfYear < 9) {
            return locale.formatDistance("overXYears", years, localizeOptions);
        // N years 9 months up to N year 12 months
        } else {
            return locale.formatDistance("almostXYears", years + 1, localizeOptions);
        }
    }
}
const __TURBOPACK__default__export__ = formatDistance;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/formatDistanceToNow.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "formatDistanceToNow",
    ()=>formatDistanceToNow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/constructNow.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$formatDistance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/formatDistance.js [app-client] (ecmascript)");
;
;
function formatDistanceToNow(date, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$formatDistance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistance"])(date, (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$constructNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constructNow"])(date), options);
}
const __TURBOPACK__default__export__ = formatDistanceToNow;
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/formatDistance.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDistance",
    ()=>formatDistance
]);
const formatDistanceLocale = {
    lessThanXSeconds: {
        one: "dưới 1 giây",
        other: "dưới {{count}} giây"
    },
    xSeconds: {
        one: "1 giây",
        other: "{{count}} giây"
    },
    halfAMinute: "nửa phút",
    lessThanXMinutes: {
        one: "dưới 1 phút",
        other: "dưới {{count}} phút"
    },
    xMinutes: {
        one: "1 phút",
        other: "{{count}} phút"
    },
    aboutXHours: {
        one: "khoảng 1 giờ",
        other: "khoảng {{count}} giờ"
    },
    xHours: {
        one: "1 giờ",
        other: "{{count}} giờ"
    },
    xDays: {
        one: "1 ngày",
        other: "{{count}} ngày"
    },
    aboutXWeeks: {
        one: "khoảng 1 tuần",
        other: "khoảng {{count}} tuần"
    },
    xWeeks: {
        one: "1 tuần",
        other: "{{count}} tuần"
    },
    aboutXMonths: {
        one: "khoảng 1 tháng",
        other: "khoảng {{count}} tháng"
    },
    xMonths: {
        one: "1 tháng",
        other: "{{count}} tháng"
    },
    aboutXYears: {
        one: "khoảng 1 năm",
        other: "khoảng {{count}} năm"
    },
    xYears: {
        one: "1 năm",
        other: "{{count}} năm"
    },
    overXYears: {
        one: "hơn 1 năm",
        other: "hơn {{count}} năm"
    },
    almostXYears: {
        one: "gần 1 năm",
        other: "gần {{count}} năm"
    }
};
const formatDistance = (token, count, options)=>{
    let result;
    const tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
        result = tokenValue;
    } else if (count === 1) {
        result = tokenValue.one;
    } else {
        result = tokenValue.other.replace("{{count}}", String(count));
    }
    if (options === null || options === void 0 ? void 0 : options.addSuffix) {
        if (options.comparison && options.comparison > 0) {
            return result + " nữa";
        } else {
            return result + " trước";
        }
    }
    return result;
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/formatLong.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatLong",
    ()=>formatLong
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildFormatLongFn.js [app-client] (ecmascript)");
;
const dateFormats = {
    // thứ Sáu, ngày 25 tháng 08 năm 2017
    full: "EEEE, 'ngày' d MMMM 'năm' y",
    // ngày 25 tháng 08 năm 2017
    long: "'ngày' d MMMM 'năm' y",
    // 25 thg 08 năm 2017
    medium: "d MMM 'năm' y",
    // 25/08/2017
    short: "dd/MM/y"
};
const timeFormats = {
    full: "HH:mm:ss zzzz",
    long: "HH:mm:ss z",
    medium: "HH:mm:ss",
    short: "HH:mm"
};
const dateTimeFormats = {
    // thứ Sáu, ngày 25 tháng 08 năm 2017 23:25:59
    full: "{{date}} {{time}}",
    // ngày 25 tháng 08 năm 2017 23:25
    long: "{{date}} {{time}}",
    medium: "{{date}} {{time}}",
    short: "{{date}} {{time}}"
};
const formatLong = {
    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFormatLongFn"])({
        formats: dateFormats,
        defaultWidth: "full"
    }),
    time: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFormatLongFn"])({
        formats: timeFormats,
        defaultWidth: "full"
    }),
    dateTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildFormatLongFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFormatLongFn"])({
        formats: dateTimeFormats,
        defaultWidth: "full"
    })
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/formatRelative.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatRelative",
    ()=>formatRelative
]);
const formatRelativeLocale = {
    lastWeek: "eeee 'tuần trước vào lúc' p",
    yesterday: "'hôm qua vào lúc' p",
    today: "'hôm nay vào lúc' p",
    tomorrow: "'ngày mai vào lúc' p",
    nextWeek: "eeee 'tới vào lúc' p",
    other: "P"
};
const formatRelative = (token, _date, _baseDate, _options)=>formatRelativeLocale[token];
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/localize.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "localize",
    ()=>localize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildLocalizeFn.js [app-client] (ecmascript)");
;
// Vietnamese locale reference: http://www.localeplanet.com/icu/vi-VN/index.html
// Capitalization reference: http://hcmup.edu.vn/index.php?option=com_content&view=article&id=4106%3Avit-hoa-trong-vn-bn-hanh-chinh&catid=2345%3Atham-kho&Itemid=4103&lang=vi&site=134
const eraValues = {
    narrow: [
        "TCN",
        "SCN"
    ],
    abbreviated: [
        "trước CN",
        "sau CN"
    ],
    wide: [
        "trước Công Nguyên",
        "sau Công Nguyên"
    ]
};
const quarterValues = {
    narrow: [
        "1",
        "2",
        "3",
        "4"
    ],
    abbreviated: [
        "Q1",
        "Q2",
        "Q3",
        "Q4"
    ],
    wide: [
        "Quý 1",
        "Quý 2",
        "Quý 3",
        "Quý 4"
    ]
};
const formattingQuarterValues = {
    narrow: [
        "1",
        "2",
        "3",
        "4"
    ],
    abbreviated: [
        "Q1",
        "Q2",
        "Q3",
        "Q4"
    ],
    // I notice many news outlet use this "quý II/2018"
    wide: [
        "quý I",
        "quý II",
        "quý III",
        "quý IV"
    ]
};
// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
const monthValues = {
    narrow: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
    ],
    abbreviated: [
        "Thg 1",
        "Thg 2",
        "Thg 3",
        "Thg 4",
        "Thg 5",
        "Thg 6",
        "Thg 7",
        "Thg 8",
        "Thg 9",
        "Thg 10",
        "Thg 11",
        "Thg 12"
    ],
    wide: [
        "Tháng Một",
        "Tháng Hai",
        "Tháng Ba",
        "Tháng Tư",
        "Tháng Năm",
        "Tháng Sáu",
        "Tháng Bảy",
        "Tháng Tám",
        "Tháng Chín",
        "Tháng Mười",
        "Tháng Mười Một",
        "Tháng Mười Hai"
    ]
};
// In Vietnamese date formatting, month number less than 10 expected to have leading zero
const formattingMonthValues = {
    narrow: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
    ],
    abbreviated: [
        "thg 1",
        "thg 2",
        "thg 3",
        "thg 4",
        "thg 5",
        "thg 6",
        "thg 7",
        "thg 8",
        "thg 9",
        "thg 10",
        "thg 11",
        "thg 12"
    ],
    wide: [
        "tháng 01",
        "tháng 02",
        "tháng 03",
        "tháng 04",
        "tháng 05",
        "tháng 06",
        "tháng 07",
        "tháng 08",
        "tháng 09",
        "tháng 10",
        "tháng 11",
        "tháng 12"
    ]
};
const dayValues = {
    narrow: [
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7"
    ],
    short: [
        "CN",
        "Th 2",
        "Th 3",
        "Th 4",
        "Th 5",
        "Th 6",
        "Th 7"
    ],
    abbreviated: [
        "CN",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7"
    ],
    wide: [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy"
    ]
};
// Vietnamese are used to AM/PM borrowing from English, hence `narrow` and
// `abbreviated` are just like English but I'm leaving the `wide`
// format being localized with abbreviations found in some systems (SÁng / CHiều);
// however, personally, I don't think `Chiều` sounds appropriate for `PM`
const dayPeriodValues = {
    // narrow date period is extremely rare in Vietnamese
    // I used abbreviated form for noon, morning and afternoon
    // which are regconizable by Vietnamese, others cannot be any shorter
    narrow: {
        am: "am",
        pm: "pm",
        midnight: "nửa đêm",
        noon: "tr",
        morning: "sg",
        afternoon: "ch",
        evening: "tối",
        night: "đêm"
    },
    abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "nửa đêm",
        noon: "trưa",
        morning: "sáng",
        afternoon: "chiều",
        evening: "tối",
        night: "đêm"
    },
    wide: {
        am: "SA",
        pm: "CH",
        midnight: "nửa đêm",
        noon: "trưa",
        morning: "sáng",
        afternoon: "chiều",
        evening: "tối",
        night: "đêm"
    }
};
const formattingDayPeriodValues = {
    narrow: {
        am: "am",
        pm: "pm",
        midnight: "nửa đêm",
        noon: "tr",
        morning: "sg",
        afternoon: "ch",
        evening: "tối",
        night: "đêm"
    },
    abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "nửa đêm",
        noon: "trưa",
        morning: "sáng",
        afternoon: "chiều",
        evening: "tối",
        night: "đêm"
    },
    wide: {
        am: "SA",
        pm: "CH",
        midnight: "nửa đêm",
        noon: "giữa trưa",
        morning: "vào buổi sáng",
        afternoon: "vào buổi chiều",
        evening: "vào buổi tối",
        night: "vào ban đêm"
    }
};
const ordinalNumber = (dirtyNumber, options)=>{
    const number = Number(dirtyNumber);
    const unit = options === null || options === void 0 ? void 0 : options.unit;
    if (unit === "quarter") {
        // many news outlets use "quý I"...
        switch(number){
            case 1:
                return "I";
            case 2:
                return "II";
            case 3:
                return "III";
            case 4:
                return "IV";
        }
    } else if (unit === "day") {
        // day of week in Vietnamese has ordinal number meaning,
        // so we should use them, else it'll sound weird
        switch(number){
            case 1:
                return "thứ 2"; // meaning 2nd day but it's the first day of the week :D
            case 2:
                return "thứ 3"; // meaning 3rd day
            case 3:
                return "thứ 4"; // meaning 4th day and so on
            case 4:
                return "thứ 5";
            case 5:
                return "thứ 6";
            case 6:
                return "thứ 7";
            case 7:
                return "chủ nhật"; // meaning Sunday, there's no 8th day :D
        }
    } else if (unit === "week") {
        if (number === 1) {
            return "thứ nhất";
        } else {
            return "thứ " + number;
        }
    } else if (unit === "dayOfYear") {
        if (number === 1) {
            return "đầu tiên";
        } else {
            return "thứ " + number;
        }
    }
    // there are no different forms of ordinal numbers in Vietnamese
    return String(number);
};
const localize = {
    ordinalNumber,
    era: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: eraValues,
        defaultWidth: "wide"
    }),
    quarter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: quarterValues,
        defaultWidth: "wide",
        formattingValues: formattingQuarterValues,
        defaultFormattingWidth: "wide",
        argumentCallback: (quarter)=>quarter - 1
    }),
    month: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: monthValues,
        defaultWidth: "wide",
        formattingValues: formattingMonthValues,
        defaultFormattingWidth: "wide"
    }),
    day: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: dayValues,
        defaultWidth: "wide"
    }),
    dayPeriod: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildLocalizeFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLocalizeFn"])({
        values: dayPeriodValues,
        defaultWidth: "wide",
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: "wide"
    })
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/match.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "match",
    ()=>match
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildMatchFn.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchPatternFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js [app-client] (ecmascript)");
;
;
const matchOrdinalNumberPattern = /^(\d+)/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
    narrow: /^(tcn|scn)/i,
    abbreviated: /^(trước CN|sau CN)/i,
    wide: /^(trước Công Nguyên|sau Công Nguyên)/i
};
const parseEraPatterns = {
    any: [
        /^t/i,
        /^s/i
    ]
};
const matchQuarterPatterns = {
    narrow: /^([1234]|i{1,3}v?)/i,
    abbreviated: /^q([1234]|i{1,3}v?)/i,
    wide: /^quý ([1234]|i{1,3}v?)/i
};
const parseQuarterPatterns = {
    any: [
        /(1|i)$/i,
        /(2|ii)$/i,
        /(3|iii)$/i,
        /(4|iv)$/i
    ]
};
const matchMonthPatterns = {
    // month number may contain leading 0, 'thg' prefix may have space, underscore or empty before number
    // note the order of '1' since it is a sub-string of '10', so must be lower priority
    narrow: /^(0?[2-9]|10|11|12|0?1)/i,
    // note the order of 'thg 1' since it is sub-string of 'thg 10', so must be lower priority
    abbreviated: /^thg[ _]?(0?[1-9](?!\d)|10|11|12)/i,
    // note the order of 'Mười' since it is sub-string of Mười Một, so must be lower priority
    wide: /^tháng ?(Một|Hai|Ba|Tư|Năm|Sáu|Bảy|Tám|Chín|Mười|Mười ?Một|Mười ?Hai|0?[1-9](?!\d)|10|11|12)/i
};
const parseMonthPatterns = {
    narrow: [
        /0?1$/i,
        /0?2/i,
        /3/,
        /4/,
        /5/,
        /6/,
        /7/,
        /8/,
        /9/,
        /10/,
        /11/,
        /12/
    ],
    abbreviated: [
        /^thg[ _]?0?1(?!\d)/i,
        /^thg[ _]?0?2/i,
        /^thg[ _]?0?3/i,
        /^thg[ _]?0?4/i,
        /^thg[ _]?0?5/i,
        /^thg[ _]?0?6/i,
        /^thg[ _]?0?7/i,
        /^thg[ _]?0?8/i,
        /^thg[ _]?0?9/i,
        /^thg[ _]?10/i,
        /^thg[ _]?11/i,
        /^thg[ _]?12/i
    ],
    wide: [
        /^tháng ?(Một|0?1(?!\d))/i,
        /^tháng ?(Hai|0?2)/i,
        /^tháng ?(Ba|0?3)/i,
        /^tháng ?(Tư|0?4)/i,
        /^tháng ?(Năm|0?5)/i,
        /^tháng ?(Sáu|0?6)/i,
        /^tháng ?(Bảy|0?7)/i,
        /^tháng ?(Tám|0?8)/i,
        /^tháng ?(Chín|0?9)/i,
        /^tháng ?(Mười|10)/i,
        /^tháng ?(Mười ?Một|11)/i,
        /^tháng ?(Mười ?Hai|12)/i
    ]
};
const matchDayPatterns = {
    narrow: /^(CN|T2|T3|T4|T5|T6|T7)/i,
    short: /^(CN|Th ?2|Th ?3|Th ?4|Th ?5|Th ?6|Th ?7)/i,
    abbreviated: /^(CN|Th ?2|Th ?3|Th ?4|Th ?5|Th ?6|Th ?7)/i,
    wide: /^(Chủ ?Nhật|Chúa ?Nhật|thứ ?Hai|thứ ?Ba|thứ ?Tư|thứ ?Năm|thứ ?Sáu|thứ ?Bảy)/i
};
const parseDayPatterns = {
    narrow: [
        /CN/i,
        /2/i,
        /3/i,
        /4/i,
        /5/i,
        /6/i,
        /7/i
    ],
    short: [
        /CN/i,
        /2/i,
        /3/i,
        /4/i,
        /5/i,
        /6/i,
        /7/i
    ],
    abbreviated: [
        /CN/i,
        /2/i,
        /3/i,
        /4/i,
        /5/i,
        /6/i,
        /7/i
    ],
    wide: [
        /(Chủ|Chúa) ?Nhật/i,
        /Hai/i,
        /Ba/i,
        /Tư/i,
        /Năm/i,
        /Sáu/i,
        /Bảy/i
    ]
};
const matchDayPeriodPatterns = {
    narrow: /^(a|p|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i,
    abbreviated: /^(am|pm|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i,
    wide: /^(ch[^i]*|sa|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i
};
const parseDayPeriodPatterns = {
    any: {
        am: /^(a|sa)/i,
        pm: /^(p|ch[^i]*)/i,
        midnight: /nửa đêm/i,
        noon: /trưa/i,
        morning: /sáng/i,
        afternoon: /chiều/i,
        evening: /tối/i,
        night: /^đêm/i
    }
};
const match = {
    ordinalNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchPatternFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchPatternFn"])({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: (value)=>parseInt(value, 10)
    }),
    era: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseEraPatterns,
        defaultParseWidth: "any"
    }),
    quarter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: "any",
        valueCallback: (index)=>index + 1
    }),
    month: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: "wide"
    }),
    day: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPatterns,
        defaultParseWidth: "wide"
    }),
    dayPeriod: (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$_lib$2f$buildMatchFn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildMatchFn"])({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: "any"
    })
};
}),
"[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "vi",
    ()=>vi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$formatDistance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/formatDistance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$formatLong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/formatLong.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$formatRelative$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/formatRelative.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$localize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/localize.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$match$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/date-fns/locale/vi/_lib/match.js [app-client] (ecmascript)");
;
;
;
;
;
const vi = {
    code: "vi",
    formatDistance: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$formatDistance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistance"],
    formatLong: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$formatLong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatLong"],
    formatRelative: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$formatRelative$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRelative"],
    localize: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$localize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localize"],
    match: __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$date$2d$fns$2f$locale$2f$vi$2f$_lib$2f$match$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["match"],
    options: {
        weekStartsOn: 1 /* Monday */ ,
        firstWeekContainsDate: 1 /* First week of new year contains Jan 1st  */ 
    }
};
const __TURBOPACK__default__export__ = vi;
}),
"[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_apply_descriptor_get.cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) return descriptor.get.call(receiver);
    return descriptor.value;
}
exports._ = _class_apply_descriptor_get;
}),
"[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_extract_field_descriptor.cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _class_extract_field_descriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
exports._ = _class_extract_field_descriptor;
}),
"[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_private_field_get.cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var _class_apply_descriptor_get = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_apply_descriptor_get.cjs [app-client] (ecmascript)");
var _class_extract_field_descriptor = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_extract_field_descriptor.cjs [app-client] (ecmascript)");
function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor._(receiver, privateMap, "get");
    return _class_apply_descriptor_get._(receiver, descriptor);
}
exports._ = _class_private_field_get;
}),
"[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_check_private_redeclaration.cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _check_private_redeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
exports._ = _check_private_redeclaration;
}),
"[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_private_field_init.cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var _check_private_redeclaration = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_check_private_redeclaration.cjs [app-client] (ecmascript)");
function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration._(obj, privateMap);
    privateMap.set(obj, value);
}
exports._ = _class_private_field_init;
}),
"[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_apply_descriptor_set.cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _class_apply_descriptor_set(receiver, descriptor, value) {
    if (descriptor.set) descriptor.set.call(receiver, value);
    else {
        if (!descriptor.writable) {
            // This should only throw in strict mode, but class bodies are
            // always strict and private fields can only be used inside
            // class bodies.
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
exports._ = _class_apply_descriptor_set;
}),
"[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_private_field_set.cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var _class_apply_descriptor_set = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_apply_descriptor_set.cjs [app-client] (ecmascript)");
var _class_extract_field_descriptor = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/@swc/helpers/cjs/_class_extract_field_descriptor.cjs [app-client] (ecmascript)");
function _class_private_field_set(receiver, privateMap, value) {
    var descriptor = _class_extract_field_descriptor._(receiver, privateMap, "set");
    _class_apply_descriptor_set._(receiver, descriptor, value);
    return value;
}
exports._ = _class_private_field_set;
}),
"[project]/IT4409/Instagram-lite/node_modules/oidc-token-hash/lib/shake256.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const crypto = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/crypto-browserify/index.js [app-client] (ecmascript)");
const [major, minor] = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].version.substring(1).split('.').map((x)=>parseInt(x, 10));
const xofOutputLength = major > 12 || major === 12 && minor >= 8;
const shake256 = xofOutputLength && crypto.getHashes().includes('shake256');
module.exports = shake256;
}),
"[project]/IT4409/Instagram-lite/node_modules/oidc-token-hash/lib/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
const { strict: assert } = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/assert/assert.js [app-client] (ecmascript)");
const { createHash } = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/crypto-browserify/index.js [app-client] (ecmascript)");
const { format } = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/util/util.js [app-client] (ecmascript)");
const shake256 = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/oidc-token-hash/lib/shake256.js [app-client] (ecmascript)");
let encode;
if (__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isEncoding('base64url')) {
    encode = (input)=>input.toString('base64url');
} else {
    const fromBase64 = (base64)=>base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    encode = (input)=>fromBase64(input.toString('base64'));
}
/** SPECIFICATION
 * Its (_hash) value is the base64url encoding of the left-most half of the hash of the octets of
 * the ASCII representation of the token value, where the hash algorithm used is the hash algorithm
 * used in the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is
 * RS256, hash the token value with SHA-256, then take the left-most 128 bits and base64url encode
 * them. The _hash value is a case sensitive string.
 */ /**
 * @name getHash
 * @api private
 *
 * returns the sha length based off the JOSE alg heade value, defaults to sha256
 *
 * @param token {String} token value to generate the hash from
 * @param alg {String} ID Token JOSE header alg value (i.e. RS256, HS384, ES512, PS256)
 * @param [crv] {String} For EdDSA the curve decides what hash algorithm is used. Required for EdDSA
 */ function getHash(alg, crv) {
    switch(alg){
        case 'HS256':
        case 'RS256':
        case 'PS256':
        case 'ES256':
        case 'ES256K':
            return createHash('sha256');
        case 'HS384':
        case 'RS384':
        case 'PS384':
        case 'ES384':
            return createHash('sha384');
        case 'HS512':
        case 'RS512':
        case 'PS512':
        case 'ES512':
        case 'Ed25519':
            return createHash('sha512');
        case 'Ed448':
            if (!shake256) {
                throw new TypeError('Ed448 *_hash calculation is not supported in your Node.js runtime version');
            }
            return createHash('shake256', {
                outputLength: 114
            });
        case 'EdDSA':
            switch(crv){
                case 'Ed25519':
                    return createHash('sha512');
                case 'Ed448':
                    if (!shake256) {
                        throw new TypeError('Ed448 *_hash calculation is not supported in your Node.js runtime version');
                    }
                    return createHash('shake256', {
                        outputLength: 114
                    });
                default:
                    throw new TypeError('unrecognized or invalid EdDSA curve provided');
            }
        default:
            throw new TypeError('unrecognized or invalid JWS algorithm provided');
    }
}
function generate(token, alg, crv) {
    const digest = getHash(alg, crv).update(token).digest();
    return encode(digest.slice(0, digest.length / 2));
}
function validate(names, actual, source, alg, crv) {
    if (typeof names.claim !== 'string' || !names.claim) {
        throw new TypeError('names.claim must be a non-empty string');
    }
    if (typeof names.source !== 'string' || !names.source) {
        throw new TypeError('names.source must be a non-empty string');
    }
    assert(typeof actual === 'string' && actual, "".concat(names.claim, " must be a non-empty string"));
    assert(typeof source === 'string' && source, "".concat(names.source, " must be a non-empty string"));
    let expected;
    let msg;
    try {
        expected = generate(source, alg, crv);
    } catch (err) {
        msg = format('%s could not be validated (%s)', names.claim, err.message);
    }
    msg = msg || format('%s mismatch, expected %s, got: %s', names.claim, expected, actual);
    assert.equal(expected, actual, msg);
}
module.exports = {
    validate,
    generate
};
}),
"[project]/IT4409/Instagram-lite/node_modules/lru-cache/node_modules/yallist/iterator.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = function(Yallist) {
    Yallist.prototype[Symbol.iterator] = function*() {
        for(let walker = this.head; walker; walker = walker.next){
            yield walker.value;
        }
    };
};
}),
"[project]/IT4409/Instagram-lite/node_modules/lru-cache/node_modules/yallist/yallist.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = Yallist;
Yallist.Node = Node;
Yallist.create = Yallist;
function Yallist(list) {
    var self = this;
    if (!(self instanceof Yallist)) {
        self = new Yallist();
    }
    self.tail = null;
    self.head = null;
    self.length = 0;
    if (list && typeof list.forEach === 'function') {
        list.forEach(function(item) {
            self.push(item);
        });
    } else if (arguments.length > 0) {
        for(var i = 0, l = arguments.length; i < l; i++){
            self.push(arguments[i]);
        }
    }
    return self;
}
Yallist.prototype.removeNode = function(node) {
    if (node.list !== this) {
        throw new Error('removing node which does not belong to this list');
    }
    var next = node.next;
    var prev = node.prev;
    if (next) {
        next.prev = prev;
    }
    if (prev) {
        prev.next = next;
    }
    if (node === this.head) {
        this.head = next;
    }
    if (node === this.tail) {
        this.tail = prev;
    }
    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;
    return next;
};
Yallist.prototype.unshiftNode = function(node) {
    if (node === this.head) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
        head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
        this.tail = node;
    }
    this.length++;
};
Yallist.prototype.pushNode = function(node) {
    if (node === this.tail) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var tail = this.tail;
    node.list = this;
    node.prev = tail;
    if (tail) {
        tail.next = node;
    }
    this.tail = node;
    if (!this.head) {
        this.head = node;
    }
    this.length++;
};
Yallist.prototype.push = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        push(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.unshift = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        unshift(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.pop = function() {
    if (!this.tail) {
        return undefined;
    }
    var res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
        this.tail.next = null;
    } else {
        this.head = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.shift = function() {
    if (!this.head) {
        return undefined;
    }
    var res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
        this.head.prev = null;
    } else {
        this.tail = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.forEach = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.head, i = 0; walker !== null; i++){
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
    }
};
Yallist.prototype.forEachReverse = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.tail, i = this.length - 1; walker !== null; i--){
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
    }
};
Yallist.prototype.get = function(n) {
    for(var i = 0, walker = this.head; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.next;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.getReverse = function(n) {
    for(var i = 0, walker = this.tail; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.prev;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.map = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.head; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
    }
    return res;
};
Yallist.prototype.mapReverse = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.tail; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
    }
    return res;
};
Yallist.prototype.reduce = function(fn, initial) {
    var acc;
    var walker = this.head;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
    } else {
        throw new TypeError('Reduce of empty list with no initial value');
    }
    for(var i = 0; walker !== null; i++){
        acc = fn(acc, walker.value, i);
        walker = walker.next;
    }
    return acc;
};
Yallist.prototype.reduceReverse = function(fn, initial) {
    var acc;
    var walker = this.tail;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
    } else {
        throw new TypeError('Reduce of empty list with no initial value');
    }
    for(var i = this.length - 1; walker !== null; i--){
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
    }
    return acc;
};
Yallist.prototype.toArray = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.head; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.next;
    }
    return arr;
};
Yallist.prototype.toArrayReverse = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.tail; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.prev;
    }
    return arr;
};
Yallist.prototype.slice = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = 0, walker = this.head; walker !== null && i < from; i++){
        walker = walker.next;
    }
    for(; walker !== null && i < to; i++, walker = walker.next){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.sliceReverse = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = this.length, walker = this.tail; walker !== null && i > to; i--){
        walker = walker.prev;
    }
    for(; walker !== null && i > from; i--, walker = walker.prev){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.splice = function(start, deleteCount) {
    for(var _len = arguments.length, nodes = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        nodes[_key - 2] = arguments[_key];
    }
    if (start > this.length) {
        start = this.length - 1;
    }
    if (start < 0) {
        start = this.length + start;
    }
    for(var i = 0, walker = this.head; walker !== null && i < start; i++){
        walker = walker.next;
    }
    var ret = [];
    for(var i = 0; walker && i < deleteCount; i++){
        ret.push(walker.value);
        walker = this.removeNode(walker);
    }
    if (walker === null) {
        walker = this.tail;
    }
    if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
    }
    for(var i = 0; i < nodes.length; i++){
        walker = insert(this, walker, nodes[i]);
    }
    return ret;
};
Yallist.prototype.reverse = function() {
    var head = this.head;
    var tail = this.tail;
    for(var walker = head; walker !== null; walker = walker.prev){
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
};
function insert(self, node, value) {
    var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
    if (inserted.next === null) {
        self.tail = inserted;
    }
    if (inserted.prev === null) {
        self.head = inserted;
    }
    self.length++;
    return inserted;
}
function push(self, item) {
    self.tail = new Node(item, self.tail, null, self);
    if (!self.head) {
        self.head = self.tail;
    }
    self.length++;
}
function unshift(self, item) {
    self.head = new Node(item, null, self.head, self);
    if (!self.tail) {
        self.tail = self.head;
    }
    self.length++;
}
function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
    }
    this.list = list;
    this.value = value;
    if (prev) {
        prev.next = this;
        this.prev = prev;
    } else {
        this.prev = null;
    }
    if (next) {
        next.prev = this;
        this.next = next;
    } else {
        this.next = null;
    }
}
try {
    // add if support for Symbol.iterator is present
    __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/lru-cache/node_modules/yallist/iterator.js [app-client] (ecmascript)")(Yallist);
} catch (er) {}
}),
"[project]/IT4409/Instagram-lite/node_modules/lru-cache/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// A linked list to keep track of recently-used-ness
const Yallist = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/lru-cache/node_modules/yallist/yallist.js [app-client] (ecmascript)");
const MAX = Symbol('max');
const LENGTH = Symbol('length');
const LENGTH_CALCULATOR = Symbol('lengthCalculator');
const ALLOW_STALE = Symbol('allowStale');
const MAX_AGE = Symbol('maxAge');
const DISPOSE = Symbol('dispose');
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
const LRU_LIST = Symbol('lruList');
const CACHE = Symbol('cache');
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');
const naiveLength = ()=>1;
// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
    // resize the cache when the max changes.
    set max(mL) {
        if (typeof mL !== 'number' || mL < 0) throw new TypeError('max must be a non-negative number');
        this[MAX] = mL || Infinity;
        trim(this);
    }
    get max() {
        return this[MAX];
    }
    set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
    }
    get allowStale() {
        return this[ALLOW_STALE];
    }
    set maxAge(mA) {
        if (typeof mA !== 'number') throw new TypeError('maxAge must be a non-negative number');
        this[MAX_AGE] = mA;
        trim(this);
    }
    get maxAge() {
        return this[MAX_AGE];
    }
    // resize the cache when the lengthCalculator changes.
    set lengthCalculator(lC) {
        if (typeof lC !== 'function') lC = naiveLength;
        if (lC !== this[LENGTH_CALCULATOR]) {
            this[LENGTH_CALCULATOR] = lC;
            this[LENGTH] = 0;
            this[LRU_LIST].forEach((hit)=>{
                hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
                this[LENGTH] += hit.length;
            });
        }
        trim(this);
    }
    get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
    }
    get length() {
        return this[LENGTH];
    }
    get itemCount() {
        return this[LRU_LIST].length;
    }
    rforEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].tail; walker !== null;){
            const prev = walker.prev;
            forEachStep(this, fn, walker, thisp);
            walker = prev;
        }
    }
    forEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].head; walker !== null;){
            const next = walker.next;
            forEachStep(this, fn, walker, thisp);
            walker = next;
        }
    }
    keys() {
        return this[LRU_LIST].toArray().map((k)=>k.key);
    }
    values() {
        return this[LRU_LIST].toArray().map((k)=>k.value);
    }
    reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
            this[LRU_LIST].forEach((hit)=>this[DISPOSE](hit.key, hit.value));
        }
        this[CACHE] = new Map(); // hash of items by key
        this[LRU_LIST] = new Yallist(); // list of items in order of use recency
        this[LENGTH] = 0; // length of items in the list
    }
    dump() {
        return this[LRU_LIST].map((hit)=>isStale(this, hit) ? false : {
                k: hit.key,
                v: hit.value,
                e: hit.now + (hit.maxAge || 0)
            }).toArray().filter((h)=>h);
    }
    dumpLru() {
        return this[LRU_LIST];
    }
    set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== 'number') throw new TypeError('maxAge must be a number');
        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);
        if (this[CACHE].has(key)) {
            if (len > this[MAX]) {
                del(this, this[CACHE].get(key));
                return false;
            }
            const node = this[CACHE].get(key);
            const item = node.value;
            // dispose of the old one before overwriting
            // split out into 2 ifs for better coverage tracking
            if (this[DISPOSE]) {
                if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
            }
            item.now = now;
            item.maxAge = maxAge;
            item.value = value;
            this[LENGTH] += len - item.length;
            item.length = len;
            this.get(key);
            trim(this);
            return true;
        }
        const hit = new Entry(key, value, len, now, maxAge);
        // oversized objects fall out of cache automatically.
        if (hit.length > this[MAX]) {
            if (this[DISPOSE]) this[DISPOSE](key, value);
            return false;
        }
        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
    }
    has(key) {
        if (!this[CACHE].has(key)) return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
    }
    get(key) {
        return get(this, key, true);
    }
    peek(key) {
        return get(this, key, false);
    }
    pop() {
        const node = this[LRU_LIST].tail;
        if (!node) return null;
        del(this, node);
        return node.value;
    }
    del(key) {
        del(this, this[CACHE].get(key));
    }
    load(arr) {
        // reset the cache
        this.reset();
        const now = Date.now();
        // A previous serialized cache has the most recent items first
        for(let l = arr.length - 1; l >= 0; l--){
            const hit = arr[l];
            const expiresAt = hit.e || 0;
            if (expiresAt === 0) // the item was created without expiration in a non aged cache
            this.set(hit.k, hit.v);
            else {
                const maxAge = expiresAt - now;
                // dont add already expired items
                if (maxAge > 0) {
                    this.set(hit.k, hit.v, maxAge);
                }
            }
        }
    }
    prune() {
        this[CACHE].forEach((value, key)=>get(this, key, false));
    }
    constructor(options){
        if (typeof options === 'number') options = {
            max: options
        };
        if (!options) options = {};
        if (options.max && (typeof options.max !== 'number' || options.max < 0)) throw new TypeError('max must be a non-negative number');
        // Kind of weird to have a default max of Infinity, but oh well.
        const max = this[MAX] = options.max || Infinity;
        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== 'function' ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== 'number') throw new TypeError('maxAge must be a number');
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
    }
}
const get = (self, key, doUse)=>{
    const node = self[CACHE].get(key);
    if (node) {
        const hit = node.value;
        if (isStale(self, hit)) {
            del(self, node);
            if (!self[ALLOW_STALE]) return undefined;
        } else {
            if (doUse) {
                if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
                self[LRU_LIST].unshiftNode(node);
            }
        }
        return hit.value;
    }
};
const isStale = (self, hit)=>{
    if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
    const diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};
const trim = (self)=>{
    if (self[LENGTH] > self[MAX]) {
        for(let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;){
            // We know that we're about to delete this one, and also
            // what the next least recently used key will be, so just
            // go ahead and set it now.
            const prev = walker.prev;
            del(self, walker);
            walker = prev;
        }
    }
};
const del = (self, node)=>{
    if (node) {
        const hit = node.value;
        if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
        self[LENGTH] -= hit.length;
        self[CACHE].delete(hit.key);
        self[LRU_LIST].removeNode(node);
    }
};
class Entry {
    constructor(key, value, length, now, maxAge){
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
    }
}
const forEachStep = (self, fn, node, thisp)=>{
    let hit = node.value;
    if (isStale(self, hit)) {
        del(self, node);
        if (!self[ALLOW_STALE]) hit = undefined;
    }
    if (hit) fn.call(thisp, hit.value, hit.key, self);
};
module.exports = LRUCache;
}),
"[project]/IT4409/Instagram-lite/node_modules/object-hash/dist/object_hash.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

!function(e) {
    var t;
    ("TURBOPACK compile-time truthy", 1) ? module.exports = e() : "TURBOPACK unreachable";
}(function() {
    return (function o(i, u, a) {
        function s(n, e) {
            if (!u[n]) {
                if (!i[n]) {
                    var t = "function" == ("TURBOPACK compile-time value", "function") && /*TURBOPACK member replacement*/ __turbopack_context__.t;
                    if (!e && t) return t(n, !0);
                    if ("TURBOPACK compile-time truthy", 1) return f(n, !0);
                    //TURBOPACK unreachable
                    ;
                }
                var r = u[n] = {
                    exports: {}
                };
                i[n][0].call(r.exports, function(e) {
                    var t = i[n][1][e];
                    return s(t || e);
                }, r, r.exports, o, i, u, a);
            }
            return u[n].exports;
        }
        for(var f = "function" == ("TURBOPACK compile-time value", "function") && /*TURBOPACK member replacement*/ __turbopack_context__.t, e = 0; e < a.length; e++)s(a[e]);
        return s;
    })({
        1: [
            function(w, b, m) {
                (function(e, t, f, n, r, o, i, u, a) {
                    "use strict";
                    var s = w("crypto");
                    function c(e, t) {
                        return function(e, t) {
                            var n;
                            n = "passthrough" !== t.algorithm ? s.createHash(t.algorithm) : new y;
                            void 0 === n.write && (n.write = n.update, n.end = n.update);
                            g(t, n).dispatch(e), n.update || n.end("");
                            if (n.digest) return n.digest("buffer" === t.encoding ? void 0 : t.encoding);
                            var r = n.read();
                            return "buffer" !== t.encoding ? r.toString(t.encoding) : r;
                        }(e, t = h(e, t));
                    }
                    (m = b.exports = c).sha1 = function(e) {
                        return c(e);
                    }, m.keys = function(e) {
                        return c(e, {
                            excludeValues: !0,
                            algorithm: "sha1",
                            encoding: "hex"
                        });
                    }, m.MD5 = function(e) {
                        return c(e, {
                            algorithm: "md5",
                            encoding: "hex"
                        });
                    }, m.keysMD5 = function(e) {
                        return c(e, {
                            algorithm: "md5",
                            encoding: "hex",
                            excludeValues: !0
                        });
                    };
                    var l = s.getHashes ? s.getHashes().slice() : [
                        "sha1",
                        "md5"
                    ];
                    l.push("passthrough");
                    var d = [
                        "buffer",
                        "hex",
                        "binary",
                        "base64"
                    ];
                    function h(e, t) {
                        t = t || {};
                        var n = {};
                        if (n.algorithm = t.algorithm || "sha1", n.encoding = t.encoding || "hex", n.excludeValues = !!t.excludeValues, n.algorithm = n.algorithm.toLowerCase(), n.encoding = n.encoding.toLowerCase(), n.ignoreUnknown = !0 === t.ignoreUnknown, n.respectType = !1 !== t.respectType, n.respectFunctionNames = !1 !== t.respectFunctionNames, n.respectFunctionProperties = !1 !== t.respectFunctionProperties, n.unorderedArrays = !0 === t.unorderedArrays, n.unorderedSets = !1 !== t.unorderedSets, n.unorderedObjects = !1 !== t.unorderedObjects, n.replacer = t.replacer || void 0, n.excludeKeys = t.excludeKeys || void 0, void 0 === e) throw new Error("Object argument required.");
                        for(var r = 0; r < l.length; ++r)l[r].toLowerCase() === n.algorithm.toLowerCase() && (n.algorithm = l[r]);
                        if (-1 === l.indexOf(n.algorithm)) throw new Error('Algorithm "' + n.algorithm + '"  not supported. supported values: ' + l.join(", "));
                        if (-1 === d.indexOf(n.encoding) && "passthrough" !== n.algorithm) throw new Error('Encoding "' + n.encoding + '"  not supported. supported values: ' + d.join(", "));
                        return n;
                    }
                    function p(e) {
                        if ("function" == typeof e) {
                            return null != /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(e));
                        }
                    }
                    function g(u, t, a) {
                        a = a || [];
                        function s(e) {
                            return t.update ? t.update(e, "utf8") : t.write(e, "utf8");
                        }
                        return {
                            dispatch: function(e) {
                                return u.replacer && (e = u.replacer(e)), this["_" + (null === e ? "null" : typeof e)](e);
                            },
                            _object: function(t) {
                                var e = Object.prototype.toString.call(t), n = /\[object (.*)\]/i.exec(e);
                                n = (n = n ? n[1] : "unknown:[" + e + "]").toLowerCase();
                                var r;
                                if (0 <= (r = a.indexOf(t))) return this.dispatch("[CIRCULAR:" + r + "]");
                                if (a.push(t), void 0 !== f && f.isBuffer && f.isBuffer(t)) return s("buffer:"), s(t);
                                if ("object" === n || "function" === n || "asyncfunction" === n) {
                                    var o = Object.keys(t);
                                    u.unorderedObjects && (o = o.sort()), !1 === u.respectType || p(t) || o.splice(0, 0, "prototype", "__proto__", "constructor"), u.excludeKeys && (o = o.filter(function(e) {
                                        return !u.excludeKeys(e);
                                    })), s("object:" + o.length + ":");
                                    var i = this;
                                    return o.forEach(function(e) {
                                        i.dispatch(e), s(":"), u.excludeValues || i.dispatch(t[e]), s(",");
                                    });
                                }
                                if (!this["_" + n]) {
                                    if (u.ignoreUnknown) return s("[" + n + "]");
                                    throw new Error('Unknown object type "' + n + '"');
                                }
                                this["_" + n](t);
                            },
                            _array: function(e, t) {
                                t = void 0 !== t ? t : !1 !== u.unorderedArrays;
                                var n = this;
                                if (s("array:" + e.length + ":"), !t || e.length <= 1) return e.forEach(function(e) {
                                    return n.dispatch(e);
                                });
                                var r = [], o = e.map(function(e) {
                                    var t = new y, n = a.slice();
                                    return g(u, t, n).dispatch(e), r = r.concat(n.slice(a.length)), t.read().toString();
                                });
                                return a = a.concat(r), o.sort(), this._array(o, !1);
                            },
                            _date: function(e) {
                                return s("date:" + e.toJSON());
                            },
                            _symbol: function(e) {
                                return s("symbol:" + e.toString());
                            },
                            _error: function(e) {
                                return s("error:" + e.toString());
                            },
                            _boolean: function(e) {
                                return s("bool:" + e.toString());
                            },
                            _string: function(e) {
                                s("string:" + e.length + ":"), s(e.toString());
                            },
                            _function: function(e) {
                                s("fn:"), p(e) ? this.dispatch("[native]") : this.dispatch(e.toString()), !1 !== u.respectFunctionNames && this.dispatch("function-name:" + String(e.name)), u.respectFunctionProperties && this._object(e);
                            },
                            _number: function(e) {
                                return s("number:" + e.toString());
                            },
                            _xml: function(e) {
                                return s("xml:" + e.toString());
                            },
                            _null: function() {
                                return s("Null");
                            },
                            _undefined: function() {
                                return s("Undefined");
                            },
                            _regexp: function(e) {
                                return s("regex:" + e.toString());
                            },
                            _uint8array: function(e) {
                                return s("uint8array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _uint8clampedarray: function(e) {
                                return s("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _int8array: function(e) {
                                return s("uint8array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _uint16array: function(e) {
                                return s("uint16array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _int16array: function(e) {
                                return s("uint16array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _uint32array: function(e) {
                                return s("uint32array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _int32array: function(e) {
                                return s("uint32array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _float32array: function(e) {
                                return s("float32array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _float64array: function(e) {
                                return s("float64array:"), this.dispatch(Array.prototype.slice.call(e));
                            },
                            _arraybuffer: function(e) {
                                return s("arraybuffer:"), this.dispatch(new Uint8Array(e));
                            },
                            _url: function(e) {
                                return s("url:" + e.toString());
                            },
                            _map: function(e) {
                                s("map:");
                                var t = Array.from(e);
                                return this._array(t, !1 !== u.unorderedSets);
                            },
                            _set: function(e) {
                                s("set:");
                                var t = Array.from(e);
                                return this._array(t, !1 !== u.unorderedSets);
                            },
                            _file: function(e) {
                                return s("file:"), this.dispatch([
                                    e.name,
                                    e.size,
                                    e.type,
                                    e.lastModfied
                                ]);
                            },
                            _blob: function() {
                                if (u.ignoreUnknown) return s("[blob]");
                                throw Error('Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse "options.replacer" or "options.ignoreUnknown"\n');
                            },
                            _domwindow: function() {
                                return s("domwindow");
                            },
                            _bigint: function(e) {
                                return s("bigint:" + e.toString());
                            },
                            _process: function() {
                                return s("process");
                            },
                            _timer: function() {
                                return s("timer");
                            },
                            _pipe: function() {
                                return s("pipe");
                            },
                            _tcp: function() {
                                return s("tcp");
                            },
                            _udp: function() {
                                return s("udp");
                            },
                            _tty: function() {
                                return s("tty");
                            },
                            _statwatcher: function() {
                                return s("statwatcher");
                            },
                            _securecontext: function() {
                                return s("securecontext");
                            },
                            _connection: function() {
                                return s("connection");
                            },
                            _zlib: function() {
                                return s("zlib");
                            },
                            _context: function() {
                                return s("context");
                            },
                            _nodescript: function() {
                                return s("nodescript");
                            },
                            _httpparser: function() {
                                return s("httpparser");
                            },
                            _dataview: function() {
                                return s("dataview");
                            },
                            _signal: function() {
                                return s("signal");
                            },
                            _fsevent: function() {
                                return s("fsevent");
                            },
                            _tlswrap: function() {
                                return s("tlswrap");
                            }
                        };
                    }
                    function y() {
                        return {
                            buf: "",
                            write: function(e) {
                                this.buf += e;
                            },
                            end: function(e) {
                                this.buf += e;
                            },
                            read: function() {
                                return this.buf;
                            }
                        };
                    }
                    m.writeToStream = function(e, t, n) {
                        return void 0 === n && (n = t, t = {}), g(t = h(e, t), n).dispatch(e);
                    };
                }).call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_7eac155c.js", "/");
            },
            {
                buffer: 3,
                crypto: 5,
                lYpoI2: 10
            }
        ],
        2: [
            function(e, t, f) {
                (function(e, t, n, r, o, i, u, a, s) {
                    !function(e) {
                        "use strict";
                        var f = "undefined" != typeof Uint8Array ? Uint8Array : Array, n = "+".charCodeAt(0), r = "/".charCodeAt(0), o = "0".charCodeAt(0), i = "a".charCodeAt(0), u = "A".charCodeAt(0), a = "-".charCodeAt(0), s = "_".charCodeAt(0);
                        function c(e) {
                            var t = e.charCodeAt(0);
                            return t === n || t === a ? 62 : t === r || t === s ? 63 : t < o ? -1 : t < o + 10 ? t - o + 26 + 26 : t < u + 26 ? t - u : t < i + 26 ? t - i + 26 : void 0;
                        }
                        e.toByteArray = function(e) {
                            var t, n;
                            if (0 < e.length % 4) throw new Error("Invalid string. Length must be a multiple of 4");
                            var r = e.length, o = "=" === e.charAt(r - 2) ? 2 : "=" === e.charAt(r - 1) ? 1 : 0, i = new f(3 * e.length / 4 - o), u = 0 < o ? e.length - 4 : e.length, a = 0;
                            function s(e) {
                                i[a++] = e;
                            }
                            for(t = 0; t < u; t += 4, 0)s((16711680 & (n = c(e.charAt(t)) << 18 | c(e.charAt(t + 1)) << 12 | c(e.charAt(t + 2)) << 6 | c(e.charAt(t + 3)))) >> 16), s((65280 & n) >> 8), s(255 & n);
                            return 2 == o ? s(255 & (n = c(e.charAt(t)) << 2 | c(e.charAt(t + 1)) >> 4)) : 1 == o && (s((n = c(e.charAt(t)) << 10 | c(e.charAt(t + 1)) << 4 | c(e.charAt(t + 2)) >> 2) >> 8 & 255), s(255 & n)), i;
                        }, e.fromByteArray = function(e) {
                            var t, n, r, o, i = e.length % 3, u = "";
                            function a(e) {
                                return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e);
                            }
                            for(t = 0, r = e.length - i; t < r; t += 3)n = (e[t] << 16) + (e[t + 1] << 8) + e[t + 2], u += a((o = n) >> 18 & 63) + a(o >> 12 & 63) + a(o >> 6 & 63) + a(63 & o);
                            switch(i){
                                case 1:
                                    u += a((n = e[e.length - 1]) >> 2), u += a(n << 4 & 63), u += "==";
                                    break;
                                case 2:
                                    u += a((n = (e[e.length - 2] << 8) + e[e.length - 1]) >> 10), u += a(n >> 4 & 63), u += a(n << 2 & 63), u += "=";
                            }
                            return u;
                        };
                    }(void 0 === f ? this.base64js = {} : f);
                }).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js", "/node_modules/gulp-browserify/node_modules/base64-js/lib");
            },
            {
                buffer: 3,
                lYpoI2: 10
            }
        ],
        3: [
            function(O, e, H) {
                (function(e, t, g, n, r, o, i, u, a) {
                    var s = O("base64-js"), f = O("ieee754");
                    function g(e, t, n) {
                        if (!(this instanceof g)) return new g(e, t, n);
                        var r, o, i, u, a, s = typeof e;
                        if ("base64" === t && "string" == s) for(e = (r = e).trim ? r.trim() : r.replace(/^\s+|\s+$/g, ""); e.length % 4 != 0;)e += "=";
                        if ("number" == s) o = x(e);
                        else if ("string" == s) o = g.byteLength(e, t);
                        else {
                            if ("object" != s) throw new Error("First argument needs to be a number, array or string.");
                            o = x(e.length);
                        }
                        if (g._useTypedArrays ? i = g._augment(new Uint8Array(o)) : ((i = this).length = o, i._isBuffer = !0), g._useTypedArrays && "number" == typeof e.byteLength) i._set(e);
                        else if (S(a = e) || g.isBuffer(a) || a && "object" == typeof a && "number" == typeof a.length) for(u = 0; u < o; u++)g.isBuffer(e) ? i[u] = e.readUInt8(u) : i[u] = e[u];
                        else if ("string" == s) i.write(e, 0, t);
                        else if ("number" == s && !g._useTypedArrays && !n) for(u = 0; u < o; u++)i[u] = 0;
                        return i;
                    }
                    function y(e, t, n, r) {
                        return g._charsWritten = T(function(e) {
                            for(var t = [], n = 0; n < e.length; n++)t.push(255 & e.charCodeAt(n));
                            return t;
                        }(t), e, n, r);
                    }
                    function w(e, t, n, r) {
                        return g._charsWritten = T(function(e) {
                            for(var t, n, r, o = [], i = 0; i < e.length; i++)t = e.charCodeAt(i), n = t >> 8, r = t % 256, o.push(r), o.push(n);
                            return o;
                        }(t), e, n, r);
                    }
                    function c(e, t, n) {
                        var r = "";
                        n = Math.min(e.length, n);
                        for(var o = t; o < n; o++)r += String.fromCharCode(e[o]);
                        return r;
                    }
                    function l(e, t, n, r) {
                        r || (D("boolean" == typeof n, "missing or invalid endian"), D(null != t, "missing offset"), D(t + 1 < e.length, "Trying to read beyond buffer length"));
                        var o, i = e.length;
                        if (!(i <= t)) return n ? (o = e[t], t + 1 < i && (o |= e[t + 1] << 8)) : (o = e[t] << 8, t + 1 < i && (o |= e[t + 1])), o;
                    }
                    function d(e, t, n, r) {
                        r || (D("boolean" == typeof n, "missing or invalid endian"), D(null != t, "missing offset"), D(t + 3 < e.length, "Trying to read beyond buffer length"));
                        var o, i = e.length;
                        if (!(i <= t)) return n ? (t + 2 < i && (o = e[t + 2] << 16), t + 1 < i && (o |= e[t + 1] << 8), o |= e[t], t + 3 < i && (o += e[t + 3] << 24 >>> 0)) : (t + 1 < i && (o = e[t + 1] << 16), t + 2 < i && (o |= e[t + 2] << 8), t + 3 < i && (o |= e[t + 3]), o += e[t] << 24 >>> 0), o;
                    }
                    function h(e, t, n, r) {
                        if (r || (D("boolean" == typeof n, "missing or invalid endian"), D(null != t, "missing offset"), D(t + 1 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) {
                            var o = l(e, t, n, !0);
                            return 32768 & o ? -1 * (65535 - o + 1) : o;
                        }
                    }
                    function p(e, t, n, r) {
                        if (r || (D("boolean" == typeof n, "missing or invalid endian"), D(null != t, "missing offset"), D(t + 3 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) {
                            var o = d(e, t, n, !0);
                            return 2147483648 & o ? -1 * (4294967295 - o + 1) : o;
                        }
                    }
                    function b(e, t, n, r) {
                        return r || (D("boolean" == typeof n, "missing or invalid endian"), D(t + 3 < e.length, "Trying to read beyond buffer length")), f.read(e, t, n, 23, 4);
                    }
                    function m(e, t, n, r) {
                        return r || (D("boolean" == typeof n, "missing or invalid endian"), D(t + 7 < e.length, "Trying to read beyond buffer length")), f.read(e, t, n, 52, 8);
                    }
                    function v(e, t, n, r, o) {
                        o || (D(null != t, "missing value"), D("boolean" == typeof r, "missing or invalid endian"), D(null != n, "missing offset"), D(n + 1 < e.length, "trying to write beyond buffer length"), N(t, 65535));
                        var i = e.length;
                        if (!(i <= n)) for(var u = 0, a = Math.min(i - n, 2); u < a; u++)e[n + u] = (t & 255 << 8 * (r ? u : 1 - u)) >>> 8 * (r ? u : 1 - u);
                    }
                    function _(e, t, n, r, o) {
                        o || (D(null != t, "missing value"), D("boolean" == typeof r, "missing or invalid endian"), D(null != n, "missing offset"), D(n + 3 < e.length, "trying to write beyond buffer length"), N(t, 4294967295));
                        var i = e.length;
                        if (!(i <= n)) for(var u = 0, a = Math.min(i - n, 4); u < a; u++)e[n + u] = t >>> 8 * (r ? u : 3 - u) & 255;
                    }
                    function E(e, t, n, r, o) {
                        o || (D(null != t, "missing value"), D("boolean" == typeof r, "missing or invalid endian"), D(null != n, "missing offset"), D(n + 1 < e.length, "Trying to write beyond buffer length"), Y(t, 32767, -32768)), e.length <= n || v(e, 0 <= t ? t : 65535 + t + 1, n, r, o);
                    }
                    function I(e, t, n, r, o) {
                        o || (D(null != t, "missing value"), D("boolean" == typeof r, "missing or invalid endian"), D(null != n, "missing offset"), D(n + 3 < e.length, "Trying to write beyond buffer length"), Y(t, 2147483647, -2147483648)), e.length <= n || _(e, 0 <= t ? t : 4294967295 + t + 1, n, r, o);
                    }
                    function A(e, t, n, r, o) {
                        o || (D(null != t, "missing value"), D("boolean" == typeof r, "missing or invalid endian"), D(null != n, "missing offset"), D(n + 3 < e.length, "Trying to write beyond buffer length"), F(t, 34028234663852886e22, -34028234663852886e22)), e.length <= n || f.write(e, t, n, r, 23, 4);
                    }
                    function B(e, t, n, r, o) {
                        o || (D(null != t, "missing value"), D("boolean" == typeof r, "missing or invalid endian"), D(null != n, "missing offset"), D(n + 7 < e.length, "Trying to write beyond buffer length"), F(t, 17976931348623157e292, -17976931348623157e292)), e.length <= n || f.write(e, t, n, r, 52, 8);
                    }
                    H.Buffer = g, H.SlowBuffer = g, H.INSPECT_MAX_BYTES = 50, g.poolSize = 8192, g._useTypedArrays = function() {
                        try {
                            var e = new ArrayBuffer(0), t = new Uint8Array(e);
                            return t.foo = function() {
                                return 42;
                            }, 42 === t.foo() && "function" == typeof t.subarray;
                        } catch (e) {
                            return !1;
                        }
                    }(), g.isEncoding = function(e) {
                        switch(String(e).toLowerCase()){
                            case "hex":
                            case "utf8":
                            case "utf-8":
                            case "ascii":
                            case "binary":
                            case "base64":
                            case "raw":
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return !0;
                            default:
                                return !1;
                        }
                    }, g.isBuffer = function(e) {
                        return !(null == e || !e._isBuffer);
                    }, g.byteLength = function(e, t) {
                        var n;
                        switch(e += "", t || "utf8"){
                            case "hex":
                                n = e.length / 2;
                                break;
                            case "utf8":
                            case "utf-8":
                                n = C(e).length;
                                break;
                            case "ascii":
                            case "binary":
                            case "raw":
                                n = e.length;
                                break;
                            case "base64":
                                n = k(e).length;
                                break;
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                n = 2 * e.length;
                                break;
                            default:
                                throw new Error("Unknown encoding");
                        }
                        return n;
                    }, g.concat = function(e, t) {
                        if (D(S(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === e.length) return new g(0);
                        if (1 === e.length) return e[0];
                        if ("number" != typeof t) for(o = t = 0; o < e.length; o++)t += e[o].length;
                        for(var n = new g(t), r = 0, o = 0; o < e.length; o++){
                            var i = e[o];
                            i.copy(n, r), r += i.length;
                        }
                        return n;
                    }, g.prototype.write = function(e, t, n, r) {
                        var o;
                        isFinite(t) ? isFinite(n) || (r = n, n = void 0) : (o = r, r = t, t = n, n = o), t = Number(t) || 0;
                        var i, u, a, s, f, c, l, d, h, p = this.length - t;
                        switch((!n || p < (n = Number(n))) && (n = p), r = String(r || "utf8").toLowerCase()){
                            case "hex":
                                i = function(e, t, n, r) {
                                    n = Number(n) || 0;
                                    var o = e.length - n;
                                    (!r || o < (r = Number(r))) && (r = o);
                                    var i = t.length;
                                    D(i % 2 == 0, "Invalid hex string"), i / 2 < r && (r = i / 2);
                                    for(var u = 0; u < r; u++){
                                        var a = parseInt(t.substr(2 * u, 2), 16);
                                        D(!isNaN(a), "Invalid hex string"), e[n + u] = a;
                                    }
                                    return g._charsWritten = 2 * u, u;
                                }(this, e, t, n);
                                break;
                            case "utf8":
                            case "utf-8":
                                c = this, l = e, d = t, h = n, i = g._charsWritten = T(C(l), c, d, h);
                                break;
                            case "ascii":
                            case "binary":
                                i = y(this, e, t, n);
                                break;
                            case "base64":
                                u = this, a = e, s = t, f = n, i = g._charsWritten = T(k(a), u, s, f);
                                break;
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                i = w(this, e, t, n);
                                break;
                            default:
                                throw new Error("Unknown encoding");
                        }
                        return i;
                    }, g.prototype.toString = function(e, t, n) {
                        var r, o, i, u, a = this;
                        if (e = String(e || "utf8").toLowerCase(), t = Number(t) || 0, (n = void 0 !== n ? Number(n) : n = a.length) === t) return "";
                        switch(e){
                            case "hex":
                                r = function(e, t, n) {
                                    var r = e.length;
                                    (!t || t < 0) && (t = 0);
                                    (!n || n < 0 || r < n) && (n = r);
                                    for(var o = "", i = t; i < n; i++)o += j(e[i]);
                                    return o;
                                }(a, t, n);
                                break;
                            case "utf8":
                            case "utf-8":
                                r = function(e, t, n) {
                                    var r = "", o = "";
                                    n = Math.min(e.length, n);
                                    for(var i = t; i < n; i++)e[i] <= 127 ? (r += M(o) + String.fromCharCode(e[i]), o = "") : o += "%" + e[i].toString(16);
                                    return r + M(o);
                                }(a, t, n);
                                break;
                            case "ascii":
                            case "binary":
                                r = c(a, t, n);
                                break;
                            case "base64":
                                o = a, u = n, r = 0 === (i = t) && u === o.length ? s.fromByteArray(o) : s.fromByteArray(o.slice(i, u));
                                break;
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                r = function(e, t, n) {
                                    for(var r = e.slice(t, n), o = "", i = 0; i < r.length; i += 2)o += String.fromCharCode(r[i] + 256 * r[i + 1]);
                                    return o;
                                }(a, t, n);
                                break;
                            default:
                                throw new Error("Unknown encoding");
                        }
                        return r;
                    }, g.prototype.toJSON = function() {
                        return {
                            type: "Buffer",
                            data: Array.prototype.slice.call(this._arr || this, 0)
                        };
                    }, g.prototype.copy = function(e, t, n, r) {
                        if (n = n || 0, r || 0 === r || (r = this.length), t = t || 0, r !== n && 0 !== e.length && 0 !== this.length) {
                            D(n <= r, "sourceEnd < sourceStart"), D(0 <= t && t < e.length, "targetStart out of bounds"), D(0 <= n && n < this.length, "sourceStart out of bounds"), D(0 <= r && r <= this.length, "sourceEnd out of bounds"), r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
                            var o = r - n;
                            if (o < 100 || !g._useTypedArrays) for(var i = 0; i < o; i++)e[i + t] = this[i + n];
                            else e._set(this.subarray(n, n + o), t);
                        }
                    }, g.prototype.slice = function(e, t) {
                        var n = this.length;
                        if (e = U(e, n, 0), t = U(t, n, n), g._useTypedArrays) return g._augment(this.subarray(e, t));
                        for(var r = t - e, o = new g(r, void 0, !0), i = 0; i < r; i++)o[i] = this[i + e];
                        return o;
                    }, g.prototype.get = function(e) {
                        return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e);
                    }, g.prototype.set = function(e, t) {
                        return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t);
                    }, g.prototype.readUInt8 = function(e, t) {
                        if (t || (D(null != e, "missing offset"), D(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return this[e];
                    }, g.prototype.readUInt16LE = function(e, t) {
                        return l(this, e, !0, t);
                    }, g.prototype.readUInt16BE = function(e, t) {
                        return l(this, e, !1, t);
                    }, g.prototype.readUInt32LE = function(e, t) {
                        return d(this, e, !0, t);
                    }, g.prototype.readUInt32BE = function(e, t) {
                        return d(this, e, !1, t);
                    }, g.prototype.readInt8 = function(e, t) {
                        if (t || (D(null != e, "missing offset"), D(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
                    }, g.prototype.readInt16LE = function(e, t) {
                        return h(this, e, !0, t);
                    }, g.prototype.readInt16BE = function(e, t) {
                        return h(this, e, !1, t);
                    }, g.prototype.readInt32LE = function(e, t) {
                        return p(this, e, !0, t);
                    }, g.prototype.readInt32BE = function(e, t) {
                        return p(this, e, !1, t);
                    }, g.prototype.readFloatLE = function(e, t) {
                        return b(this, e, !0, t);
                    }, g.prototype.readFloatBE = function(e, t) {
                        return b(this, e, !1, t);
                    }, g.prototype.readDoubleLE = function(e, t) {
                        return m(this, e, !0, t);
                    }, g.prototype.readDoubleBE = function(e, t) {
                        return m(this, e, !1, t);
                    }, g.prototype.writeUInt8 = function(e, t, n) {
                        n || (D(null != e, "missing value"), D(null != t, "missing offset"), D(t < this.length, "trying to write beyond buffer length"), N(e, 255)), t >= this.length || (this[t] = e);
                    }, g.prototype.writeUInt16LE = function(e, t, n) {
                        v(this, e, t, !0, n);
                    }, g.prototype.writeUInt16BE = function(e, t, n) {
                        v(this, e, t, !1, n);
                    }, g.prototype.writeUInt32LE = function(e, t, n) {
                        _(this, e, t, !0, n);
                    }, g.prototype.writeUInt32BE = function(e, t, n) {
                        _(this, e, t, !1, n);
                    }, g.prototype.writeInt8 = function(e, t, n) {
                        n || (D(null != e, "missing value"), D(null != t, "missing offset"), D(t < this.length, "Trying to write beyond buffer length"), Y(e, 127, -128)), t >= this.length || (0 <= e ? this.writeUInt8(e, t, n) : this.writeUInt8(255 + e + 1, t, n));
                    }, g.prototype.writeInt16LE = function(e, t, n) {
                        E(this, e, t, !0, n);
                    }, g.prototype.writeInt16BE = function(e, t, n) {
                        E(this, e, t, !1, n);
                    }, g.prototype.writeInt32LE = function(e, t, n) {
                        I(this, e, t, !0, n);
                    }, g.prototype.writeInt32BE = function(e, t, n) {
                        I(this, e, t, !1, n);
                    }, g.prototype.writeFloatLE = function(e, t, n) {
                        A(this, e, t, !0, n);
                    }, g.prototype.writeFloatBE = function(e, t, n) {
                        A(this, e, t, !1, n);
                    }, g.prototype.writeDoubleLE = function(e, t, n) {
                        B(this, e, t, !0, n);
                    }, g.prototype.writeDoubleBE = function(e, t, n) {
                        B(this, e, t, !1, n);
                    }, g.prototype.fill = function(e, t, n) {
                        if (e = e || 0, t = t || 0, n = n || this.length, "string" == typeof e && (e = e.charCodeAt(0)), D("number" == typeof e && !isNaN(e), "value is not a number"), D(t <= n, "end < start"), n !== t && 0 !== this.length) {
                            D(0 <= t && t < this.length, "start out of bounds"), D(0 <= n && n <= this.length, "end out of bounds");
                            for(var r = t; r < n; r++)this[r] = e;
                        }
                    }, g.prototype.inspect = function() {
                        for(var e = [], t = this.length, n = 0; n < t; n++)if (e[n] = j(this[n]), n === H.INSPECT_MAX_BYTES) {
                            e[n + 1] = "...";
                            break;
                        }
                        return "<Buffer " + e.join(" ") + ">";
                    }, g.prototype.toArrayBuffer = function() {
                        if ("undefined" == typeof Uint8Array) throw new Error("Buffer.toArrayBuffer not supported in this browser");
                        if (g._useTypedArrays) return new g(this).buffer;
                        for(var e = new Uint8Array(this.length), t = 0, n = e.length; t < n; t += 1)e[t] = this[t];
                        return e.buffer;
                    };
                    var L = g.prototype;
                    function U(e, t, n) {
                        return "number" != typeof e ? n : t <= (e = ~~e) ? t : 0 <= e || 0 <= (e += t) ? e : 0;
                    }
                    function x(e) {
                        return (e = ~~Math.ceil(+e)) < 0 ? 0 : e;
                    }
                    function S(e) {
                        return (Array.isArray || function(e) {
                            return "[object Array]" === Object.prototype.toString.call(e);
                        })(e);
                    }
                    function j(e) {
                        return e < 16 ? "0" + e.toString(16) : e.toString(16);
                    }
                    function C(e) {
                        for(var t = [], n = 0; n < e.length; n++){
                            var r = e.charCodeAt(n);
                            if (r <= 127) t.push(e.charCodeAt(n));
                            else {
                                var o = n;
                                55296 <= r && r <= 57343 && n++;
                                for(var i = encodeURIComponent(e.slice(o, n + 1)).substr(1).split("%"), u = 0; u < i.length; u++)t.push(parseInt(i[u], 16));
                            }
                        }
                        return t;
                    }
                    function k(e) {
                        return s.toByteArray(e);
                    }
                    function T(e, t, n, r) {
                        for(var o = 0; o < r && !(o + n >= t.length || o >= e.length); o++)t[o + n] = e[o];
                        return o;
                    }
                    function M(e) {
                        try {
                            return decodeURIComponent(e);
                        } catch (e) {
                            return String.fromCharCode(65533);
                        }
                    }
                    function N(e, t) {
                        D("number" == typeof e, "cannot write a non-number as a number"), D(0 <= e, "specified a negative value for writing an unsigned value"), D(e <= t, "value is larger than maximum value for type"), D(Math.floor(e) === e, "value has a fractional component");
                    }
                    function Y(e, t, n) {
                        D("number" == typeof e, "cannot write a non-number as a number"), D(e <= t, "value larger than maximum allowed value"), D(n <= e, "value smaller than minimum allowed value"), D(Math.floor(e) === e, "value has a fractional component");
                    }
                    function F(e, t, n) {
                        D("number" == typeof e, "cannot write a non-number as a number"), D(e <= t, "value larger than maximum allowed value"), D(n <= e, "value smaller than minimum allowed value");
                    }
                    function D(e, t) {
                        if (!e) throw new Error(t || "Failed assertion");
                    }
                    g._augment = function(e) {
                        return e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = L.get, e.set = L.set, e.write = L.write, e.toString = L.toString, e.toLocaleString = L.toString, e.toJSON = L.toJSON, e.copy = L.copy, e.slice = L.slice, e.readUInt8 = L.readUInt8, e.readUInt16LE = L.readUInt16LE, e.readUInt16BE = L.readUInt16BE, e.readUInt32LE = L.readUInt32LE, e.readUInt32BE = L.readUInt32BE, e.readInt8 = L.readInt8, e.readInt16LE = L.readInt16LE, e.readInt16BE = L.readInt16BE, e.readInt32LE = L.readInt32LE, e.readInt32BE = L.readInt32BE, e.readFloatLE = L.readFloatLE, e.readFloatBE = L.readFloatBE, e.readDoubleLE = L.readDoubleLE, e.readDoubleBE = L.readDoubleBE, e.writeUInt8 = L.writeUInt8, e.writeUInt16LE = L.writeUInt16LE, e.writeUInt16BE = L.writeUInt16BE, e.writeUInt32LE = L.writeUInt32LE, e.writeUInt32BE = L.writeUInt32BE, e.writeInt8 = L.writeInt8, e.writeInt16LE = L.writeInt16LE, e.writeInt16BE = L.writeInt16BE, e.writeInt32LE = L.writeInt32LE, e.writeInt32BE = L.writeInt32BE, e.writeFloatLE = L.writeFloatLE, e.writeFloatBE = L.writeFloatBE, e.writeDoubleLE = L.writeDoubleLE, e.writeDoubleBE = L.writeDoubleBE, e.fill = L.fill, e.inspect = L.inspect, e.toArrayBuffer = L.toArrayBuffer, e;
                    };
                }).call(this, O("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, O("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/buffer/index.js", "/node_modules/gulp-browserify/node_modules/buffer");
            },
            {
                "base64-js": 2,
                buffer: 3,
                ieee754: 11,
                lYpoI2: 10
            }
        ],
        4: [
            function(l, d, e) {
                (function(e, t, u, n, r, o, i, a, s) {
                    var u = l("buffer").Buffer, f = 4, c = new u(f);
                    c.fill(0);
                    d.exports = {
                        hash: function(e, t, n, r) {
                            return u.isBuffer(e) || (e = new u(e)), function(e, t, n) {
                                for(var r = new u(t), o = n ? r.writeInt32BE : r.writeInt32LE, i = 0; i < e.length; i++)o.call(r, e[i], 4 * i, !0);
                                return r;
                            }(t(function(e, t) {
                                var n;
                                e.length % f != 0 && (n = e.length + (f - e.length % f), e = u.concat([
                                    e,
                                    c
                                ], n));
                                for(var r = [], o = t ? e.readInt32BE : e.readInt32LE, i = 0; i < e.length; i += f)r.push(o.call(e, i));
                                return r;
                            }(e, r), 8 * e.length), n, r);
                        }
                    };
                }).call(this, l("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, l("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
            },
            {
                buffer: 3,
                lYpoI2: 10
            }
        ],
        5: [
            function(w, e, b) {
                (function(e, t, a, n, r, o, i, u, s) {
                    var a = w("buffer").Buffer, f = w("./sha"), c = w("./sha256"), l = w("./rng"), d = {
                        sha1: f,
                        sha256: c,
                        md5: w("./md5")
                    }, h = 64, p = new a(h);
                    function g(e, r) {
                        var o = d[e = e || "sha1"], i = [];
                        return o || y("algorithm:", e, "is not yet supported"), {
                            update: function(e) {
                                return a.isBuffer(e) || (e = new a(e)), i.push(e), e.length, this;
                            },
                            digest: function(e) {
                                var t = a.concat(i), n = r ? function(e, t, n) {
                                    a.isBuffer(t) || (t = new a(t)), a.isBuffer(n) || (n = new a(n)), t.length > h ? t = e(t) : t.length < h && (t = a.concat([
                                        t,
                                        p
                                    ], h));
                                    for(var r = new a(h), o = new a(h), i = 0; i < h; i++)r[i] = 54 ^ t[i], o[i] = 92 ^ t[i];
                                    var u = e(a.concat([
                                        r,
                                        n
                                    ]));
                                    return e(a.concat([
                                        o,
                                        u
                                    ]));
                                }(o, r, t) : o(t);
                                return i = null, e ? n.toString(e) : n;
                            }
                        };
                    }
                    function y() {
                        var e = [].slice.call(arguments).join(" ");
                        throw new Error([
                            e,
                            "we accept pull requests",
                            "http://github.com/dominictarr/crypto-browserify"
                        ].join("\n"));
                    }
                    p.fill(0), b.createHash = function(e) {
                        return g(e);
                    }, b.createHmac = g, b.randomBytes = function(e, t) {
                        if (!t || !t.call) return new a(l(e));
                        try {
                            t.call(this, void 0, new a(l(e)));
                        } catch (e) {
                            t(e);
                        }
                    }, function(e, t) {
                        for(var n in e)t(e[n], n);
                    }([
                        "createCredentials",
                        "createCipher",
                        "createCipheriv",
                        "createDecipher",
                        "createDecipheriv",
                        "createSign",
                        "createVerify",
                        "createDiffieHellman",
                        "pbkdf2"
                    ], function(e) {
                        b[e] = function() {
                            y("sorry,", e, "is not implemented yet");
                        };
                    });
                }).call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
            },
            {
                "./md5": 6,
                "./rng": 7,
                "./sha": 8,
                "./sha256": 9,
                buffer: 3,
                lYpoI2: 10
            }
        ],
        6: [
            function(w, b, e) {
                (function(e, t, n, r, o, i, u, a, s) {
                    var f = w("./helpers");
                    function c(e, t) {
                        e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
                        for(var n = 1732584193, r = -271733879, o = -1732584194, i = 271733878, u = 0; u < e.length; u += 16){
                            var a = n, s = r, f = o, c = i, n = d(n, r, o, i, e[u + 0], 7, -680876936), i = d(i, n, r, o, e[u + 1], 12, -389564586), o = d(o, i, n, r, e[u + 2], 17, 606105819), r = d(r, o, i, n, e[u + 3], 22, -1044525330);
                            n = d(n, r, o, i, e[u + 4], 7, -176418897), i = d(i, n, r, o, e[u + 5], 12, 1200080426), o = d(o, i, n, r, e[u + 6], 17, -1473231341), r = d(r, o, i, n, e[u + 7], 22, -45705983), n = d(n, r, o, i, e[u + 8], 7, 1770035416), i = d(i, n, r, o, e[u + 9], 12, -1958414417), o = d(o, i, n, r, e[u + 10], 17, -42063), r = d(r, o, i, n, e[u + 11], 22, -1990404162), n = d(n, r, o, i, e[u + 12], 7, 1804603682), i = d(i, n, r, o, e[u + 13], 12, -40341101), o = d(o, i, n, r, e[u + 14], 17, -1502002290), n = h(n, r = d(r, o, i, n, e[u + 15], 22, 1236535329), o, i, e[u + 1], 5, -165796510), i = h(i, n, r, o, e[u + 6], 9, -1069501632), o = h(o, i, n, r, e[u + 11], 14, 643717713), r = h(r, o, i, n, e[u + 0], 20, -373897302), n = h(n, r, o, i, e[u + 5], 5, -701558691), i = h(i, n, r, o, e[u + 10], 9, 38016083), o = h(o, i, n, r, e[u + 15], 14, -660478335), r = h(r, o, i, n, e[u + 4], 20, -405537848), n = h(n, r, o, i, e[u + 9], 5, 568446438), i = h(i, n, r, o, e[u + 14], 9, -1019803690), o = h(o, i, n, r, e[u + 3], 14, -187363961), r = h(r, o, i, n, e[u + 8], 20, 1163531501), n = h(n, r, o, i, e[u + 13], 5, -1444681467), i = h(i, n, r, o, e[u + 2], 9, -51403784), o = h(o, i, n, r, e[u + 7], 14, 1735328473), n = p(n, r = h(r, o, i, n, e[u + 12], 20, -1926607734), o, i, e[u + 5], 4, -378558), i = p(i, n, r, o, e[u + 8], 11, -2022574463), o = p(o, i, n, r, e[u + 11], 16, 1839030562), r = p(r, o, i, n, e[u + 14], 23, -35309556), n = p(n, r, o, i, e[u + 1], 4, -1530992060), i = p(i, n, r, o, e[u + 4], 11, 1272893353), o = p(o, i, n, r, e[u + 7], 16, -155497632), r = p(r, o, i, n, e[u + 10], 23, -1094730640), n = p(n, r, o, i, e[u + 13], 4, 681279174), i = p(i, n, r, o, e[u + 0], 11, -358537222), o = p(o, i, n, r, e[u + 3], 16, -722521979), r = p(r, o, i, n, e[u + 6], 23, 76029189), n = p(n, r, o, i, e[u + 9], 4, -640364487), i = p(i, n, r, o, e[u + 12], 11, -421815835), o = p(o, i, n, r, e[u + 15], 16, 530742520), n = g(n, r = p(r, o, i, n, e[u + 2], 23, -995338651), o, i, e[u + 0], 6, -198630844), i = g(i, n, r, o, e[u + 7], 10, 1126891415), o = g(o, i, n, r, e[u + 14], 15, -1416354905), r = g(r, o, i, n, e[u + 5], 21, -57434055), n = g(n, r, o, i, e[u + 12], 6, 1700485571), i = g(i, n, r, o, e[u + 3], 10, -1894986606), o = g(o, i, n, r, e[u + 10], 15, -1051523), r = g(r, o, i, n, e[u + 1], 21, -2054922799), n = g(n, r, o, i, e[u + 8], 6, 1873313359), i = g(i, n, r, o, e[u + 15], 10, -30611744), o = g(o, i, n, r, e[u + 6], 15, -1560198380), r = g(r, o, i, n, e[u + 13], 21, 1309151649), n = g(n, r, o, i, e[u + 4], 6, -145523070), i = g(i, n, r, o, e[u + 11], 10, -1120210379), o = g(o, i, n, r, e[u + 2], 15, 718787259), r = g(r, o, i, n, e[u + 9], 21, -343485551), n = y(n, a), r = y(r, s), o = y(o, f), i = y(i, c);
                        }
                        return Array(n, r, o, i);
                    }
                    function l(e, t, n, r, o, i) {
                        return y((u = y(y(t, e), y(r, i))) << (a = o) | u >>> 32 - a, n);
                        //TURBOPACK unreachable
                        ;
                        var u, a;
                    }
                    function d(e, t, n, r, o, i, u) {
                        return l(t & n | ~t & r, e, t, o, i, u);
                    }
                    function h(e, t, n, r, o, i, u) {
                        return l(t & r | n & ~r, e, t, o, i, u);
                    }
                    function p(e, t, n, r, o, i, u) {
                        return l(t ^ n ^ r, e, t, o, i, u);
                    }
                    function g(e, t, n, r, o, i, u) {
                        return l(n ^ (t | ~r), e, t, o, i, u);
                    }
                    function y(e, t) {
                        var n = (65535 & e) + (65535 & t);
                        return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
                    }
                    b.exports = function(e) {
                        return f.hash(e, c, 16);
                    };
                }).call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
            },
            {
                "./helpers": 4,
                buffer: 3,
                lYpoI2: 10
            }
        ],
        7: [
            function(e, l, t) {
                (function(e, t, n, r, o, i, u, a, s) {
                    var f, c;
                    c = function(e) {
                        for(var t, n = new Array(e), r = 0; r < e; r++)0 == (3 & r) && (t = 4294967296 * Math.random()), n[r] = t >>> ((3 & r) << 3) & 255;
                        return n;
                    }, l.exports = f || c;
                }).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
            },
            {
                buffer: 3,
                lYpoI2: 10
            }
        ],
        8: [
            function(l, d, e) {
                (function(e, t, n, r, o, i, u, a, s) {
                    var f = l("./helpers");
                    function c(e, t) {
                        e[t >> 5] |= 128 << 24 - t % 32, e[15 + (t + 64 >> 9 << 4)] = t;
                        for(var n, r, o, i, u, a = Array(80), s = 1732584193, f = -271733879, c = -1732584194, l = 271733878, d = -1009589776, h = 0; h < e.length; h += 16){
                            for(var p = s, g = f, y = c, w = l, b = d, m = 0; m < 80; m++){
                                a[m] = m < 16 ? e[h + m] : E(a[m - 3] ^ a[m - 8] ^ a[m - 14] ^ a[m - 16], 1);
                                var v = _(_(E(s, 5), (o = f, i = c, u = l, (r = m) < 20 ? o & i | ~o & u : !(r < 40) && r < 60 ? o & i | o & u | i & u : o ^ i ^ u)), _(_(d, a[m]), (n = m) < 20 ? 1518500249 : n < 40 ? 1859775393 : n < 60 ? -1894007588 : -899497514)), d = l, l = c, c = E(f, 30), f = s, s = v;
                            }
                            s = _(s, p), f = _(f, g), c = _(c, y), l = _(l, w), d = _(d, b);
                        }
                        return Array(s, f, c, l, d);
                    }
                    function _(e, t) {
                        var n = (65535 & e) + (65535 & t);
                        return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
                    }
                    function E(e, t) {
                        return e << t | e >>> 32 - t;
                    }
                    d.exports = function(e) {
                        return f.hash(e, c, 20, !0);
                    };
                }).call(this, l("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, l("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
            },
            {
                "./helpers": 4,
                buffer: 3,
                lYpoI2: 10
            }
        ],
        9: [
            function(l, d, e) {
                (function(e, t, n, r, o, i, u, a, s) {
                    function B(e, t) {
                        var n = (65535 & e) + (65535 & t);
                        return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
                    }
                    function L(e, t) {
                        return e >>> t | e << 32 - t;
                    }
                    function f(e, t) {
                        var n, r, o, i, u, a, s, f, c, l, d = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298), h = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225), p = new Array(64);
                        e[t >> 5] |= 128 << 24 - t % 32, e[15 + (t + 64 >> 9 << 4)] = t;
                        for(var g, y, w, b, m, v, _, E, I = 0; I < e.length; I += 16){
                            n = h[0], r = h[1], o = h[2], i = h[3], u = h[4], a = h[5], s = h[6], f = h[7];
                            for(var A = 0; A < 64; A++)p[A] = A < 16 ? e[A + I] : B(B(B((E = p[A - 2], L(E, 17) ^ L(E, 19) ^ E >>> 10), p[A - 7]), (_ = p[A - 15], L(_, 7) ^ L(_, 18) ^ _ >>> 3)), p[A - 16]), c = B(B(B(B(f, L(v = u, 6) ^ L(v, 11) ^ L(v, 25)), (m = u) & a ^ ~m & s), d[A]), p[A]), l = B(L(b = n, 2) ^ L(b, 13) ^ L(b, 22), (g = n) & (y = r) ^ g & (w = o) ^ y & w), f = s, s = a, a = u, u = B(i, c), i = o, o = r, r = n, n = B(c, l);
                            h[0] = B(n, h[0]), h[1] = B(r, h[1]), h[2] = B(o, h[2]), h[3] = B(i, h[3]), h[4] = B(u, h[4]), h[5] = B(a, h[5]), h[6] = B(s, h[6]), h[7] = B(f, h[7]);
                        }
                        return h;
                    }
                    var c = l("./helpers");
                    d.exports = function(e) {
                        return c.hash(e, f, 32, !0);
                    };
                }).call(this, l("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, l("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
            },
            {
                "./helpers": 4,
                buffer: 3,
                lYpoI2: 10
            }
        ],
        10: [
            function(e, c, t) {
                (function(e, t, n, r, o, i, u, a, s) {
                    function f() {}
                    (e = c.exports = {}).nextTick = function() {
                        var e = "undefined" != typeof window && window.setImmediate, t = "undefined" != typeof window && window.postMessage && window.addEventListener;
                        if (e) return function(e) {
                            return window.setImmediate(e);
                        };
                        if (t) {
                            var n = [];
                            return window.addEventListener("message", function(e) {
                                var t = e.source;
                                t !== window && null !== t || "process-tick" !== e.data || (e.stopPropagation(), 0 < n.length && n.shift()());
                            }, !0), function(e) {
                                n.push(e), window.postMessage("process-tick", "*");
                            };
                        }
                        return function(e) {
                            setTimeout(e, 0);
                        };
                    }(), e.title = "browser", e.browser = !0, e.env = {}, e.argv = [], e.on = f, e.addListener = f, e.once = f, e.off = f, e.removeListener = f, e.removeAllListeners = f, e.emit = f, e.binding = function(e) {
                        throw new Error("process.binding is not supported");
                    }, e.cwd = function() {
                        return "/";
                    }, e.chdir = function(e) {
                        throw new Error("process.chdir is not supported");
                    };
                }).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/process/browser.js", "/node_modules/gulp-browserify/node_modules/process");
            },
            {
                buffer: 3,
                lYpoI2: 10
            }
        ],
        11: [
            function(e, t, f) {
                (function(e, t, n, r, o, i, u, a, s) {
                    f.read = function(e, t, n, r, o) {
                        var i, u, a = 8 * o - r - 1, s = (1 << a) - 1, f = s >> 1, c = -7, l = n ? o - 1 : 0, d = n ? -1 : 1, h = e[t + l];
                        for(l += d, i = h & (1 << -c) - 1, h >>= -c, c += a; 0 < c; i = 256 * i + e[t + l], l += d, c -= 8);
                        for(u = i & (1 << -c) - 1, i >>= -c, c += r; 0 < c; u = 256 * u + e[t + l], l += d, c -= 8);
                        if (0 === i) i = 1 - f;
                        else {
                            if (i === s) return u ? NaN : 1 / 0 * (h ? -1 : 1);
                            u += Math.pow(2, r), i -= f;
                        }
                        return (h ? -1 : 1) * u * Math.pow(2, i - r);
                    }, f.write = function(e, t, n, r, o, i) {
                        var u, a, s, f = 8 * i - o - 1, c = (1 << f) - 1, l = c >> 1, d = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = r ? 0 : i - 1, p = r ? 1 : -1, g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                        for(t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, u = c) : (u = Math.floor(Math.log(t) / Math.LN2), t * (s = Math.pow(2, -u)) < 1 && (u--, s *= 2), 2 <= (t += 1 <= u + l ? d / s : d * Math.pow(2, 1 - l)) * s && (u++, s /= 2), c <= u + l ? (a = 0, u = c) : 1 <= u + l ? (a = (t * s - 1) * Math.pow(2, o), u += l) : (a = t * Math.pow(2, l - 1) * Math.pow(2, o), u = 0)); 8 <= o; e[n + h] = 255 & a, h += p, a /= 256, o -= 8);
                        for(u = u << o | a, f += o; 0 < f; e[n + h] = 255 & u, h += p, u /= 256, f -= 8);
                        e[n + h - p] |= 128 * g;
                    };
                }).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/ieee754/index.js", "/node_modules/ieee754");
            },
            {
                buffer: 3,
                lYpoI2: 10
            }
        ]
    }, {}, [
        1
    ])(1);
});
}),
"[project]/IT4409/Instagram-lite/node_modules/oauth/lib/sha1.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */ /*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */ var hexcase = 1; /* hex output format. 0 - lowercase; 1 - uppercase        */ 
var b64pad = "="; /* base-64 pad character. "=" for strict RFC compliance   */ 
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */ function hex_sha1(s) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
}
function b64_sha1(s) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(s)));
}
function any_sha1(s, e) {
    return rstr2any(rstr_sha1(str2rstr_utf8(s)), e);
}
function hex_hmac_sha1(k, d) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function b64_hmac_sha1(k, d) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function any_hmac_sha1(k, d, e) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e);
}
/*
 * Perform a simple self-test to see if the VM is working
 */ function sha1_vm_test() {
    return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}
/*
 * Calculate the SHA1 of a raw string
 */ function rstr_sha1(s) {
    return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}
/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */ function rstr_hmac_sha1(key, data) {
    var bkey = rstr2binb(key);
    if (bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++){
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
    return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}
/*
 * Convert a raw string to a hex string
 */ function rstr2hex(input) {
    try {
        hexcase;
    } catch (e) {
        hexcase = 0;
    }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for(var i = 0; i < input.length; i++){
        x = input.charCodeAt(i);
        output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
}
/*
 * Convert a raw string to a base-64 string
 */ function rstr2b64(input) {
    try {
        b64pad;
    } catch (e) {
        b64pad = '';
    }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for(var i = 0; i < len; i += 3){
        var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for(var j = 0; j < 4; j++){
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt(triplet >>> 6 * (3 - j) & 0x3F);
        }
    }
    return output;
}
/*
 * Convert a raw string to an arbitrary string encoding
 */ function rstr2any(input, encoding) {
    var divisor = encoding.length;
    var remainders = Array();
    var i, q, x, quotient;
    /* Convert to an array of 16-bit big-endian values, forming the dividend */ var dividend = Array(Math.ceil(input.length / 2));
    for(i = 0; i < dividend.length; i++){
        dividend[i] = input.charCodeAt(i * 2) << 8 | input.charCodeAt(i * 2 + 1);
    }
    /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */ while(dividend.length > 0){
        quotient = Array();
        x = 0;
        for(i = 0; i < dividend.length; i++){
            x = (x << 16) + dividend[i];
            q = Math.floor(x / divisor);
            x -= q * divisor;
            if (quotient.length > 0 || q > 0) quotient[quotient.length] = q;
        }
        remainders[remainders.length] = x;
        dividend = quotient;
    }
    /* Convert the remainders to the output string */ var output = "";
    for(i = remainders.length - 1; i >= 0; i--)output += encoding.charAt(remainders[i]);
    /* Append leading zero equivalents */ var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    for(i = output.length; i < full_length; i++)output = encoding[0] + output;
    return output;
}
/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */ function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while(++i < input.length){
        /* Decode utf-16 surrogate pairs */ x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++;
        }
        /* Encode output as utf-8 */ if (x <= 0x7F) output += String.fromCharCode(x);
        else if (x <= 0x7FF) output += String.fromCharCode(0xC0 | x >>> 6 & 0x1F, 0x80 | x & 0x3F);
        else if (x <= 0xFFFF) output += String.fromCharCode(0xE0 | x >>> 12 & 0x0F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
        else if (x <= 0x1FFFFF) output += String.fromCharCode(0xF0 | x >>> 18 & 0x07, 0x80 | x >>> 12 & 0x3F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
    }
    return output;
}
/*
 * Encode a string as utf-16
 */ function str2rstr_utf16le(input) {
    var output = "";
    for(var i = 0; i < input.length; i++)output += String.fromCharCode(input.charCodeAt(i) & 0xFF, input.charCodeAt(i) >>> 8 & 0xFF);
    return output;
}
function str2rstr_utf16be(input) {
    var output = "";
    for(var i = 0; i < input.length; i++)output += String.fromCharCode(input.charCodeAt(i) >>> 8 & 0xFF, input.charCodeAt(i) & 0xFF);
    return output;
}
/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */ function rstr2binb(input) {
    var output = Array(input.length >> 2);
    for(var i = 0; i < output.length; i++)output[i] = 0;
    for(var i = 0; i < input.length * 8; i += 8)output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << 24 - i % 32;
    return output;
}
/*
 * Convert an array of big-endian words to a string
 */ function binb2rstr(input) {
    var output = "";
    for(var i = 0; i < input.length * 32; i += 8)output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 0xFF);
    return output;
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */ function binb_sha1(x, len) {
    /* append padding */ x[len >> 5] |= 0x80 << 24 - len % 32;
    x[(len + 64 >> 9 << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for(var i = 0; i < x.length; i += 16){
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for(var j = 0; j < 80; j++){
            if (j < 16) w[j] = x[i + j];
            else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */ function sha1_ft(t, b, c, d) {
    if (t < 20) return b & c | ~b & d;
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return b & c | b & d | c & d;
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */ function sha1_kt(t) {
    return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */ function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */ function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
}
exports.HMACSHA1 = function(key, data) {
    return b64_hmac_sha1(key, data);
};
}),
"[project]/IT4409/Instagram-lite/node_modules/oauth/lib/_utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Returns true if this is a host that closes *before* it ends?!?!
module.exports.isAnEarlyCloseHost = function(hostName) {
    return hostName && hostName.match(".*google(apis)?.com$");
};
}),
"[project]/IT4409/Instagram-lite/node_modules/oauth/lib/oauth.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var crypto = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/crypto-browserify/index.js [app-client] (ecmascript)"), sha1 = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/oauth/lib/sha1.js [app-client] (ecmascript)"), http = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/stream-http/index.js [app-client] (ecmascript)"), https = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/https-browserify/index.js [app-client] (ecmascript)"), URL = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/native-url/index.js [app-client] (ecmascript)"), querystring = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/querystring-es3/index.js [app-client] (ecmascript)"), OAuthUtils = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/oauth/lib/_utils.js [app-client] (ecmascript)");
exports.OAuth = function(requestUrl, accessUrl, consumerKey, consumerSecret, version, authorize_callback, signatureMethod, nonceSize, customHeaders) {
    this._isEcho = false;
    this._requestUrl = requestUrl;
    this._accessUrl = accessUrl;
    this._consumerKey = consumerKey;
    this._consumerSecret = this._encodeData(consumerSecret);
    if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
    }
    this._version = version;
    if (authorize_callback === undefined) {
        this._authorize_callback = "oob";
    } else {
        this._authorize_callback = authorize_callback;
    }
    if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1") throw new Error("Un-supported signature method: " + signatureMethod);
    this._signatureMethod = signatureMethod;
    this._nonceSize = nonceSize || 32;
    this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
    };
    this._clientOptions = this._defaultClientOptions = {
        "requestTokenHttpMethod": "POST",
        "accessTokenHttpMethod": "POST",
        "followRedirects": true
    };
    this._oauthParameterSeperator = ",";
};
exports.OAuthEcho = function(realm, verify_credentials, consumerKey, consumerSecret, version, signatureMethod, nonceSize, customHeaders) {
    this._isEcho = true;
    this._realm = realm;
    this._verifyCredentials = verify_credentials;
    this._consumerKey = consumerKey;
    this._consumerSecret = this._encodeData(consumerSecret);
    if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
    }
    this._version = version;
    if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1") throw new Error("Un-supported signature method: " + signatureMethod);
    this._signatureMethod = signatureMethod;
    this._nonceSize = nonceSize || 32;
    this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
    };
    this._oauthParameterSeperator = ",";
};
exports.OAuthEcho.prototype = exports.OAuth.prototype;
exports.OAuth.prototype._getTimestamp = function() {
    return Math.floor(new Date().getTime() / 1000);
};
exports.OAuth.prototype._encodeData = function(toEncode) {
    if (toEncode == null || toEncode == "") return "";
    else {
        var result = encodeURIComponent(toEncode);
        // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
        return result.replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
    }
};
exports.OAuth.prototype._decodeData = function(toDecode) {
    if (toDecode != null) {
        toDecode = toDecode.replace(/\+/g, " ");
    }
    return decodeURIComponent(toDecode);
};
exports.OAuth.prototype._getSignature = function(method, url, parameters, tokenSecret) {
    var signatureBase = this._createSignatureBase(method, url, parameters);
    return this._createSignature(signatureBase, tokenSecret);
};
exports.OAuth.prototype._normalizeUrl = function(url) {
    var parsedUrl = URL.parse(url, true);
    var port = "";
    if (parsedUrl.port) {
        if (parsedUrl.protocol == "http:" && parsedUrl.port != "80" || parsedUrl.protocol == "https:" && parsedUrl.port != "443") {
            port = ":" + parsedUrl.port;
        }
    }
    if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
    return parsedUrl.protocol + "//" + parsedUrl.hostname + port + parsedUrl.pathname;
};
// Is the parameter considered an OAuth parameter
exports.OAuth.prototype._isParameterNameAnOAuthParameter = function(parameter) {
    var m = parameter.match('^oauth_');
    if (m && m[0] === "oauth_") {
        return true;
    } else {
        return false;
    }
};
// build the OAuth request authorization header
exports.OAuth.prototype._buildAuthorizationHeaders = function(orderedParameters) {
    var authHeader = "OAuth ";
    if (this._isEcho) {
        authHeader += 'realm="' + this._realm + '",';
    }
    for(var i = 0; i < orderedParameters.length; i++){
        // Whilst the all the parameters should be included within the signature, only the oauth_ arguments
        // should appear within the authorization header.
        if (this._isParameterNameAnOAuthParameter(orderedParameters[i][0])) {
            authHeader += "" + this._encodeData(orderedParameters[i][0]) + "=\"" + this._encodeData(orderedParameters[i][1]) + "\"" + this._oauthParameterSeperator;
        }
    }
    authHeader = authHeader.substring(0, authHeader.length - this._oauthParameterSeperator.length);
    return authHeader;
};
// Takes an object literal that represents the arguments, and returns an array
// of argument/value pairs.
exports.OAuth.prototype._makeArrayOfArgumentsHash = function(argumentsHash) {
    var argument_pairs = [];
    for(var key in argumentsHash){
        if (argumentsHash.hasOwnProperty(key)) {
            var value = argumentsHash[key];
            if (Array.isArray(value)) {
                for(var i = 0; i < value.length; i++){
                    argument_pairs[argument_pairs.length] = [
                        key,
                        value[i]
                    ];
                }
            } else {
                argument_pairs[argument_pairs.length] = [
                    key,
                    value
                ];
            }
        }
    }
    return argument_pairs;
};
// Sorts the encoded key value pairs by encoded name, then encoded value
exports.OAuth.prototype._sortRequestParams = function(argument_pairs) {
    // Sort by name, then value.
    argument_pairs.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] < b[1] ? -1 : 1;
        } else return a[0] < b[0] ? -1 : 1;
    });
    return argument_pairs;
};
exports.OAuth.prototype._normaliseRequestParams = function(args) {
    var argument_pairs = this._makeArrayOfArgumentsHash(args);
    // First encode them #3.4.1.3.2 .1
    for(var i = 0; i < argument_pairs.length; i++){
        argument_pairs[i][0] = this._encodeData(argument_pairs[i][0]);
        argument_pairs[i][1] = this._encodeData(argument_pairs[i][1]);
    }
    // Then sort them #3.4.1.3.2 .2
    argument_pairs = this._sortRequestParams(argument_pairs);
    // Then concatenate together #3.4.1.3.2 .3 & .4
    var args = "";
    for(var i = 0; i < argument_pairs.length; i++){
        args += argument_pairs[i][0];
        args += "=";
        args += argument_pairs[i][1];
        if (i < argument_pairs.length - 1) args += "&";
    }
    return args;
};
exports.OAuth.prototype._createSignatureBase = function(method, url, parameters) {
    url = this._encodeData(this._normalizeUrl(url));
    parameters = this._encodeData(parameters);
    return method.toUpperCase() + "&" + url + "&" + parameters;
};
exports.OAuth.prototype._createSignature = function(signatureBase, tokenSecret) {
    if (tokenSecret === undefined) var tokenSecret = "";
    else tokenSecret = this._encodeData(tokenSecret);
    // consumerSecret is already encoded
    var key = this._consumerSecret + "&" + tokenSecret;
    var hash = "";
    if (this._signatureMethod == "PLAINTEXT") {
        hash = key;
    } else if (this._signatureMethod == "RSA-SHA1") {
        key = this._privateKey || "";
        hash = crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, 'base64');
    } else {
        if (crypto.Hmac) {
            hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
        } else {
            hash = sha1.HMACSHA1(key, signatureBase);
        }
    }
    return hash;
};
exports.OAuth.prototype.NONCE_CHARS = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
];
exports.OAuth.prototype._getNonce = function(nonceSize) {
    var result = [];
    var chars = this.NONCE_CHARS;
    var char_pos;
    var nonce_chars_length = chars.length;
    for(var i = 0; i < nonceSize; i++){
        char_pos = Math.floor(Math.random() * nonce_chars_length);
        result[i] = chars[char_pos];
    }
    return result.join('');
};
exports.OAuth.prototype._createClient = function(port, hostname, method, path, headers, sslEnabled) {
    var options = {
        host: hostname,
        port: port,
        path: path,
        method: method,
        headers: headers
    };
    var httpModel;
    if (sslEnabled) {
        httpModel = https;
    } else {
        httpModel = http;
    }
    return httpModel.request(options);
};
exports.OAuth.prototype._prepareParameters = function(oauth_token, oauth_token_secret, method, url, extra_params) {
    var oauthParameters = {
        "oauth_timestamp": this._getTimestamp(),
        "oauth_nonce": this._getNonce(this._nonceSize),
        "oauth_version": this._version,
        "oauth_signature_method": this._signatureMethod,
        "oauth_consumer_key": this._consumerKey
    };
    if (oauth_token) {
        oauthParameters["oauth_token"] = oauth_token;
    }
    var sig;
    if (this._isEcho) {
        sig = this._getSignature("GET", this._verifyCredentials, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
    } else {
        if (extra_params) {
            for(var key in extra_params){
                if (extra_params.hasOwnProperty(key)) oauthParameters[key] = extra_params[key];
            }
        }
        var parsedUrl = URL.parse(url, false);
        if (parsedUrl.query) {
            var key2;
            var extraParameters = querystring.parse(parsedUrl.query);
            for(var key in extraParameters){
                var value = extraParameters[key];
                if (typeof value == "object") {
                    // TODO: This probably should be recursive
                    for(key2 in value){
                        oauthParameters[key + "[" + key2 + "]"] = value[key2];
                    }
                } else {
                    oauthParameters[key] = value;
                }
            }
        }
        sig = this._getSignature(method, url, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
    }
    var orderedParameters = this._sortRequestParams(this._makeArrayOfArgumentsHash(oauthParameters));
    orderedParameters[orderedParameters.length] = [
        "oauth_signature",
        sig
    ];
    return orderedParameters;
};
exports.OAuth.prototype._performSecureRequest = function(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback) {
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, extra_params);
    if (!post_content_type) {
        post_content_type = "application/x-www-form-urlencoded";
    }
    var parsedUrl = URL.parse(url, false);
    if (parsedUrl.protocol == "http:" && !parsedUrl.port) parsedUrl.port = 80;
    if (parsedUrl.protocol == "https:" && !parsedUrl.port) parsedUrl.port = 443;
    var headers = {};
    var authorization = this._buildAuthorizationHeaders(orderedParameters);
    if (this._isEcho) {
        headers["X-Verify-Credentials-Authorization"] = authorization;
    } else {
        headers["Authorization"] = authorization;
    }
    headers["Host"] = parsedUrl.host;
    for(var key in this._headers){
        if (this._headers.hasOwnProperty(key)) {
            headers[key] = this._headers[key];
        }
    }
    // Filter out any passed extra_params that are really to do with OAuth
    for(var key in extra_params){
        if (this._isParameterNameAnOAuthParameter(key)) {
            delete extra_params[key];
        }
    }
    if ((method == "POST" || method == "PUT") && post_body == null && extra_params != null) {
        // Fix the mismatch between the output of querystring.stringify() and this._encodeData()
        post_body = querystring.stringify(extra_params).replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
    }
    if (post_body) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isBuffer(post_body)) {
            headers["Content-length"] = post_body.length;
        } else {
            headers["Content-length"] = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(post_body);
        }
    } else {
        headers["Content-length"] = 0;
    }
    headers["Content-Type"] = post_content_type;
    var path;
    if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
    if (parsedUrl.query) path = parsedUrl.pathname + "?" + parsedUrl.query;
    else path = parsedUrl.pathname;
    var request;
    if (parsedUrl.protocol == "https:") {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers, true);
    } else {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers);
    }
    var clientOptions = this._clientOptions;
    if (callback) {
        var data = "";
        var self = this;
        // Some hosts *cough* google appear to close the connection early / send no content-length header
        // allow this behaviour.
        var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(parsedUrl.hostname);
        var callbackCalled = false;
        var passBackControl = function(response) {
            if (!callbackCalled) {
                callbackCalled = true;
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    callback(null, data, response);
                } else {
                    // Follow 301 or 302 redirects with Location HTTP header
                    if ((response.statusCode == 301 || response.statusCode == 302) && clientOptions.followRedirects && response.headers && response.headers.location) {
                        self._performSecureRequest(oauth_token, oauth_token_secret, method, response.headers.location, extra_params, post_body, post_content_type, callback);
                    } else {
                        callback({
                            statusCode: response.statusCode,
                            data: data
                        }, data, response);
                    }
                }
            }
        };
        request.on('response', function(response) {
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                data += chunk;
            });
            response.on('end', function() {
                passBackControl(response);
            });
            response.on('close', function() {
                if (allowEarlyClose) {
                    passBackControl(response);
                }
            });
        });
        request.on("error", function(err) {
            if (!callbackCalled) {
                callbackCalled = true;
                callback(err);
            }
        });
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
            request.write(post_body);
        }
        request.end();
    } else {
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
            request.write(post_body);
        }
        return request;
    }
    return;
};
exports.OAuth.prototype.setClientOptions = function(options) {
    var key, mergedOptions = {}, hasOwnProperty = Object.prototype.hasOwnProperty;
    for(key in this._defaultClientOptions){
        if (!hasOwnProperty.call(options, key)) {
            mergedOptions[key] = this._defaultClientOptions[key];
        } else {
            mergedOptions[key] = options[key];
        }
    }
    this._clientOptions = mergedOptions;
};
exports.OAuth.prototype.getOAuthAccessToken = function(oauth_token, oauth_token_secret, oauth_verifier, callback) {
    var extraParams = {};
    if (typeof oauth_verifier == "function") {
        callback = oauth_verifier;
    } else {
        extraParams.oauth_verifier = oauth_verifier;
    }
    this._performSecureRequest(oauth_token, oauth_token_secret, this._clientOptions.accessTokenHttpMethod, this._accessUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results = querystring.parse(data);
            var oauth_access_token = results["oauth_token"];
            delete results["oauth_token"];
            var oauth_access_token_secret = results["oauth_token_secret"];
            delete results["oauth_token_secret"];
            callback(null, oauth_access_token, oauth_access_token_secret, results);
        }
    });
};
// Deprecated
exports.OAuth.prototype.getProtectedResource = function(url, method, oauth_token, oauth_token_secret, callback) {
    this._performSecureRequest(oauth_token, oauth_token_secret, method, url, null, "", null, callback);
};
exports.OAuth.prototype.delete = function(url, oauth_token, oauth_token_secret, callback) {
    return this._performSecureRequest(oauth_token, oauth_token_secret, "DELETE", url, null, "", null, callback);
};
exports.OAuth.prototype.get = function(url, oauth_token, oauth_token_secret, callback) {
    return this._performSecureRequest(oauth_token, oauth_token_secret, "GET", url, null, "", null, callback);
};
exports.OAuth.prototype._putOrPost = function(method, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    var extra_params = null;
    if (typeof post_content_type == "function") {
        callback = post_content_type;
        post_content_type = null;
    }
    if (typeof post_body != "string" && !__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isBuffer(post_body)) {
        post_content_type = "application/x-www-form-urlencoded";
        extra_params = post_body;
        post_body = null;
    }
    return this._performSecureRequest(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback);
};
exports.OAuth.prototype.put = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    return this._putOrPost("PUT", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};
exports.OAuth.prototype.post = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    return this._putOrPost("POST", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};
/**
 * Gets a request token from the OAuth provider and passes that information back
 * to the calling code.
 *
 * The callback should expect a function of the following form:
 *
 * function(err, token, token_secret, parsedQueryString) {}
 *
 * This method has optional parameters so can be called in the following 2 ways:
 *
 * 1) Primary use case: Does a basic request with no extra parameters
 *  getOAuthRequestToken( callbackFunction )
 *
 * 2) As above but allows for provision of extra parameters to be sent as part of the query to the server.
 *  getOAuthRequestToken( extraParams, callbackFunction )
 *
 * N.B. This method will HTTP POST verbs by default, if you wish to override this behaviour you will
 * need to provide a requestTokenHttpMethod option when creating the client.
 *
 **/ exports.OAuth.prototype.getOAuthRequestToken = function(extraParams, callback) {
    if (typeof extraParams == "function") {
        callback = extraParams;
        extraParams = {};
    }
    // Callbacks are 1.0A related
    if (this._authorize_callback) {
        extraParams["oauth_callback"] = this._authorize_callback;
    }
    this._performSecureRequest(null, null, this._clientOptions.requestTokenHttpMethod, this._requestUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results = querystring.parse(data);
            var oauth_token = results["oauth_token"];
            var oauth_token_secret = results["oauth_token_secret"];
            delete results["oauth_token"];
            delete results["oauth_token_secret"];
            callback(null, oauth_token, oauth_token_secret, results);
        }
    });
};
exports.OAuth.prototype.signUrl = function(url, oauth_token, oauth_token_secret, method) {
    if (method === undefined) {
        var method = "GET";
    }
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
    var parsedUrl = URL.parse(url, false);
    var query = "";
    for(var i = 0; i < orderedParameters.length; i++){
        query += orderedParameters[i][0] + "=" + this._encodeData(orderedParameters[i][1]) + "&";
    }
    query = query.substring(0, query.length - 1);
    return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?" + query;
};
exports.OAuth.prototype.authHeader = function(url, oauth_token, oauth_token_secret, method) {
    if (method === undefined) {
        var method = "GET";
    }
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
    return this._buildAuthorizationHeaders(orderedParameters);
};
}),
"[project]/IT4409/Instagram-lite/node_modules/oauth/lib/oauth2.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var querystring = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/querystring-es3/index.js [app-client] (ecmascript)"), crypto = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/crypto-browserify/index.js [app-client] (ecmascript)"), https = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/https-browserify/index.js [app-client] (ecmascript)"), http = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/stream-http/index.js [app-client] (ecmascript)"), URL = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/native-url/index.js [app-client] (ecmascript)"), OAuthUtils = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/oauth/lib/_utils.js [app-client] (ecmascript)");
exports.OAuth2 = function(clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._baseSite = baseSite;
    this._authorizeUrl = authorizePath || "/oauth/authorize";
    this._accessTokenUrl = accessTokenPath || "/oauth/access_token";
    this._accessTokenName = "access_token";
    this._authMethod = "Bearer";
    this._customHeaders = customHeaders || {};
    this._useAuthorizationHeaderForGET = false;
    //our agent
    this._agent = undefined;
};
// Allows you to set an agent to use instead of the default HTTP or
// HTTPS agents. Useful when dealing with your own certificates.
exports.OAuth2.prototype.setAgent = function(agent) {
    this._agent = agent;
};
// This 'hack' method is required for sites that don't use
// 'access_token' as the name of the access token (for requests).
// ( http://tools.ietf.org/html/draft-ietf-oauth-v2-16#section-7 )
// it isn't clear what the correct value should be atm, so allowing
// for specific (temporary?) override for now.
exports.OAuth2.prototype.setAccessTokenName = function(name) {
    this._accessTokenName = name;
};
// Sets the authorization method for Authorization header.
// e.g. Authorization: Bearer <token>  # "Bearer" is the authorization method.
exports.OAuth2.prototype.setAuthMethod = function(authMethod) {
    this._authMethod = authMethod;
};
// If you use the OAuth2 exposed 'get' method (and don't construct your own _request call )
// this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter
exports.OAuth2.prototype.useAuthorizationHeaderforGET = function(useIt) {
    this._useAuthorizationHeaderForGET = useIt;
};
exports.OAuth2.prototype._getAccessTokenUrl = function() {
    return this._baseSite + this._accessTokenUrl; /* + "?" + querystring.stringify(params); */ 
};
// Build the authorization header. In particular, build the part after the colon.
// e.g. Authorization: Bearer <token>  # Build "Bearer <token>"
exports.OAuth2.prototype.buildAuthHeader = function(token) {
    return this._authMethod + ' ' + token;
};
exports.OAuth2.prototype._chooseHttpLibrary = function(parsedUrl) {
    var http_library = https;
    // As this is OAUth2, we *assume* https unless told explicitly otherwise.
    if (parsedUrl.protocol != "https:") {
        http_library = http;
    }
    return http_library;
};
exports.OAuth2.prototype._request = function(method, url, headers, post_body, access_token, callback) {
    var parsedUrl = URL.parse(url, true);
    if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
        parsedUrl.port = 443;
    }
    var http_library = this._chooseHttpLibrary(parsedUrl);
    var realHeaders = {};
    for(var key in this._customHeaders){
        realHeaders[key] = this._customHeaders[key];
    }
    if (headers) {
        for(var key in headers){
            realHeaders[key] = headers[key];
        }
    }
    realHeaders['Host'] = parsedUrl.host;
    if (!realHeaders['User-Agent']) {
        realHeaders['User-Agent'] = 'Node-oauth';
    }
    if (post_body) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isBuffer(post_body)) {
            realHeaders["Content-Length"] = post_body.length;
        } else {
            realHeaders["Content-Length"] = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(post_body);
        }
    } else {
        realHeaders["Content-length"] = 0;
    }
    if (access_token && !('Authorization' in realHeaders)) {
        if (!parsedUrl.query) parsedUrl.query = {};
        parsedUrl.query[this._accessTokenName] = access_token;
    }
    var queryStr = querystring.stringify(parsedUrl.query);
    if (queryStr) queryStr = "?" + queryStr;
    var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + queryStr,
        method: method,
        headers: realHeaders
    };
    this._executeRequest(http_library, options, post_body, callback);
};
exports.OAuth2.prototype._executeRequest = function(http_library, options, post_body, callback) {
    // Some hosts *cough* google appear to close the connection early / send no content-length header
    // allow this behaviour.
    var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(options.host);
    var callbackCalled = false;
    function passBackControl(response, result) {
        if (!callbackCalled) {
            callbackCalled = true;
            if (!(response.statusCode >= 200 && response.statusCode <= 299) && response.statusCode != 301 && response.statusCode != 302) {
                callback({
                    statusCode: response.statusCode,
                    data: result
                });
            } else {
                callback(null, result, response);
            }
        }
    }
    var result = "";
    //set the agent on the request options
    if (this._agent) {
        options.agent = this._agent;
    }
    var request = http_library.request(options);
    request.on('response', function(response) {
        response.on("data", function(chunk) {
            result += chunk;
        });
        response.on("close", function(err) {
            if (allowEarlyClose) {
                passBackControl(response, result);
            }
        });
        response.addListener("end", function() {
            passBackControl(response, result);
        });
    });
    request.on('error', function(e) {
        callbackCalled = true;
        callback(e);
    });
    if ((options.method == 'POST' || options.method == 'PUT') && post_body) {
        request.write(post_body);
    }
    request.end();
};
exports.OAuth2.prototype.getAuthorizeUrl = function(params) {
    var params = params || {};
    params['client_id'] = this._clientId;
    return this._baseSite + this._authorizeUrl + "?" + querystring.stringify(params);
};
exports.OAuth2.prototype.getOAuthAccessToken = function(code, params, callback) {
    var params = params || {};
    params['client_id'] = this._clientId;
    params['client_secret'] = this._clientSecret;
    var codeParam = params.grant_type === 'refresh_token' ? 'refresh_token' : 'code';
    params[codeParam] = code;
    var post_data = querystring.stringify(params);
    var post_headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results;
            try {
                // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
                // responses should be in JSON
                results = JSON.parse(data);
            } catch (e) {
                // .... However both Facebook + Github currently use rev05 of the spec
                // and neither seem to specify a content-type correctly in their response headers :(
                // clients of these services will suffer a *minor* performance cost of the exception
                // being thrown
                results = querystring.parse(data);
            }
            var access_token = results["access_token"];
            var refresh_token = results["refresh_token"];
            delete results["refresh_token"];
            callback(null, access_token, refresh_token, results); // callback results =-=
        }
    });
};
// Deprecated
exports.OAuth2.prototype.getProtectedResource = function(url, access_token, callback) {
    this._request("GET", url, {}, "", access_token, callback);
};
exports.OAuth2.prototype.get = function(url, access_token, callback) {
    if (this._useAuthorizationHeaderForGET) {
        var headers = {
            'Authorization': this.buildAuthHeader(access_token)
        };
        access_token = null;
    } else {
        headers = {};
    }
    this._request("GET", url, headers, "", access_token, callback);
};
}),
"[project]/IT4409/Instagram-lite/node_modules/oauth/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

exports.OAuth = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/oauth/lib/oauth.js [app-client] (ecmascript)").OAuth;
exports.OAuthEcho = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/oauth/lib/oauth.js [app-client] (ecmascript)").OAuthEcho;
exports.OAuth2 = __turbopack_context__.r("[project]/IT4409/Instagram-lite/node_modules/oauth/lib/oauth2.js [app-client] (ecmascript)").OAuth2;
}),
"[project]/IT4409/Instagram-lite/node_modules/@panva/hkdf/dist/web/runtime/hkdf.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const getGlobal = ()=>{
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    throw new Error('unable to locate global object');
};
const __TURBOPACK__default__export__ = async (digest, ikm, salt, info, keylen)=>{
    const { crypto: { subtle } } = getGlobal();
    return new Uint8Array(await subtle.deriveBits({
        name: 'HKDF',
        hash: "SHA-".concat(digest.substr(3)),
        salt,
        info
    }, await subtle.importKey('raw', ikm, 'HKDF', false, [
        'deriveBits'
    ]), keylen << 3));
};
}),
"[project]/IT4409/Instagram-lite/node_modules/@panva/hkdf/dist/web/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>hkdf,
    "hkdf",
    ()=>hkdf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$web$2f$runtime$2f$hkdf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/@panva/hkdf/dist/web/runtime/hkdf.js [app-client] (ecmascript)");
;
function normalizeDigest(digest) {
    switch(digest){
        case 'sha256':
        case 'sha384':
        case 'sha512':
        case 'sha1':
            return digest;
        default:
            throw new TypeError('unsupported "digest" value');
    }
}
function normalizeUint8Array(input, label) {
    if (typeof input === 'string') return new TextEncoder().encode(input);
    if (!(input instanceof Uint8Array)) throw new TypeError('"'.concat(label, '"" must be an instance of Uint8Array or a string'));
    return input;
}
function normalizeIkm(input) {
    const ikm = normalizeUint8Array(input, 'ikm');
    if (!ikm.byteLength) throw new TypeError('"ikm" must be at least one byte in length');
    return ikm;
}
function normalizeInfo(input) {
    const info = normalizeUint8Array(input, 'info');
    if (info.byteLength > 1024) {
        throw TypeError('"info" must not contain more than 1024 bytes');
    }
    return info;
}
function normalizeKeylen(input, digest) {
    if (typeof input !== 'number' || !Number.isInteger(input) || input < 1) {
        throw new TypeError('"keylen" must be a positive integer');
    }
    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
    if (input > 255 * hashlen) {
        throw new TypeError('"keylen" too large');
    }
    return input;
}
async function hkdf(digest, ikm, salt, info, keylen) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$web$2f$runtime$2f$hkdf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(normalizeDigest(digest), normalizeIkm(ikm), normalizeUint8Array(salt, 'salt'), normalizeInfo(info), normalizeKeylen(keylen, digest));
}
;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/rng.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
__turbopack_context__.s([
    "default",
    ()=>rng
]);
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
    // lazy load so that environments that need to polyfill have a chance to do so
    if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);
        if (!getRandomValues) {
            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
    }
    return getRandomValues(rnds8);
}
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/regex.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$regex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/regex.js [app-client] (ecmascript)");
;
function validate(uuid) {
    return typeof uuid === 'string' && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$regex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].test(uuid);
}
const __TURBOPACK__default__export__ = validate;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/stringify.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript)");
;
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ var byteToHex = [];
for(var i = 0; i < 256; ++i){
    byteToHex.push((i + 0x100).toString(16).substr(1));
}
function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
const __TURBOPACK__default__export__ = stringify;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v1.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$rng$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/rng.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/stringify.js [app-client] (ecmascript)"); // **`v1()` - Generate time-based UUID**
;
;
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
var _nodeId;
var _clockseq; // Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || new Array(16);
    options = options || {};
    var node = options.node || _nodeId;
    var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
        var seedBytes = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$rng$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
        if (node == null) {
            // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
            node = _nodeId = [
                seedBytes[0] | 0x01,
                seedBytes[1],
                seedBytes[2],
                seedBytes[3],
                seedBytes[4],
                seedBytes[5]
            ];
        }
        if (clockseq == null) {
            // Per 4.2.2, randomize (14 bit) clockseq
            clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
    } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)
    var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
    } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
    } // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000; // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff; // `time_mid`
    var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff; // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`
    b[i++] = clockseq & 0xff; // `node`
    for(var n = 0; n < 6; ++n){
        b[i + n] = node[n];
    }
    return buf || (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(b);
}
const __TURBOPACK__default__export__ = v1;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/parse.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript)");
;
function parse(uuid) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    var v;
    var arr = new Uint8Array(16); // Parse ########-....-....-....-............
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 0xff;
    arr[2] = v >>> 8 & 0xff;
    arr[3] = v & 0xff; // Parse ........-####-....-....-............
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 0xff; // Parse ........-....-####-....-............
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 0xff; // Parse ........-....-....-####-............
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 0xff; // Parse ........-....-....-....-############
    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
    arr[11] = v / 0x100000000 & 0xff;
    arr[12] = v >>> 24 & 0xff;
    arr[13] = v >>> 16 & 0xff;
    arr[14] = v >>> 8 & 0xff;
    arr[15] = v & 0xff;
    return arr;
}
const __TURBOPACK__default__export__ = parse;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v35.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DNS",
    ()=>DNS,
    "URL",
    ()=>URL,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/stringify.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/parse.js [app-client] (ecmascript)");
;
;
function stringToBytes(str) {
    str = unescape(encodeURIComponent(str)); // UTF8 escape
    var bytes = [];
    for(var i = 0; i < str.length; ++i){
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}
var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function __TURBOPACK__default__export__(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
        if (typeof value === 'string') {
            value = stringToBytes(value);
        }
        if (typeof namespace === 'string') {
            namespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(namespace);
        }
        if (namespace.length !== 16) {
            throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
        } // Compute hash of namespace and value, Per 4.3
        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
        // hashfunc([...namespace, ... value])`
        var bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 0x0f | version;
        bytes[8] = bytes[8] & 0x3f | 0x80;
        if (buf) {
            offset = offset || 0;
            for(var i = 0; i < 16; ++i){
                buf[offset + i] = bytes[i];
            }
            return buf;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(bytes);
    } // Function#name is not settable on some platforms (#270)
    try {
        generateUUID.name = name; // eslint-disable-next-line no-empty
    } catch (err) {} // For CommonJS default export support
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
}
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/md5.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function md5(bytes) {
    if (typeof bytes === 'string') {
        var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape
        bytes = new Uint8Array(msg.length);
        for(var i = 0; i < msg.length; ++i){
            bytes[i] = msg.charCodeAt(i);
        }
    }
    return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */ function md5ToHexEncodedArray(input) {
    var output = [];
    var length32 = input.length * 32;
    var hexTab = '0123456789abcdef';
    for(var i = 0; i < length32; i += 8){
        var x = input[i >> 5] >>> i % 32 & 0xff;
        var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
        output.push(hex);
    }
    return output;
}
/**
 * Calculate output length with padding and bit length
 */ function getOutputLength(inputLength8) {
    return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */ function wordsToMd5(x, len) {
    /* append padding */ x[len >> 5] |= 0x80 << len % 32;
    x[getOutputLength(len) - 1] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for(var i = 0; i < x.length; i += 16){
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5ff(a, b, c, d, x[i], 7, -680876936);
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5gg(b, c, d, a, x[i], 20, -373897302);
        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5hh(d, a, b, c, x[i], 11, -358537222);
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5ii(a, b, c, d, x[i], 6, -198630844);
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
    }
    return [
        a,
        b,
        c,
        d
    ];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */ function bytesToWords(input) {
    if (input.length === 0) {
        return [];
    }
    var length8 = input.length * 8;
    var output = new Uint32Array(getOutputLength(length8));
    for(var i = 0; i < length8; i += 8){
        output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
    }
    return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */ function safeAdd(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */ function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */ function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c, d, x, s, t) {
    return md5cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5gg(a, b, c, d, x, s, t) {
    return md5cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}
const __TURBOPACK__default__export__ = md5;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v3.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v35$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v35.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$md5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/md5.js [app-client] (ecmascript)");
;
;
var v3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v35$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('v3', 0x30, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$md5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = v3;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$rng$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/rng.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/stringify.js [app-client] (ecmascript)");
;
;
function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$rng$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(var i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(rnds);
}
const __TURBOPACK__default__export__ = v4;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/sha1.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function f(s, x, y, z) {
    switch(s){
        case 0:
            return x & y ^ ~x & z;
        case 1:
            return x ^ y ^ z;
        case 2:
            return x & y ^ x & z ^ y & z;
        case 3:
            return x ^ y ^ z;
    }
}
function ROTL(x, n) {
    return x << n | x >>> 32 - n;
}
function sha1(bytes) {
    var K = [
        0x5a827999,
        0x6ed9eba1,
        0x8f1bbcdc,
        0xca62c1d6
    ];
    var H = [
        0x67452301,
        0xefcdab89,
        0x98badcfe,
        0x10325476,
        0xc3d2e1f0
    ];
    if (typeof bytes === 'string') {
        var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape
        bytes = [];
        for(var i = 0; i < msg.length; ++i){
            bytes.push(msg.charCodeAt(i));
        }
    } else if (!Array.isArray(bytes)) {
        // Convert Array-like to Array
        bytes = Array.prototype.slice.call(bytes);
    }
    bytes.push(0x80);
    var l = bytes.length / 4 + 2;
    var N = Math.ceil(l / 16);
    var M = new Array(N);
    for(var _i = 0; _i < N; ++_i){
        var arr = new Uint32Array(16);
        for(var j = 0; j < 16; ++j){
            arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
        }
        M[_i] = arr;
    }
    M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;
    for(var _i2 = 0; _i2 < N; ++_i2){
        var W = new Uint32Array(80);
        for(var t = 0; t < 16; ++t){
            W[t] = M[_i2][t];
        }
        for(var _t = 16; _t < 80; ++_t){
            W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
        }
        var a = H[0];
        var b = H[1];
        var c = H[2];
        var d = H[3];
        var e = H[4];
        for(var _t2 = 0; _t2 < 80; ++_t2){
            var s = Math.floor(_t2 / 20);
            var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
            e = d;
            d = c;
            c = ROTL(b, 30) >>> 0;
            b = a;
            a = T;
        }
        H[0] = H[0] + a >>> 0;
        H[1] = H[1] + b >>> 0;
        H[2] = H[2] + c >>> 0;
        H[3] = H[3] + d >>> 0;
        H[4] = H[4] + e >>> 0;
    }
    return [
        H[0] >> 24 & 0xff,
        H[0] >> 16 & 0xff,
        H[0] >> 8 & 0xff,
        H[0] & 0xff,
        H[1] >> 24 & 0xff,
        H[1] >> 16 & 0xff,
        H[1] >> 8 & 0xff,
        H[1] & 0xff,
        H[2] >> 24 & 0xff,
        H[2] >> 16 & 0xff,
        H[2] >> 8 & 0xff,
        H[2] & 0xff,
        H[3] >> 24 & 0xff,
        H[3] >> 16 & 0xff,
        H[3] >> 8 & 0xff,
        H[3] & 0xff,
        H[4] >> 24 & 0xff,
        H[4] >> 16 & 0xff,
        H[4] >> 8 & 0xff,
        H[4] & 0xff
    ];
}
const __TURBOPACK__default__export__ = sha1;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v5.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v35$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v35.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$sha1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/sha1.js [app-client] (ecmascript)");
;
;
var v5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v35$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('v5', 0x50, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$sha1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = v5;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/nil.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = '00000000-0000-0000-0000-000000000000';
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/version.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript)");
;
function version(uuid) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    return parseInt(uuid.substr(14, 1), 16);
}
const __TURBOPACK__default__export__ = version;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NIL",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$nil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "parse",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "stringify",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "v1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "v3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "v4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "v5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "validate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "version",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v3.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/v5.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$nil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/nil.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/stringify.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/uuid/dist/esm-browser/parse.js [app-client] (ecmascript)");
}),
"[project]/IT4409/Instagram-lite/node_modules/preact/dist/preact.module.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Component",
    ()=>x,
    "Fragment",
    ()=>k,
    "cloneElement",
    ()=>J,
    "createContext",
    ()=>K,
    "createElement",
    ()=>_,
    "createRef",
    ()=>b,
    "h",
    ()=>_,
    "hydrate",
    ()=>G,
    "isValidElement",
    ()=>t,
    "options",
    ()=>l,
    "render",
    ()=>E,
    "toChildArray",
    ()=>H
]);
var n, l, u, t, i, r, o, e, f, c, s, a, h, p = {}, y = [], v = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, w = Array.isArray;
function d(n, l) {
    for(var u in l)n[u] = l[u];
    return n;
}
function g(n) {
    n && n.parentNode && n.parentNode.removeChild(n);
}
function _(l, u, t) {
    var i, r, o, e = {};
    for(o in u)"key" == o ? i = u[o] : "ref" == o ? r = u[o] : e[o] = u[o];
    if (arguments.length > 2 && (e.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps) for(o in l.defaultProps)null == e[o] && (e[o] = l.defaultProps[o]);
    return m(l, e, i, r, null);
}
function m(n, t, i, r, o) {
    var e = {
        type: n,
        props: t,
        key: i,
        ref: r,
        __k: null,
        __: null,
        __b: 0,
        __e: null,
        __c: null,
        constructor: void 0,
        __v: null == o ? ++u : o,
        __i: -1,
        __u: 0
    };
    return null == o && null != l.vnode && l.vnode(e), e;
}
function b() {
    return {
        current: null
    };
}
function k(n) {
    return n.children;
}
function x(n, l) {
    this.props = n, this.context = l;
}
function S(n, l) {
    if (null == l) return n.__ ? S(n.__, n.__i + 1) : null;
    for(var u; l < n.__k.length; l++)if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
    return "function" == typeof n.type ? S(n) : null;
}
function C(n) {
    var l, u;
    if (null != (n = n.__) && null != n.__c) {
        for(n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)if (null != (u = n.__k[l]) && null != u.__e) {
            n.__e = n.__c.base = u.__e;
            break;
        }
        return C(n);
    }
}
function M(n) {
    (!n.__d && (n.__d = !0) && i.push(n) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
}
function $() {
    for(var n, u, t, r, o, f, c, s = 1; i.length;)i.length > s && i.sort(e), n = i.shift(), s = i.length, n.__d && (t = void 0, o = (r = (u = n).__v).__e, f = [], c = [], u.__P && ((t = d({}, r)).__v = r.__v + 1, l.vnode && l.vnode(t), O(u.__P, t, r, u.__n, u.__P.namespaceURI, 32 & r.__u ? [
        o
    ] : null, f, null == o ? S(r) : o, !!(32 & r.__u), c), t.__v = r.__v, t.__.__k[t.__i] = t, z(f, t, c), t.__e != o && C(t)));
    $.__r = 0;
}
function I(n, l, u, t, i, r, o, e, f, c, s) {
    var a, h, v, w, d, g, _ = t && t.__k || y, m = l.length;
    for(f = P(u, l, _, f, m), a = 0; a < m; a++)null != (v = u.__k[a]) && (h = -1 == v.__i ? p : _[v.__i] || p, v.__i = a, g = O(n, v, h, i, r, o, e, f, c, s), w = v.__e, v.ref && h.ref != v.ref && (h.ref && q(h.ref, null, v), s.push(v.ref, v.__c || w, v)), null == d && null != w && (d = w), 4 & v.__u || h.__k === v.__k ? f = A(v, f, n) : "function" == typeof v.type && void 0 !== g ? f = g : w && (f = w.nextSibling), v.__u &= -7);
    return u.__e = d, f;
}
function P(n, l, u, t, i) {
    var r, o, e, f, c, s = u.length, a = s, h = 0;
    for(n.__k = new Array(i), r = 0; r < i; r++)null != (o = l[r]) && "boolean" != typeof o && "function" != typeof o ? (f = r + h, (o = n.__k[r] = "string" == typeof o || "number" == typeof o || "bigint" == typeof o || o.constructor == String ? m(null, o, null, null, null) : w(o) ? m(k, {
        children: o
    }, null, null, null) : null == o.constructor && o.__b > 0 ? m(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : o).__ = n, o.__b = n.__b + 1, e = null, -1 != (c = o.__i = L(o, u, f, a)) && (a--, (e = u[c]) && (e.__u |= 2)), null == e || null == e.__v ? (-1 == c && (i > s ? h-- : i < s && h++), "function" != typeof o.type && (o.__u |= 4)) : c != f && (c == f - 1 ? h-- : c == f + 1 ? h++ : (c > f ? h-- : h++, o.__u |= 4))) : n.__k[r] = null;
    if (a) for(r = 0; r < s; r++)null != (e = u[r]) && 0 == (2 & e.__u) && (e.__e == t && (t = S(e)), B(e, e));
    return t;
}
function A(n, l, u) {
    var t, i;
    if ("function" == typeof n.type) {
        for(t = n.__k, i = 0; t && i < t.length; i++)t[i] && (t[i].__ = n, l = A(t[i], l, u));
        return l;
    }
    n.__e != l && (l && n.type && !u.contains(l) && (l = S(n)), u.insertBefore(n.__e, l || null), l = n.__e);
    do {
        l = l && l.nextSibling;
    }while (null != l && 8 == l.nodeType)
    return l;
}
function H(n, l) {
    return l = l || [], null == n || "boolean" == typeof n || (w(n) ? n.some(function(n) {
        H(n, l);
    }) : l.push(n)), l;
}
function L(n, l, u, t) {
    var i, r, o = n.key, e = n.type, f = l[u];
    if (null === f && null == n.key || f && o == f.key && e == f.type && 0 == (2 & f.__u)) return u;
    if (t > (null != f && 0 == (2 & f.__u) ? 1 : 0)) for(i = u - 1, r = u + 1; i >= 0 || r < l.length;){
        if (i >= 0) {
            if ((f = l[i]) && 0 == (2 & f.__u) && o == f.key && e == f.type) return i;
            i--;
        }
        if (r < l.length) {
            if ((f = l[r]) && 0 == (2 & f.__u) && o == f.key && e == f.type) return r;
            r++;
        }
    }
    return -1;
}
function T(n, l, u) {
    "-" == l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || v.test(l) ? u : u + "px";
}
function j(n, l, u, t, i) {
    var r, o;
    n: if ("style" == l) if ("string" == typeof u) n.style.cssText = u;
    else {
        if ("string" == typeof t && (n.style.cssText = t = ""), t) for(l in t)u && l in u || T(n.style, l, "");
        if (u) for(l in u)t && u[l] == t[l] || T(n.style, l, u[l]);
    }
    else if ("o" == l[0] && "n" == l[1]) r = l != (l = l.replace(f, "$1")), o = l.toLowerCase(), l = o in n || "onFocusOut" == l || "onFocusIn" == l ? o.slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + r] = u, u ? t ? u.u = t.u : (u.u = c, n.addEventListener(l, r ? a : s, r)) : n.removeEventListener(l, r ? a : s, r);
    else {
        if ("http://www.w3.org/2000/svg" == i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" != l && "height" != l && "href" != l && "list" != l && "form" != l && "tabIndex" != l && "download" != l && "rowSpan" != l && "colSpan" != l && "role" != l && "popover" != l && l in n) try {
            n[l] = null == u ? "" : u;
            break n;
        } catch (n) {}
        "function" == typeof u || (null == u || !1 === u && "-" != l[4] ? n.removeAttribute(l) : n.setAttribute(l, "popover" == l && 1 == u ? "" : u));
    }
}
function F(n) {
    return function(u) {
        if (this.l) {
            var t = this.l[u.type + n];
            if (null == u.t) u.t = c++;
            else if (u.t < t.u) return;
            return t(l.event ? l.event(u) : u);
        }
    };
}
function O(n, u, t, i, r, o, e, f, c, s) {
    var a, h, p, y, v, _, m, b, S, C, M, $, P, A, H, L, T, j = u.type;
    if (null != u.constructor) return null;
    128 & t.__u && (c = !!(32 & t.__u), o = [
        f = u.__e = t.__e
    ]), (a = l.__b) && a(u);
    n: if ("function" == typeof j) try {
        if (b = u.props, S = "prototype" in j && j.prototype.render, C = (a = j.contextType) && i[a.__c], M = a ? C ? C.props.value : a.__ : i, t.__c ? m = (h = u.__c = t.__c).__ = h.__E : (S ? u.__c = h = new j(b, M) : (u.__c = h = new x(b, M), h.constructor = j, h.render = D), C && C.sub(h), h.props = b, h.state || (h.state = {}), h.context = M, h.__n = i, p = h.__d = !0, h.__h = [], h._sb = []), S && null == h.__s && (h.__s = h.state), S && null != j.getDerivedStateFromProps && (h.__s == h.state && (h.__s = d({}, h.__s)), d(h.__s, j.getDerivedStateFromProps(b, h.__s))), y = h.props, v = h.state, h.__v = u, p) S && null == j.getDerivedStateFromProps && null != h.componentWillMount && h.componentWillMount(), S && null != h.componentDidMount && h.__h.push(h.componentDidMount);
        else {
            if (S && null == j.getDerivedStateFromProps && b !== y && null != h.componentWillReceiveProps && h.componentWillReceiveProps(b, M), !h.__e && null != h.shouldComponentUpdate && !1 === h.shouldComponentUpdate(b, h.__s, M) || u.__v == t.__v) {
                for(u.__v != t.__v && (h.props = b, h.state = h.__s, h.__d = !1), u.__e = t.__e, u.__k = t.__k, u.__k.some(function(n) {
                    n && (n.__ = u);
                }), $ = 0; $ < h._sb.length; $++)h.__h.push(h._sb[$]);
                h._sb = [], h.__h.length && e.push(h);
                break n;
            }
            null != h.componentWillUpdate && h.componentWillUpdate(b, h.__s, M), S && null != h.componentDidUpdate && h.__h.push(function() {
                h.componentDidUpdate(y, v, _);
            });
        }
        if (h.context = M, h.props = b, h.__P = n, h.__e = !1, P = l.__r, A = 0, S) {
            for(h.state = h.__s, h.__d = !1, P && P(u), a = h.render(h.props, h.state, h.context), H = 0; H < h._sb.length; H++)h.__h.push(h._sb[H]);
            h._sb = [];
        } else do {
            h.__d = !1, P && P(u), a = h.render(h.props, h.state, h.context), h.state = h.__s;
        }while (h.__d && ++A < 25)
        h.state = h.__s, null != h.getChildContext && (i = d(d({}, i), h.getChildContext())), S && !p && null != h.getSnapshotBeforeUpdate && (_ = h.getSnapshotBeforeUpdate(y, v)), L = a, null != a && a.type === k && null == a.key && (L = N(a.props.children)), f = I(n, w(L) ? L : [
            L
        ], u, t, i, r, o, e, f, c, s), h.base = u.__e, u.__u &= -161, h.__h.length && e.push(h), m && (h.__E = h.__ = null);
    } catch (n) {
        if (u.__v = null, c || null != o) if (n.then) {
            for(u.__u |= c ? 160 : 128; f && 8 == f.nodeType && f.nextSibling;)f = f.nextSibling;
            o[o.indexOf(f)] = null, u.__e = f;
        } else for(T = o.length; T--;)g(o[T]);
        else u.__e = t.__e, u.__k = t.__k;
        l.__e(n, u, t);
    }
    else null == o && u.__v == t.__v ? (u.__k = t.__k, u.__e = t.__e) : f = u.__e = V(t.__e, u, t, i, r, o, e, c, s);
    return (a = l.diffed) && a(u), 128 & u.__u ? void 0 : f;
}
function z(n, u, t) {
    for(var i = 0; i < t.length; i++)q(t[i], t[++i], t[++i]);
    l.__c && l.__c(u, n), n.some(function(u) {
        try {
            n = u.__h, u.__h = [], n.some(function(n) {
                n.call(u);
            });
        } catch (n) {
            l.__e(n, u.__v);
        }
    });
}
function N(n) {
    return "object" != typeof n || null == n || n.__b && n.__b > 0 ? n : w(n) ? n.map(N) : d({}, n);
}
function V(u, t, i, r, o, e, f, c, s) {
    var a, h, y, v, d, _, m, b = i.props, k = t.props, x = t.type;
    if ("svg" == x ? o = "http://www.w3.org/2000/svg" : "math" == x ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), null != e) {
        for(a = 0; a < e.length; a++)if ((d = e[a]) && "setAttribute" in d == !!x && (x ? d.localName == x : 3 == d.nodeType)) {
            u = d, e[a] = null;
            break;
        }
    }
    if (null == u) {
        if (null == x) return document.createTextNode(k);
        u = document.createElementNS(o, x, k.is && k), c && (l.__m && l.__m(t, e), c = !1), e = null;
    }
    if (null == x) b === k || c && u.data == k || (u.data = k);
    else {
        if (e = e && n.call(u.childNodes), b = i.props || p, !c && null != e) for(b = {}, a = 0; a < u.attributes.length; a++)b[(d = u.attributes[a]).name] = d.value;
        for(a in b)if (d = b[a], "children" == a) ;
        else if ("dangerouslySetInnerHTML" == a) y = d;
        else if (!(a in k)) {
            if ("value" == a && "defaultValue" in k || "checked" == a && "defaultChecked" in k) continue;
            j(u, a, null, d, o);
        }
        for(a in k)d = k[a], "children" == a ? v = d : "dangerouslySetInnerHTML" == a ? h = d : "value" == a ? _ = d : "checked" == a ? m = d : c && "function" != typeof d || b[a] === d || j(u, a, d, b[a], o);
        if (h) c || y && (h.__html == y.__html || h.__html == u.innerHTML) || (u.innerHTML = h.__html), t.__k = [];
        else if (y && (u.innerHTML = ""), I("template" == t.type ? u.content : u, w(v) ? v : [
            v
        ], t, i, r, "foreignObject" == x ? "http://www.w3.org/1999/xhtml" : o, e, f, e ? e[0] : i.__k && S(i, 0), c, s), null != e) for(a = e.length; a--;)g(e[a]);
        c || (a = "value", "progress" == x && null == _ ? u.removeAttribute("value") : null != _ && (_ !== u[a] || "progress" == x && !_ || "option" == x && _ != b[a]) && j(u, a, _, b[a], o), a = "checked", null != m && m != u[a] && j(u, a, m, b[a], o));
    }
    return u;
}
function q(n, u, t) {
    try {
        if ("function" == typeof n) {
            var i = "function" == typeof n.__u;
            i && n.__u(), i && null == u || (n.__u = n(u));
        } else n.current = u;
    } catch (n) {
        l.__e(n, t);
    }
}
function B(n, u, t) {
    var i, r;
    if (l.unmount && l.unmount(n), (i = n.ref) && (i.current && i.current != n.__e || q(i, null, u)), null != (i = n.__c)) {
        if (i.componentWillUnmount) try {
            i.componentWillUnmount();
        } catch (n) {
            l.__e(n, u);
        }
        i.base = i.__P = null;
    }
    if (i = n.__k) for(r = 0; r < i.length; r++)i[r] && B(i[r], u, t || "function" != typeof n.type);
    t || g(n.__e), n.__c = n.__ = n.__e = void 0;
}
function D(n, l, u) {
    return this.constructor(n, u);
}
function E(u, t, i) {
    var r, o, e, f;
    t == document && (t = document.documentElement), l.__ && l.__(u, t), o = (r = "function" == typeof i) ? null : i && i.__k || t.__k, e = [], f = [], O(t, u = (!r && i || t).__k = _(k, null, [
        u
    ]), o || p, p, t.namespaceURI, !r && i ? [
        i
    ] : o ? null : t.firstChild ? n.call(t.childNodes) : null, e, !r && i ? i : o ? o.__e : t.firstChild, r, f), z(e, u, f);
}
function G(n, l) {
    E(n, l, G);
}
function J(l, u, t) {
    var i, r, o, e, f = d({}, l.props);
    for(o in l.type && l.type.defaultProps && (e = l.type.defaultProps), u)"key" == o ? i = u[o] : "ref" == o ? r = u[o] : f[o] = null == u[o] && null != e ? e[o] : u[o];
    return arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : t), m(l.type, f, i || l.key, r || l.ref, null);
}
function K(n) {
    function l(n) {
        var u, t;
        return this.getChildContext || (u = new Set, (t = {})[l.__c] = this, this.getChildContext = function() {
            return t;
        }, this.componentWillUnmount = function() {
            u = null;
        }, this.shouldComponentUpdate = function(n) {
            this.props.value != n.value && u.forEach(function(n) {
                n.__e = !0, M(n);
            });
        }, this.sub = function(n) {
            u.add(n);
            var l = n.componentWillUnmount;
            n.componentWillUnmount = function() {
                u && u.delete(n), l && l.call(n);
            };
        }), n.children;
    }
    return l.__c = "__cC" + h++, l.__ = n, l.Provider = l.__l = (l.Consumer = function(n, l) {
        return n.children(l);
    }).contextType = l, l;
}
n = y.slice, l = {
    __e: function(n, l, u, t) {
        for(var i, r, o; l = l.__;)if ((i = l.__c) && !i.__) try {
            if ((r = i.constructor) && null != r.getDerivedStateFromError && (i.setState(r.getDerivedStateFromError(n)), o = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), o = i.__d), o) return i.__E = i;
        } catch (l) {
            n = l;
        }
        throw n;
    }
}, u = 0, t = function(n) {
    return null != n && null == n.constructor;
}, x.prototype.setState = function(n, l) {
    var u;
    u = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n && (n = n(d({}, u), this.props)), n && d(u, n), null != n && this.__v && (l && this._sb.push(l), M(this));
}, x.prototype.forceUpdate = function(n) {
    this.__v && (this.__e = !0, n && this.__h.push(n), M(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n, l) {
    return n.__v.__b - l.__v.__b;
}, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(!1), a = F(!0), h = 0;
;
 //# sourceMappingURL=preact.module.js.map
}),
"[project]/IT4409/Instagram-lite/node_modules/preact-render-to-string/dist/index.module.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "render",
    ()=>S,
    "renderToStaticMarkup",
    ()=>S,
    "renderToString",
    ()=>S,
    "shallowRender",
    ()=>x
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/preact/dist/preact.module.js [app-client] (ecmascript)");
;
var n = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i, o = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, i = /[\s\n\\/='"\0<>]/, l = /^xlink:?./, a = /["&<]/;
function s(e) {
    if (!1 === a.test(e += "")) return e;
    for(var t = 0, r = 0, n = "", o = ""; r < e.length; r++){
        switch(e.charCodeAt(r)){
            case 34:
                o = "&quot;";
                break;
            case 38:
                o = "&amp;";
                break;
            case 60:
                o = "&lt;";
                break;
            default:
                continue;
        }
        r !== t && (n += e.slice(t, r)), n += o, t = r + 1;
    }
    return r !== t && (n += e.slice(t, r)), n;
}
var f = function(e, t) {
    return String(e).replace(/(\n+)/g, "$1" + (t || "\t"));
}, u = function(e, t, r) {
    return String(e).length > (t || 40) || !r && -1 !== String(e).indexOf("\n") || -1 !== String(e).indexOf("<");
}, c = {}, _ = /([A-Z])/g;
function p(e) {
    var t = "";
    for(var r in e){
        var o = e[r];
        null != o && "" !== o && (t && (t += " "), t += "-" == r[0] ? r : c[r] || (c[r] = r.replace(_, "-$1").toLowerCase()), t = "number" == typeof o && !1 === n.test(r) ? t + ": " + o + "px;" : t + ": " + o + ";");
    }
    return t || void 0;
}
function d(e, t) {
    return Array.isArray(t) ? t.reduce(d, e) : null != t && !1 !== t && e.push(t), e;
}
function v() {
    this.__d = !0;
}
function h(e, t) {
    return {
        __v: e,
        context: t,
        props: e.props,
        setState: v,
        forceUpdate: v,
        __d: !0,
        __h: []
    };
}
function g(e, t) {
    var r = e.contextType, n = r && t[r.__c];
    return null != r ? n ? n.props.value : r.__ : t;
}
var y = [];
function m(r, n, a, c, _, v) {
    if (null == r || "boolean" == typeof r) return "";
    if ("object" != typeof r) return "function" == typeof r ? "" : s(r);
    var b = a.pretty, x = b && "string" == typeof b ? b : "\t";
    if (Array.isArray(r)) {
        for(var k = "", S = 0; S < r.length; S++)b && S > 0 && (k += "\n"), k += m(r[S], n, a, c, _, v);
        return k;
    }
    if (void 0 !== r.constructor) return "";
    var w, C = r.type, O = r.props, j = !1;
    if ("function" == typeof C) {
        if (j = !0, !a.shallow || !c && !1 !== a.renderRootComponent) {
            if (C === __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]) {
                var A = [];
                return d(A, r.props.children), m(A, n, a, !1 !== a.shallowHighOrder, _, v);
            }
            var F, H = r.__c = h(r, n);
            __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__b && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__b(r);
            var M = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__r;
            if (C.prototype && "function" == typeof C.prototype.render) {
                var L = g(C, n);
                (H = r.__c = new C(O, L)).__v = r, H._dirty = H.__d = !0, H.props = O, null == H.state && (H.state = {}), null == H._nextState && null == H.__s && (H._nextState = H.__s = H.state), H.context = L, C.getDerivedStateFromProps ? H.state = Object.assign({}, H.state, C.getDerivedStateFromProps(H.props, H.state)) : H.componentWillMount && (H.componentWillMount(), H.state = H._nextState !== H.state ? H._nextState : H.__s !== H.state ? H.__s : H.state), M && M(r), F = H.render(H.props, H.state, H.context);
            } else for(var T = g(C, n), E = 0; H.__d && E++ < 25;)H.__d = !1, M && M(r), F = C.call(r.__c, O, T);
            return H.getChildContext && (n = Object.assign({}, n, H.getChildContext())), __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].diffed && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].diffed(r), m(F, n, a, !1 !== a.shallowHighOrder, _, v);
        }
        C = (w = C).displayName || w !== Function && w.name || function(e) {
            var t = (Function.prototype.toString.call(e).match(/^\s*function\s+([^( ]+)/) || "")[1];
            if (!t) {
                for(var r = -1, n = y.length; n--;)if (y[n] === e) {
                    r = n;
                    break;
                }
                r < 0 && (r = y.push(e) - 1), t = "UnnamedComponent" + r;
            }
            return t;
        }(w);
    }
    var $, D, N = "<" + C;
    if (O) {
        var P = Object.keys(O);
        a && !0 === a.sortAttributes && P.sort();
        for(var W = 0; W < P.length; W++){
            var I = P[W], R = O[I];
            if ("children" !== I) {
                if (!i.test(I) && (a && a.allAttributes || "key" !== I && "ref" !== I && "__self" !== I && "__source" !== I)) {
                    if ("defaultValue" === I) I = "value";
                    else if ("defaultChecked" === I) I = "checked";
                    else if ("defaultSelected" === I) I = "selected";
                    else if ("className" === I) {
                        if (void 0 !== O.class) continue;
                        I = "class";
                    } else _ && l.test(I) && (I = I.toLowerCase().replace(/^xlink:?/, "xlink:"));
                    if ("htmlFor" === I) {
                        if (O.for) continue;
                        I = "for";
                    }
                    "style" === I && R && "object" == typeof R && (R = p(R)), "a" === I[0] && "r" === I[1] && "boolean" == typeof R && (R = String(R));
                    var U = a.attributeHook && a.attributeHook(I, R, n, a, j);
                    if (U || "" === U) N += U;
                    else if ("dangerouslySetInnerHTML" === I) D = R && R.__html;
                    else if ("textarea" === C && "value" === I) $ = R;
                    else if ((R || 0 === R || "" === R) && "function" != typeof R) {
                        if (!(!0 !== R && "" !== R || (R = I, a && a.xml))) {
                            N = N + " " + I;
                            continue;
                        }
                        if ("value" === I) {
                            if ("select" === C) {
                                v = R;
                                continue;
                            }
                            "option" === C && v == R && void 0 === O.selected && (N += " selected");
                        }
                        N = N + " " + I + '="' + s(R) + '"';
                    }
                }
            } else $ = R;
        }
    }
    if (b) {
        var V = N.replace(/\n\s*/, " ");
        V === N || ~V.indexOf("\n") ? b && ~N.indexOf("\n") && (N += "\n") : N = V;
    }
    if (N += ">", i.test(C)) throw new Error(C + " is not a valid HTML tag name in " + N);
    var q, z = o.test(C) || a.voidElements && a.voidElements.test(C), Z = [];
    if (D) b && u(D) && (D = "\n" + x + f(D, x)), N += D;
    else if (null != $ && d(q = [], $).length) {
        for(var B = b && ~N.indexOf("\n"), G = !1, J = 0; J < q.length; J++){
            var K = q[J];
            if (null != K && !1 !== K) {
                var Q = m(K, n, a, !0, "svg" === C || "foreignObject" !== C && _, v);
                if (b && !B && u(Q) && (B = !0), Q) if (b) {
                    var X = Q.length > 0 && "<" != Q[0];
                    G && X ? Z[Z.length - 1] += Q : Z.push(Q), G = X;
                } else Z.push(Q);
            }
        }
        if (b && B) for(var Y = Z.length; Y--;)Z[Y] = "\n" + x + f(Z[Y], x);
    }
    if (Z.length || D) N += Z.join("");
    else if (a && a.xml) return N.substring(0, N.length - 1) + " />";
    return !z || q || D ? (b && ~N.indexOf("\n") && (N += "\n"), N = N + "</" + C + ">") : N = N.replace(/>$/, " />"), N;
}
var b = {
    shallow: !0
};
S.render = S;
var x = function(e, t) {
    return S(e, t, b);
}, k = [];
function S(n, o, i) {
    o = o || {};
    var l = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__s;
    __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__s = !0;
    var a, s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["h"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null);
    return s.__k = [
        n
    ], a = i && (i.pretty || i.voidElements || i.sortAttributes || i.shallow || i.allAttributes || i.xml || i.attributeHook) ? m(n, o, i) : F(n, o, !1, void 0, s), __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__c && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__c(n, k), __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__s = l, k.length = 0, a;
}
function w(e) {
    return null == e || "boolean" == typeof e ? null : "string" == typeof e || "number" == typeof e || "bigint" == typeof e ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["h"])(null, null, e) : e;
}
function C(e, t) {
    return "className" === e ? "class" : "htmlFor" === e ? "for" : "defaultValue" === e ? "value" : "defaultChecked" === e ? "checked" : "defaultSelected" === e ? "selected" : t && l.test(e) ? e.toLowerCase().replace(/^xlink:?/, "xlink:") : e;
}
function O(e, t) {
    return "style" === e && null != t && "object" == typeof t ? p(t) : "a" === e[0] && "r" === e[1] && "boolean" == typeof t ? String(t) : t;
}
var j = Array.isArray, A = Object.assign;
function F(r, n, l, a, f) {
    if (null == r || !0 === r || !1 === r || "" === r) return "";
    if ("object" != typeof r) return "function" == typeof r ? "" : s(r);
    if (j(r)) {
        var u = "";
        f.__k = r;
        for(var c = 0; c < r.length; c++)u += F(r[c], n, l, a, f), r[c] = w(r[c]);
        return u;
    }
    if (void 0 !== r.constructor) return "";
    r.__ = f, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__b && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__b(r);
    var _ = r.type, p = r.props;
    if ("function" == typeof _) {
        var d;
        if (_ === __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]) d = p.children;
        else {
            d = _.prototype && "function" == typeof _.prototype.render ? function(e, r) {
                var n = e.type, o = g(n, r), i = new n(e.props, o);
                e.__c = i, i.__v = e, i.__d = !0, i.props = e.props, null == i.state && (i.state = {}), null == i.__s && (i.__s = i.state), i.context = o, n.getDerivedStateFromProps ? i.state = A({}, i.state, n.getDerivedStateFromProps(i.props, i.state)) : i.componentWillMount && (i.componentWillMount(), i.state = i.__s !== i.state ? i.__s : i.state);
                var l = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__r;
                return l && l(e), i.render(i.props, i.state, i.context);
            }(r, n) : function(e, r) {
                var n, o = h(e, r), i = g(e.type, r);
                e.__c = o;
                for(var l = __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].__r, a = 0; o.__d && a++ < 25;)o.__d = !1, l && l(e), n = e.type.call(o, e.props, i);
                return n;
            }(r, n);
            var v = r.__c;
            v.getChildContext && (n = A({}, n, v.getChildContext()));
        }
        var y = F(d = null != d && d.type === __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"] && null == d.key ? d.props.children : d, n, l, a, r);
        return __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].diffed && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].diffed(r), r.__ = void 0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].unmount && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].unmount(r), y;
    }
    var m, b, x = "<";
    if (x += _, p) for(var k in m = p.children, p){
        var S = p[k];
        if (!("key" === k || "ref" === k || "__self" === k || "__source" === k || "children" === k || "className" === k && "class" in p || "htmlFor" === k && "for" in p || i.test(k))) {
            if (S = O(k = C(k, l), S), "dangerouslySetInnerHTML" === k) b = S && S.__html;
            else if ("textarea" === _ && "value" === k) m = S;
            else if ((S || 0 === S || "" === S) && "function" != typeof S) {
                if (!0 === S || "" === S) {
                    S = k, x = x + " " + k;
                    continue;
                }
                if ("value" === k) {
                    if ("select" === _) {
                        a = S;
                        continue;
                    }
                    "option" !== _ || a != S || "selected" in p || (x += " selected");
                }
                x = x + " " + k + '="' + s(S) + '"';
            }
        }
    }
    var H = x;
    if (x += ">", i.test(_)) throw new Error(_ + " is not a valid HTML tag name in " + x);
    var M = "", L = !1;
    if (b) M += b, L = !0;
    else if ("string" == typeof m) M += s(m), L = !0;
    else if (j(m)) {
        r.__k = m;
        for(var T = 0; T < m.length; T++){
            var E = m[T];
            if (m[T] = w(E), null != E && !1 !== E) {
                var $ = F(E, n, "svg" === _ || "foreignObject" !== _ && l, a, r);
                $ && (M += $, L = !0);
            }
        }
    } else if (null != m && !1 !== m && !0 !== m) {
        r.__k = [
            w(m)
        ];
        var D = F(m, n, "svg" === _ || "foreignObject" !== _ && l, a, r);
        D && (M += D, L = !0);
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].diffed && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].diffed(r), r.__ = void 0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].unmount && __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$preact$2f$dist$2f$preact$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["options"].unmount(r), L) x += M;
    else if (o.test(_)) return H + " />";
    return x + "</" + _ + ">";
}
S.shallowRender = x;
const __TURBOPACK__default__export__ = S;
;
 //# sourceMappingURL=index.module.js.map
}),
"[project]/IT4409/Instagram-lite/node_modules/@babel/runtime/helpers/extends.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

function _extends() {
    return module.exports = _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", module.exports.__esModule = true, module.exports["default"] = module.exports, _extends.apply(null, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
}),
"[project]/IT4409/Instagram-lite/node_modules/next-auth/node_modules/cookie/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ /**
 * Module exports.
 * @public
 */ exports.parse = parse;
exports.serialize = serialize;
/**
 * Module variables.
 * @private
 */ var __toString = Object.prototype.toString;
var __hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
 * which has been replaced by the token definition in RFC 7230 appendix B.
 *
 * cookie-name       = token
 * token             = 1*tchar
 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
 *                     "*" / "+" / "-" / "." / "^" / "_" /
 *                     "`" / "|" / "~" / DIGIT / ALPHA
 */ var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
/**
 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
 *
 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
 *                     ; US-ASCII characters excluding CTLs,
 *                     ; whitespace DQUOTE, comma, semicolon,
 *                     ; and backslash
 */ var cookieValueRegExp = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;
/**
 * RegExp to match domain-value in RFC 6265 sec 4.1.1
 *
 * domain-value      = <subdomain>
 *                     ; defined in [RFC1034], Section 3.5, as
 *                     ; enhanced by [RFC1123], Section 2.1
 * <subdomain>       = <label> | <subdomain> "." <label>
 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
 *                     Labels must be 63 characters or less.
 *                     'let-dig' not 'letter' in the first char, per RFC1123
 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
 * <let-dig-hyp>     = <let-dig> | "-"
 * <let-dig>         = <letter> | <digit>
 * <letter>          = any one of the 52 alphabetic characters A through Z in
 *                     upper case and a through z in lower case
 * <digit>           = any one of the ten digits 0 through 9
 *
 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
 *
 * > (Note that a leading %x2E ("."), if present, is ignored even though that
 * character is not permitted, but a trailing %x2E ("."), if present, will
 * cause the user agent to ignore the attribute.)
 */ var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/**
 * RegExp to match path-value in RFC 6265 sec 4.1.1
 *
 * path-value        = <any CHAR except CTLs or ";">
 * CHAR              = %x01-7F
 *                     ; defined in RFC 5234 appendix B.1
 */ var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [opt]
 * @return {object}
 * @public
 */ function parse(str, opt) {
    if (typeof str !== 'string') {
        throw new TypeError('argument str must be a string');
    }
    var obj = {};
    var len = str.length;
    // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
    if (len < 2) return obj;
    var dec = opt && opt.decode || decode;
    var index = 0;
    var eqIdx = 0;
    var endIdx = 0;
    do {
        eqIdx = str.indexOf('=', index);
        if (eqIdx === -1) break; // No more cookie pairs.
        endIdx = str.indexOf(';', index);
        if (endIdx === -1) {
            endIdx = len;
        } else if (eqIdx > endIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(';', eqIdx - 1) + 1;
            continue;
        }
        var keyStartIdx = startIndex(str, index, eqIdx);
        var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        var key = str.slice(keyStartIdx, keyEndIdx);
        // only assign once
        if (!__hasOwnProperty.call(obj, key)) {
            var valStartIdx = startIndex(str, eqIdx + 1, endIdx);
            var valEndIdx = endIndex(str, endIdx, valStartIdx);
            if (str.charCodeAt(valStartIdx) === 0x22 /* " */  && str.charCodeAt(valEndIdx - 1) === 0x22 /* " */ ) {
                valStartIdx++;
                valEndIdx--;
            }
            var val = str.slice(valStartIdx, valEndIdx);
            obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
    }while (index < len)
    return obj;
}
function startIndex(str, index, max) {
    do {
        var code = str.charCodeAt(index);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) return index;
    }while (++index < max)
    return max;
}
function endIndex(str, index, min) {
    while(index > min){
        var code = str.charCodeAt(--index);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) return index + 1;
    }
    return min;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize a name value pair into a cookie string suitable for
 * http headers. An optional options object specifies cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [opt]
 * @return {string}
 * @public
 */ function serialize(name, val, opt) {
    var enc = opt && opt.encode || encodeURIComponent;
    if (typeof enc !== 'function') {
        throw new TypeError('option encode is invalid');
    }
    if (!cookieNameRegExp.test(name)) {
        throw new TypeError('argument name is invalid');
    }
    var value = enc(val);
    if (!cookieValueRegExp.test(value)) {
        throw new TypeError('argument val is invalid');
    }
    var str = name + '=' + value;
    if (!opt) return str;
    if (null != opt.maxAge) {
        var maxAge = Math.floor(opt.maxAge);
        if (!isFinite(maxAge)) {
            throw new TypeError('option maxAge is invalid');
        }
        str += '; Max-Age=' + maxAge;
    }
    if (opt.domain) {
        if (!domainValueRegExp.test(opt.domain)) {
            throw new TypeError('option domain is invalid');
        }
        str += '; Domain=' + opt.domain;
    }
    if (opt.path) {
        if (!pathValueRegExp.test(opt.path)) {
            throw new TypeError('option path is invalid');
        }
        str += '; Path=' + opt.path;
    }
    if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
            throw new TypeError('option expires is invalid');
        }
        str += '; Expires=' + expires.toUTCString();
    }
    if (opt.httpOnly) {
        str += '; HttpOnly';
    }
    if (opt.secure) {
        str += '; Secure';
    }
    if (opt.partitioned) {
        str += '; Partitioned';
    }
    if (opt.priority) {
        var priority = typeof opt.priority === 'string' ? opt.priority.toLowerCase() : opt.priority;
        switch(priority){
            case 'low':
                str += '; Priority=Low';
                break;
            case 'medium':
                str += '; Priority=Medium';
                break;
            case 'high':
                str += '; Priority=High';
                break;
            default:
                throw new TypeError('option priority is invalid');
        }
    }
    if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch(sameSite){
            case true:
                str += '; SameSite=Strict';
                break;
            case 'lax':
                str += '; SameSite=Lax';
                break;
            case 'strict':
                str += '; SameSite=Strict';
                break;
            case 'none':
                str += '; SameSite=None';
                break;
            default:
                throw new TypeError('option sameSite is invalid');
        }
    }
    return str;
}
/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */ function decode(str) {
    return str.indexOf('%') !== -1 ? decodeURIComponent(str) : str;
}
/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */ function isDate(val) {
    return __toString.call(val) === '[object Date]';
}
/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */ function tryDecode(str, decode) {
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
}
}),
"[project]/IT4409/Instagram-lite/node_modules/@auth/prisma-adapter/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  Official <a href="https://www.prisma.io/docs">Prisma</a> adapter for Auth.js / NextAuth.js.
 *  <a href="https://www.prisma.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/prisma.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @prisma/client @auth/prisma-adapter
 * npm install prisma --save-dev
 * ```
 *
 * @module @auth/prisma-adapter
 */ __turbopack_context__.s([
    "PrismaAdapter",
    ()=>PrismaAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f40$prisma$2f$client$2f$index$2d$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/@prisma/client/index-browser.js [app-client] (ecmascript)");
;
function PrismaAdapter(prisma) {
    const p = prisma;
    return {
        // We need to let Prisma generate the ID because our default UUID is incompatible with MongoDB
        createUser: (param)=>{
            let { id, ...data } = param;
            return p.user.create(stripUndefined(data));
        },
        getUser: (id)=>p.user.findUnique({
                where: {
                    id
                }
            }),
        getUserByEmail: (email)=>p.user.findUnique({
                where: {
                    email
                }
            }),
        async getUserByAccount (provider_providerAccountId) {
            const account = await p.account.findUnique({
                where: {
                    provider_providerAccountId
                },
                include: {
                    user: true
                }
            });
            var _account_user;
            return (_account_user = account === null || account === void 0 ? void 0 : account.user) !== null && _account_user !== void 0 ? _account_user : null;
        },
        updateUser: (param)=>{
            let { id, ...data } = param;
            return p.user.update({
                where: {
                    id
                },
                ...stripUndefined(data)
            });
        },
        deleteUser: (id)=>p.user.delete({
                where: {
                    id
                }
            }),
        linkAccount: (data)=>p.account.create({
                data
            }),
        unlinkAccount: (provider_providerAccountId)=>p.account.delete({
                where: {
                    provider_providerAccountId
                }
            }),
        async getSessionAndUser (sessionToken) {
            const userAndSession = await p.session.findUnique({
                where: {
                    sessionToken
                },
                include: {
                    user: true
                }
            });
            if (!userAndSession) return null;
            const { user, ...session } = userAndSession;
            return {
                user,
                session
            };
        },
        createSession: (data)=>p.session.create(stripUndefined(data)),
        updateSession: (data)=>p.session.update({
                where: {
                    sessionToken: data.sessionToken
                },
                ...stripUndefined(data)
            }),
        deleteSession: (sessionToken)=>p.session.delete({
                where: {
                    sessionToken
                }
            }),
        async createVerificationToken (data) {
            const verificationToken = await p.verificationToken.create(stripUndefined(data));
            if ("id" in verificationToken && verificationToken.id) delete verificationToken.id;
            return verificationToken;
        },
        async useVerificationToken (identifier_token) {
            try {
                const verificationToken = await p.verificationToken.delete({
                    where: {
                        identifier_token
                    }
                });
                if ("id" in verificationToken && verificationToken.id) delete verificationToken.id;
                return verificationToken;
            } catch (error) {
                // If token already used/deleted, just return null
                // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
                if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f40$prisma$2f$client$2f$index$2d$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Prisma"].PrismaClientKnownRequestError && error.code === "P2025") return null;
                throw error;
            }
        },
        async getAccount (providerAccountId, provider) {
            return p.account.findFirst({
                where: {
                    providerAccountId,
                    provider
                }
            });
        },
        async createAuthenticator (data) {
            return p.authenticator.create(stripUndefined(data));
        },
        async getAuthenticator (credentialID) {
            return p.authenticator.findUnique({
                where: {
                    credentialID
                }
            });
        },
        async listAuthenticatorsByUserId (userId) {
            return p.authenticator.findMany({
                where: {
                    userId
                }
            });
        },
        async updateAuthenticatorCounter (credentialID, counter) {
            return p.authenticator.update({
                where: {
                    credentialID
                },
                data: {
                    counter
                }
            });
        }
    };
}
/** @see https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined */ function stripUndefined(obj) {
    const data = {};
    for(const key in obj)if (obj[key] !== undefined) data[key] = obj[key];
    return {
        data
    };
}
}),
]);

//# sourceMappingURL=c015d_787b8228._.js.map