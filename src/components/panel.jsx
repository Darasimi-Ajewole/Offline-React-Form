const Panel = ({ children }) => (
  <div className="col-md-9 register-right">
    <div className="tab-content" id="myTabContent">
      <div className="fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <h3 className="register-heading"> Simple Offline Form</h3>
        {children}
      </div>
    </div>
  </div>
)

export default Panel