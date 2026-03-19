export default function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-8">
      <h1 className="text-[32px] font-bold text-brand-azul">{title}</h1>
      {description && (
        <p className="text-texto-secundario text-[15px] mt-1">{description}</p>
      )}
    </div>
  )
}
