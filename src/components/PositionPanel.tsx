import type { CalculatorInputs, FieldErrors } from '../lib/calculator';
import { formatSize } from '../lib/format';
import { DEFAULT_LEVERAGE, INSTRUMENTS, type Instrument } from '../lib/instruments';
import type { Side } from '../lib/sizing';
import { NumberField } from './NumberField';
import { Segmented } from './Segmented';

const INSTRUMENT_OPTIONS = INSTRUMENTS.map((instrument) => ({ value: instrument.id, label: instrument.id }));
const SIDE_OPTIONS: { value: Side; label: string }[] = [
  { value: 'long', label: 'Long' },
  { value: 'short', label: 'Short' },
];

interface PositionPanelProps {
  inputs: CalculatorInputs;
  instrument: Instrument;
  errors: FieldErrors;
  onChange: (patch: Partial<CalculatorInputs>) => void;
}

export function PositionPanel({ inputs, instrument, errors, onChange }: PositionPanelProps) {
  const lot = `${formatSize(instrument.lotStep, instrument.sizeDecimals)} ${instrument.base}`;
  const min = `${formatSize(instrument.minSize, instrument.sizeDecimals)} ${instrument.base}`;

  return (
    <section className="panel" aria-labelledby="position-title">
      <header className="panel__head">
        <h2 id="position-title">Position</h2>
      </header>

      <Segmented
        name="instrument"
        legend="Instrument"
        options={INSTRUMENT_OPTIONS}
        value={inputs.instrumentId}
        onChange={(instrumentId) => onChange({ instrumentId })}
      />
      <dl className="specs">
        <div>
          <dt>Lot step</dt>
          <dd>{lot}</dd>
        </div>
        <div>
          <dt>Minimum</dt>
          <dd>{min}</dd>
        </div>
        <div>
          <dt>Max leverage</dt>
          <dd>{instrument.maxLeverage}x</dd>
        </div>
      </dl>

      <Segmented name="side" legend="Side" options={SIDE_OPTIONS} value={inputs.side} onChange={(side) => onChange({ side })} />

      <div className="field-row field-row--3">
        <NumberField
          id="entry"
          label="Entry price"
          prefix="$"
          value={inputs.entry}
          error={errors.entry}
          onChange={(entry) => onChange({ entry })}
        />
        <NumberField
          id="stop"
          label="Stop loss"
          prefix="$"
          value={inputs.stop}
          error={errors.stop}
          hint={inputs.side === 'long' ? 'Below entry for a long' : 'Above entry for a short'}
          onChange={(stop) => onChange({ stop })}
        />
        <NumberField
          id="leverage"
          label="Leverage"
          suffix="x"
          value={inputs.leverage}
          error={errors.leverage}
          hint={`Default ${DEFAULT_LEVERAGE}x`}
          onChange={(leverage) => onChange({ leverage })}
        />
      </div>
    </section>
  );
}
