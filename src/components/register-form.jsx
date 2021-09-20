import Input from './input';
import Radio from './radio';

const Form = () => (
  <form className="row register-form">
    <div className="col-md-6">
      <Input placeholder="First Name *" type="text" />
      <Input placeholder="Last Name *" type="text" />
      <div className="form-group">
        <div className="maxl">
          <Radio label="Male" name="gender" value="male" />
          <Radio label="Female" name="gender" value="female" />
          <Radio label="Prefer not to say" name="gender" value="Prefer not to say" checked={true} />
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <Input placeholder="Your Email *" type="email" />
      <Input placeholder="Your Phone *" type="text" />
      <input type="submit" className="btnRegister" defaultValue="Register" />
    </div>
  </form>
)

export default Form