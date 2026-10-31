import { useEffect, useRef, type ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** A modal confirmation built on <dialog>: focus is trapped and Esc cancels. */
export function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-body"
      onClose={onCancel}
      // A click on the backdrop lands on the <dialog> element itself.
      onClick={(event) => event.target === event.currentTarget && onCancel()}
    >
      <div className="dialog__panel">
        <h2 id="confirm-title" className="dialog__title">
          {title}
        </h2>
        <div id="confirm-body" className="dialog__body">
          {children}
        </div>
        <div className="dialog__actions">
          {/* Cancel comes first so it receives focus when the dialog opens. */}
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
