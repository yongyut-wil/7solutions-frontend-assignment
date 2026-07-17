import type { DepartmentSummary } from '@/lib/getGroupedUsers';

interface DepartmentCardProps {
  name: string;
  summary: DepartmentSummary;
}

export function DepartmentCard({ name, summary }: DepartmentCardProps) {
  const hairColors = Object.entries(summary.hair);
  const addressUsers = Object.entries(summary.addressUser);

  return (
    <section
      aria-label={name}
      className="flex min-h-[18rem] flex-col rounded-3xl border border-stone-200/70 bg-card/90 p-5 shadow-sm"
    >
      <h2 className="text-xl font-bold tracking-tight text-ink">{name}</h2>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-fruit-soft p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-fruit">Male</dt>
          <dd className="mt-1 text-3xl font-bold text-ink">{summary.male}</dd>
        </div>
        <div className="rounded-2xl bg-vegetable-soft p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-vegetable">Female</dt>
          <dd className="mt-1 text-3xl font-bold text-ink">{summary.female}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-2xl bg-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Age range</p>
        <p className="mt-1 text-lg font-bold text-ink">{summary.ageRange}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Hair colors</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {hairColors.map(([color, count]) => (
            <span
              key={color}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-ink"
            >
              {color}
              <span className="rounded-full bg-stone-200 px-1.5 py-0.5 text-[10px] text-stone-600">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Address users
        </p>
        <ul className="mt-2 space-y-1 text-sm text-stone-600">
          {addressUsers.slice(0, 5).map(([fullName, postalCode]) => (
            <li key={fullName} className="flex justify-between">
              <span className="font-medium text-ink">{fullName}</span>
              <span className="font-mono text-xs text-stone-400">{postalCode}</span>
            </li>
          ))}
        </ul>
        {addressUsers.length > 5 && (
          <details className="mt-1">
            <summary className="cursor-pointer list-none text-xs font-medium text-stone-400 outline-none transition hover:text-ink [&::-webkit-details-marker]:hidden">
              +{addressUsers.length - 5} more
            </summary>
            <ul className="mt-2 space-y-1 text-sm text-stone-600">
              {addressUsers.slice(5).map(([fullName, postalCode]) => (
                <li key={fullName} className="flex justify-between">
                  <span className="font-medium text-ink">{fullName}</span>
                  <span className="font-mono text-xs text-stone-400">{postalCode}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
