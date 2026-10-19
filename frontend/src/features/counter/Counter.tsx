import { useState } from 'react'
import { Button } from '@/common/ui/button'

export function Counter() {
  const [count, setCount] = useState(0)

  return <Button onClick={() => setCount((value) => value + 1)}>Count is {count}</Button>
}
