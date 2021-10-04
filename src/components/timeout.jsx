import { useState } from "react"

const Timeout = ({ period, loader, children }) => {
  const [loading, setloading] = useState(true)
  setTimeout(() => setloading(false), period)

  return loading ? loader : children
}

Timeout.defaultProps = {
  loader: null
}

export default Timeout