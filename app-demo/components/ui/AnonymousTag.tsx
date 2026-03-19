export default function AnonymousTag({ id }: { id: string }) {
  return (
    <span className="inline-flex items-center font-mono text-xs bg-fondo-suave text-texto-secundario px-1.5 py-0.5 rounded">
      {id}
    </span>
  )
}
