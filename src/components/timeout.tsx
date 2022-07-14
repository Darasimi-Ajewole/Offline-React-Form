import { useState } from "react";
import React from "react";

type TimeoutProps = {
  period: number;
  loader: JSX.Element | null;
  children: JSX.Element[];
};
const Timeout = ({ period, loader, children }: TimeoutProps) => {
  const [loading, setloading] = useState(true);
  setTimeout(() => setloading(false), period);

  return <>{loading ? loader : children}</>;
};

Timeout.defaultProps = {
  loader: null,
};

export default Timeout;
