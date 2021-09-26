import '../styles/App.css';
import RegisterForm from './register-form';
import Animation from './animation';
import Panel from './panel';
import NotificationPanel from './notification';

function App() {
  return (
    <div className="container register">
      <div className="row">
        <Animation />
        <Panel>
          <NotificationPanel />
          <RegisterForm />
        </Panel>
      </div>
    </div>
  );
}

export default App;
