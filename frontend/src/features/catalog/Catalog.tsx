const items = [
  { id: '1', title: 'Товар A', price: '1 200 ₽' },
  { id: '2', title: 'Товар B', price: '2 400 ₽' },
  { id: '3', title: 'Товар C', price: '3 600 ₽' },
]

export function Catalog() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
        >
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.price}</p>
        </li>
      ))}
    </ul>
  )
}
