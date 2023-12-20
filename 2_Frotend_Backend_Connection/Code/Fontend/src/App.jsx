import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("http://localhost:3000/api/user");
      setUsers(response.data);
    })();
  }, []);

  return (
    <>
      <h1>Frontend Backend Connection</h1>
      <h2>No of Users : {users.length}</h2>

      <table>
        <th>User Id</th>
        <th>User Name</th>
        <th>User Email</th>

        {users.map((user, index) => {
          return (
            <tbody key={index}>
              <td> {user.id}</td>
              <td> {user.name}</td>
              <td> {user.email}-</td>
            </tbody>
          );
        })}
      </table>
    </>
  );
}

export default App;
