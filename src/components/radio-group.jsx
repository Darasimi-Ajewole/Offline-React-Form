import Radio from './radio';
import React from "react"

const Group = ({ options, selected, name, onChange }) => {

  return (
    <div className="form-group">
      <div className="maxl">
        {
          options.map((item) =>
            <Radio key={item.value}
              value={item.value}
              label={item.label}
              name={name}
              checked={item.value === selected}
              onChange={onChange}
            />)
        }
      </div>
    </div>
  )
}

export default React.memo(Group)