import React from 'react';
import '../styles/App.css';
import RegisterForm from './register-form';
import Animation from './animation';
import Panel from './panel';

function App() {
  return (
    <div className="container register">
      <div className="row">
        <Animation />
        <Panel>
          <RegisterForm />
        </Panel>
      </div>
    </div>
  );
}

export default App;
