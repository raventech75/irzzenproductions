import { clsx } from "clsx";

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx("rounded-2xl border border-soft/70 bg-white/70 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-white/60", className)}>
      {children}
    </div>
  );
}

export function Button({ as: As = "button", className, ...props }: any) {
  return (
    <As
      className={clsx(
        "btn px-5 py-2 rounded-xl font-medium shadow-soft",
        "bg-[hsl(var(--p))] text-white hover:brightness-[.95]",
        className
      )}
      {...props}
    />
  );
}

export function SecondaryButton(props: any) {
  return <Button {...props} className={clsx("bg-[hsl(var(--a))] text-ink hover:brightness-105", props.className)} />;
}

export function Money({ value }: { value: number }) {
  return <span>{value.toLocaleString("fr-FR")} €</span>;
}

export function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { id: 1, label: "Formule" },
    { id: 2, label: "Questionnaire" },
    { id: 3, label: "Paiement & Merci" }
  ];
  return (
    <div className="flex items-center gap-3 select-none">
      {items.map((it, i) => (
        <div key={it.id} className="flex items-center gap-3">
          <div className={clsx(
            "w-8 h-8 rounded-full grid place-items-center text-sm font-semibold",
            it.id <= step ? "bg-[hsl(var(--p))] text-white" : "bg-soft text-ink/60"
          )}>{it.id}</div>
          <span className={clsx("text-sm", it.id <= step ? "opacity-100" : "opacity-60")}>{it.label}</span>
          {i < items.length - 1 && <div className="w-8 h-[2px] bg-soft" />}
        </div>
      ))}
    </div>
  );
}