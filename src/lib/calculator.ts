import { getInstrument, type Instrument, type InstrumentId } from './instruments';
import { riskAmountOf, sizePosition, stopSideError, type Side, type Sizing } from './sizing';
import { validateBalance, validateFee, validateLeverage, validatePrice, validateRisk } from './validation';
import type { Ratio } from './decimal';

/** Raw text of the account fields, exactly as typed. */
export interface AccountInputs {
  balance: string;
  risk: string;
  fee: string;
}

export interface CalculatorInputs {
  instrumentId: InstrumentId;
  side: Side;
  entry: string;
  stop: string;
  leverage: string;
}

export type FieldName = 'balance' | 'risk' | 'fee' | 'entry' | 'stop' | 'leverage';
export type FieldErrors = Partial<Record<FieldName, string>>;

export type CalculatorResult =
  /** Entry or stop loss not entered yet, and nothing else is wrong. */
  | { kind: 'incomplete' }
  /** At least one field has an error: no result is shown. */
  | { kind: 'invalid' }
  | { kind: 'sized'; sizing: Sizing; entry: Ratio; stop: Ratio; leverage: Ratio; feePct: Ratio };

export interface Evaluation {
  instrument: Instrument;
  errors: FieldErrors;
  /** Balance × risk %, whenever both are valid. */
  riskAmount: Ratio | null;
  result: CalculatorResult;
}

export function evaluate(account: AccountInputs, inputs: CalculatorInputs): Evaluation {
  const instrument = getInstrument(inputs.instrumentId)!;
  const errors: FieldErrors = {};

  const balance = validateBalance(account.balance);
  if (!balance.ok) errors.balance = balance.error;
  const risk = validateRisk(account.risk);
  if (!risk.ok) errors.risk = risk.error;
  const fee = validateFee(account.fee);
  if (!fee.ok) errors.fee = fee.error;
  const leverage = validateLeverage(inputs.leverage, instrument);
  if (!leverage.ok) errors.leverage = leverage.error;

  // An empty price is "not entered yet" rather than an error.
  const entry = inputs.entry.trim() ? validatePrice(inputs.entry, 'Entry price') : null;
  if (entry && !entry.ok) errors.entry = entry.error;
  const stop = inputs.stop.trim() ? validatePrice(inputs.stop, 'Stop loss') : null;
  if (stop && !stop.ok) errors.stop = stop.error;
  if (entry?.ok && stop?.ok) {
    const sideError = stopSideError(inputs.side, entry.value, stop.value);
    if (sideError) errors.stop = sideError;
  }

  const riskAmount = balance.ok && risk.ok ? riskAmountOf(balance.value, risk.value) : null;
  const base = { instrument, errors, riskAmount };

  if (Object.keys(errors).length > 0) return { ...base, result: { kind: 'invalid' } };
  if (!entry?.ok || !stop?.ok || !balance.ok || !risk.ok || !fee.ok || !leverage.ok) {
    return { ...base, result: { kind: 'incomplete' } };
  }

  const sizing = sizePosition({
    instrument,
    balance: balance.value,
    riskPct: risk.value,
    entry: entry.value,
    stop: stop.value,
    leverage: leverage.value,
    feePct: fee.value,
  });
  return {
    ...base,
    result: {
      kind: 'sized',
      sizing,
      entry: entry.value,
      stop: stop.value,
      leverage: leverage.value,
      feePct: fee.value,
    },
  };
}
