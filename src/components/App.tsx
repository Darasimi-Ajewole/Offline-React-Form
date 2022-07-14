import React from "react";

import AccountForm from "./account-form";
import NotificationPanel from "./notification";
import Timeout from "./timeout";
import "../styles/style.scss";

function App() {
  return (
    <Timeout period={500}>
      <NotificationPanel />
      <AccountForm />
    </Timeout>
  );
}

export default App;
