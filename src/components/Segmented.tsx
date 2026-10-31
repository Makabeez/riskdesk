interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  name: string;
  legend: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A radio group styled as a segmented control; arrow keys move between options. */
export function Segmented<T extends string>({ name, legend, options, value, onChange }: SegmentedProps<T>) {
  return (
    <fieldset className="segmented">
      <legend className="field__label">{legend}</legend>
      <div className="segmented__track">
        {options.map((option) => (
          <label
            key={option.value}
            className={`segmented__option${option.value === value ? ' is-selected' : ''}`}
            data-value={option.value}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
