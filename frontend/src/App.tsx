import React, { useEffect } from "react";
import axios from "axios";

const App: React.FC = () => {

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/health")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>NagaraIQ Civic Intelligence Dashboard</h1>
      <p>Connecting to backend...</p>
    </div>
  );
};

export default App;
