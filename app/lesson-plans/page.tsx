import { fetchLessonPlans } from "@/lib/nps";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson Plans | NPS Explorer",
  description: "Educational lesson plans from the National Park Service",
};

export default async function LessonPlansPage() {
  const plans = await fetchLessonPlans();

  return (
    <main className="min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Lesson Plans</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{plans.length} educational resources</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <a
              key={plan.id}
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-xl bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-accent-dim)] transition-colors group"
            >
              <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                {plan.title}
              </h3>
              {plan.questionobjective && (
                <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2">
                  {plan.questionobjective}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {plan.subject && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {plan.subject}
                  </span>
                )}
                {plan.gradelevel && (
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                    {plan.gradelevel}
                  </span>
                )}
                {plan.duration && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {plan.duration}
                  </span>
                )}
              </div>
            </a>
          ))}
          {plans.length === 0 && (
            <p className="text-center py-12 text-[var(--color-text-muted)] col-span-full">No lesson plans found</p>
          )}
        </div>
      </div>
    </main>
  );
}
