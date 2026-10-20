import styles from './Catalog.module.scss'

const items = [
  { id: '1', title: 'Товар A', price: '1 200 ₽' },
  { id: '2', title: 'Товар B', price: '2 400 ₽' },
  { id: '3', title: 'Товар C', price: '3 600 ₽' },
]

export function Catalog() {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.card}>
          <p className={styles.title}>{item.title}</p>
          <p className={styles.price}>{item.price}</p>
        </li>
      ))}
    </ul>
  )
}
