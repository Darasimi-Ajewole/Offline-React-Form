import React from "react";
import { useState } from "react";
import classNames from "classnames";

type InputProps = {
  value?: string;
  name: string;
  type: string;
  placeholder: string;
  onChange: (name: string, value: string) => void;
};
const Input = ({ value, name, type, placeholder, onChange }: InputProps) => {
  const [active, setActive] = useState(false);
  const toggleActive = (mode: boolean) => setActive(mode);

  return (
    <div className={classNames("form-holder", { active })}>
      <input
        type={type}
        className="form-control"
        value={value || ""}
        placeholder={placeholder}
        name={name}
        onChange={(e) => onChange(name, e.target.value)}
        onFocus={() => toggleActive(true)}
        onBlur={() => toggleActive(false)}
        required={true}
      />
    </div>
  );
};

export default React.memo(Input);
