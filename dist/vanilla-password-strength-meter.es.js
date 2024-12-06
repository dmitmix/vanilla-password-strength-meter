/**
 * Password Strength Meter on pure JavaScript with password confirmation check
 * 
 * Original author:
 * @author Òscar Casajuana
 * @link https://github.com/elboletaire/password-strength-meter
 * @license GPL-3.0
 * 
 * Rewritten and extended on modern JavaScript without using jQuery:
 * Added password confirmation check.
 * @author Dmitriy Mikholazhin
 * @email me@dmitmix.ru
 * @link 
 * @license GPL-3.0
 */
class E {
  constructor(t, i = null, e = {}) {
    const s = {
      enterPass: "Enter password",
      shortPass: "Password is too short",
      containsField: "Password contains your username",
      invalidChars: "Password contains invalid characters",
      passwordsMatch: "Passwords match",
      passwordsNotMatch: "Passwords do not match",
      steps: {
        13: "Very weak password",
        33: "Weak; try mixing letters and numbers",
        67: "Medium; try using special characters",
        94: "Strong password"
      },
      showPercent: !1,
      showText: !0,
      animate: !0,
      animateSpeed: "fast",
      field: null,
      fieldPartialMatch: !0,
      minimumLength: 4,
      closestSelector: "div",
      useColorBarImage: !1,
      customColorBarRGB: {
        red: [0, 240],
        green: [0, 240],
        blue: 10
      }
    };
    this.options = { ...s, ...e }, this.inputElement = t, this.confirmElement = i, this.passwordsMatch = null, this.init();
  }
  scoreText(t) {
    if (t === -1)
      return this.options.shortPass;
    if (t === -2)
      return this.options.containsField;
    if (t === -3)
      return this.options.invalidChars;
    let i = this.options.shortPass;
    const e = Object.keys(this.options.steps).map(Number).sort((s, n) => s - n);
    for (const s of e)
      t >= s && (i = this.options.steps[s]);
    return i;
  }
  calculateScore(t, i) {
    let e = 0;
    if (t.length < this.options.minimumLength)
      return -1;
    if (/[^A-Za-z0-9!@#$%^&*?_~]/.test(t))
      return -3;
    if (this.options.field) {
      if (t.toLowerCase() === i.toLowerCase())
        return -2;
      if (this.options.fieldPartialMatch && i.length) {
        const a = new RegExp(i.toLowerCase());
        if (t.toLowerCase().match(a))
          return -2;
      }
    }
    e += t.length * 4, e += this.checkRepetition(1, t).length - t.length, e += this.checkRepetition(2, t).length - t.length, e += this.checkRepetition(3, t).length - t.length, e += this.checkRepetition(4, t).length - t.length, t.match(/(.*[0-9].*[0-9].*[0-9])/) && (e += 5);
    const s = ".*[!,@,#,$,%,^,&,*,?,_,~]", n = new RegExp("(" + s + s + ")");
    return t.match(n) && (e += 5), t.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && (e += 10), t.match(/([a-zA-Z])/) && t.match(/([0-9])/) && (e += 15), t.match(/([!@#$%^&*?_~])/) && t.match(/([0-9])/) && (e += 15), t.match(/([!@#$%^&*?_~])/) && t.match(/([a-zA-Z])/) && (e += 15), (t.match(/^\w+$/) || t.match(/^\d+$/)) && (e -= 10), e > 100 && (e = 100), e < 0 && (e = 0), e;
  }
  checkRepetition(t, i) {
    let e = "", s;
    for (let n = 0; n < i.length; n++) {
      s = !0;
      let a = 0;
      for (; a < t && a + n + t < i.length; a++)
        s = s && i.charAt(a + n) === i.charAt(a + n + t);
      a < t && (s = !1), s ? (n += t - 1, s = !1) : e += i.charAt(n);
    }
    return e;
  }
  calculateColorFromPercentage(t) {
    let { red: [i, e], green: [s, n], blue: a } = this.options.customColorBarRGB;
    const l = t * n / 50, o = 2 * e - t * e / 50;
    return {
      red: Math.min(Math.max(o, i), e),
      green: Math.min(Math.max(l, s), n),
      blue: a
    };
  }
  addColorBarStyle(t, i) {
    if (this.options.useColorBarImage)
      t.style.backgroundPosition = `0px -${i}px`, t.style.width = `${i}%`;
    else {
      const e = this.calculateColorFromPercentage(i);
      t.style.backgroundImage = "none", t.style.backgroundColor = `rgb(${e.red}, ${e.green}, ${e.blue})`, t.style.width = `${i}%`;
    }
  }
  init() {
    let t = !0;
    const { showText: i, showPercent: e, animate: s, animateSpeed: n, closestSelector: a } = this.options;
    this.confirmTextElement = null;
    const l = document.createElement("div");
    l.classList.add("pass-graybar");
    const o = document.createElement("div");
    o.classList.add("pass-colorbar"), l.appendChild(o);
    const r = document.createElement("div");
    r.classList.add("pass-wrapper"), r.appendChild(l);
    let h;
    e && (h = document.createElement("span"), h.classList.add("pass-percent"), h.textContent = "0%", r.appendChild(h));
    let m;
    i && (m = document.createElement("span"), m.classList.add("pass-text"), m.innerHTML = this.options.enterPass, r.appendChild(m));
    const d = this.inputElement.closest(a);
    if (d && (d.classList.add("pass-strength-visible"), d.appendChild(r), s && (r.style.display = "none", t = !1, d.classList.remove("pass-strength-visible"))), this.inputElement.addEventListener("keyup", () => {
      this.updateStrength(o, h, m), this.checkPasswordMatch(this.confirmTextElement);
    }), s && (this.inputElement.addEventListener("focus", () => {
      !t && r.style.display === "none" && (r.style.display = "", t = !0, d.classList.add("pass-strength-visible"));
    }), this.inputElement.addEventListener("blur", () => {
      !this.inputElement.value.length && t && (r.style.display = "none", t = !1, d.classList.remove("pass-strength-visible"));
    })), this.confirmElement) {
      let u = !0;
      const c = document.createElement("div");
      c.classList.add("pass-confirm-wrapper"), this.confirmTextElement = document.createElement("span"), this.confirmTextElement.classList.add("pass-confirm-text"), this.confirmTextElement.innerHTML = "", c.appendChild(this.confirmTextElement);
      const p = this.confirmElement.closest(a);
      if (p && (p.classList.add("pass-confirm-visible"), p.appendChild(c), s && (c.style.display = "none", u = !1, p.classList.remove("pass-confirm-visible"))), this.confirmElement) {
        const g = () => {
          this.updateStrength(o, h, m);
        };
        this.inputElement.addEventListener("keyup", g), this.confirmElement.addEventListener("keyup", g);
      }
      s && (this.confirmElement.addEventListener("focus", () => {
        !u && c.style.display === "none" && (c.style.display = "", u = !0, p.classList.add("pass-confirm-visible"));
      }), this.confirmElement.addEventListener("blur", () => {
        !this.confirmElement.value.length && u && (c.style.display = "none", u = !1, p.classList.remove("pass-confirm-visible"));
      }));
    }
  }
  updateStrength(t, i, e) {
    let s = "";
    if (this.options.field) {
      const o = document.querySelector(this.options.field);
      o && (s = o.value);
    }
    const n = this.calculateScore(this.inputElement.value, s), a = n < 0 ? 0 : n;
    if (this.addColorBarStyle(t, a), this.options.showPercent && i && (i.textContent = `${a}%`), this.options.showText && e) {
      let o = this.scoreText(n);
      !this.inputElement.value.length && n <= 0 && (o = this.options.enterPass), e.innerHTML !== o && (e.innerHTML = o);
    }
    this.confirmElement && this.checkPasswordMatch(this.confirmTextElement);
    const l = new CustomEvent("password.score", {
      detail: {
        score: n,
        percentage: a,
        passwordsMatch: this.passwordsMatch
      }
    });
    this.inputElement.dispatchEvent(l);
  }
  checkPasswordMatch(t = null) {
    if (!this.confirmElement)
      return;
    const i = this.inputElement.value, e = this.confirmElement.value;
    let s = "";
    e.length > 0 ? i === e ? (s = this.options.passwordsMatch, this.passwordsMatch = !0, t && (t.classList.remove("pass-not-match"), t.classList.add("pass-match"))) : (s = this.options.passwordsNotMatch, this.passwordsMatch = !1, t && (t.classList.remove("pass-match"), t.classList.add("pass-not-match"))) : (s = "", this.passwordsMatch = null, t && t.classList.remove("pass-match", "pass-not-match")), t && (t.textContent = s);
  }
}
function v(f, t = null, i) {
  const e = document.querySelectorAll(f), s = t ? document.querySelectorAll(t) : null;
  e.forEach((n, a) => {
    const l = s ? s[a] : null;
    new E(n, l, i);
  });
}
export {
  E as PasswordStrengthMeter,
  v as initPasswordStrengthMeter
};