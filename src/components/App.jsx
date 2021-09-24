import '../styles/App.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
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
