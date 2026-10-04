export default function PageContainer({
  title,
  description,
  action,
  children,
  className = "",
}) {
  return (
    <main
      className={`page-enter mx-auto max-w-7xl px-4 py-7 pb-28 md:px-8 md:py-9 lg:ml-64 lg:pb-10 ${className}`}
    >
      {(title || action) && (
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-muted md:text-base">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </main>
  )
}
