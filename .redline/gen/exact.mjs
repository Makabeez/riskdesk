// Exact decimal arithmetic for the RiskDesk oracle (PRD section 5).
// Every value is a BigInt fraction, so the expected outputs never inherit
// the floating-point errors the generator is trying to catch in the app.

const abs = (x) => (x < 0n ? -x : x);
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };

export class Frac {
  constructor(n, d = 1n) {
    if (d === 0n) throw new Error('division by zero');
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d) || 1n;
    this.n = n / g; this.d = d / g;
  }
  static of(s) {
    s = String(s).trim();
    const neg = s.startsWith('-');
    if (neg) s = s.slice(1);
    const [i, f = ''] = s.split('.');
    const n = BigInt(i + f) * (neg ? -1n : 1n);
    return new Frac(n, 10n ** BigInt(f.length));
  }
  add(o) { return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Frac(this.n * o.n, this.d * o.d); }
  div(o) { return new Frac(this.n * o.d, this.d * o.n); }
  abs() { return new Frac(abs(this.n), this.d); }
  cmp(o) { const l = this.n * o.d, r = o.n * this.d; return l < r ? -1 : l > r ? 1 : 0; }
  floor() { const q = this.n / this.d; return this.n < 0n && q * this.d !== this.n ? q - 1n : q; }
  // exact decimal string if the value terminates within `dp` places, else null
  toFixedExact(dp) {
    const scaled = this.mul(new Frac(10n ** BigInt(dp)));
    if (scaled.d !== 1n) return null;
    return fmt(scaled.n, dp);
  }
  // half-up rounding to dp places
  toFixedHalfUp(dp) {
    const scaled = this.mul(new Frac(10n ** BigInt(dp)));
    const neg = scaled.n < 0n;
    const a = new Frac(abs(scaled.n), scaled.d);
    const q = a.add(new Frac(1n, 2n)).floor();
    return fmt(neg ? -q : q, dp);
  }
  toNumber() { return Number(this.n) / Number(this.d); }
}

function fmt(n, dp) {
  const neg = n < 0n; let s = abs(n).toString().padStart(dp + 1, '0');
  const out = dp ? `${s.slice(0, -dp)}.${s.slice(-dp)}` : s;
  return (neg ? '-' : '') + out;
}

// "$1,234.56" / "−$149.40" per PRD money format (U+2212 minus sign)
export function money(str) {
  const neg = str.startsWith('-');
  const [i, f] = (neg ? str.slice(1) : str).split('.');
  const body = '$' + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + f;
  return neg ? '−' + body : body;
}

export const INSTRUMENTS = {
  'BTC-PERP': { lot: '0.001', dp: 3, maxLev: 50, unit: 'BTC' },
  'ETH-PERP': { lot: '0.01', dp: 2, maxLev: 50, unit: 'ETH' },
  'SOL-PERP': { lot: '0.1', dp: 1, maxLev: 20, unit: 'SOL' },
};

// PRD section 5, exactly.
export function size({ balance, risk, instrument, side, entry, stop }) {
  const ins = INSTRUMENTS[instrument];
  const B = Frac.of(balance), R = Frac.of(risk), E = Frac.of(entry), S = Frac.of(stop);
  const lot = Frac.of(ins.lot);
  const budget = B.mul(R).div(new Frac(100n));
  const wrongSide = side === 'Long' ? S.cmp(E) >= 0 : S.cmp(E) <= 0;
  if (wrongSide) return { budget, wrongSide: true };
  const perUnit = E.sub(S).abs();
  const lots = budget.div(perUnit).div(lot).floor();
  const sz = new Frac(lots).mul(lot);
  const actual = sz.mul(perUnit);
  return {
    budget, perUnit, lots, size: sz, actual,
    belowMin: lots < 1n,
    sizeStr: sz.toFixedExact(ins.dp),
    unit: ins.unit,
  };
}

// What a naive float implementation shows: Math.floor(budget / dist / lot) * lot
export function naiveFloatLots({ balance, risk, instrument, entry, stop }) {
  const lot = Number(INSTRUMENTS[instrument].lot);
  const budget = (Number(balance) * Number(risk)) / 100;
  return Math.floor(budget / Math.abs(Number(entry) - Number(stop)) / lot);
}
// What a "round to nearest lot" implementation shows
export function nearestLots({ balance, risk, instrument, entry, stop }) {
  const ins = INSTRUMENTS[instrument];
  const budget = Frac.of(balance).mul(Frac.of(risk)).div(new Frac(100n));
  const raw = budget.div(Frac.of(entry).sub(Frac.of(stop)).abs()).div(Frac.of(ins.lot));
  return raw.add(new Frac(1n, 2n)).floor();
}
