export function ConfirmDialog({
  open, message, onYes, onNo,
}: { open: boolean; message: string; onYes: () => void; onNo: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-soft">
        <p className="font-display text-lg">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onNo}>No</button>
          <button className="btn-danger" onClick={onYes}>Yes</button>
        </div>
      </div>
    </div>
  );
}
