import { clsx } from "clsx";

export function Container({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("max-w-6xl mx-auto px-6", className)}>{children}</div>;
}

export function Section({ title, subtitle, children, className }: React.PropsWithChildren<{ title?: string; subtitle?: string; className?: string }>) {
  return (
    <section className={clsx("space-y-6", className)}>
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h2 className="font-serif text-3xl md:text-4xl leading-tight">{title}</h2>}
          {subtitle && <p className="opacity-70">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-soft/70 bg-white/70 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({ as: As = "button", className, ...props }: any) {
  return (
    <As
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2 font-medium transition",
        "bg-[hsl(var(--p))] text-white shadow-soft hover:brightness-95 active:brightness-90",
        className
      )}
      {...props}
    />
  );
}

export function GhostButton({ as: As = "button", className, ...props }: any) {
  return (
    <As
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2 font-medium transition",
        "bg-white/70 text-ink border border-soft/70 hover:bg-white",
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
          <div
            className={clsx(
              "w-9 h-9 rounded-full grid place-items-center text-sm font-semibold shadow-soft",
              it.id <= step ? "bg-[hsl(var(--p))] text-white" : "bg-soft text-ink/60"
            )}
          >
            {it.id}
          </div>
          <span className={clsx("text-sm", it.id <= step ? "opacity-100" : "opacity-60")}>{it.label}</span>
          {i < items.length - 1 && <div className="w-10 h-[2px] bg-soft" />}
        </div>
      ))}
    </div>
  );
}