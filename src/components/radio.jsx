const Input = ({ label, value, name, checked }) => (
  <>
    <label className="radio inline">
      <input type="radio" name={name} value={value} defaultChecked={checked} />
      <span> {label} </span>
    </label> {' '}
  </>
)

export default Input