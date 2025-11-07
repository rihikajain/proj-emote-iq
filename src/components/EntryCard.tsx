"use client";

export default function EntryCard({ mood, note, tags, createdAt }: any) {
  return (
    <div className="rounded-xl p-4 border border-[var(--color-secondary-1)] bg-[var(--color-bg)] hover:border-[var(--color-secondary-3)] transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-[var(--color-primary)]">
          {mood || "No mood"}
        </h3>
        <span className="text-xs text-[var(--color-secondary-2)]">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-[var(--color-text)] mb-2">{note || "No notes added"}</p>
      <div className="flex flex-wrap gap-2">
        {tags?.length > 0 &&
          tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-full bg-[var(--color-secondary-1)] text-[var(--color-bg)]"
            >
              #{tag}
            </span>
          ))}
      </div>
    </div>
  );
}
