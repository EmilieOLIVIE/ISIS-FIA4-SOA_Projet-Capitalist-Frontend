//Imports from external sources
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useMutation, useQuery } from "@apollo/client";

//Import css
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/master.css";
import "./App.css";

//Import components
import Main from "./components/Main";

//Import utils
import { GET_WORLD, RESET_WORLD } from "./services";
import { toastError } from "./Util";

function App() {
  const generateUsername = () => {
    let username = "Coco l'asticot" + Math.floor(Math.random() * 10000);
    localStorage.setItem("username", username);
    return username
  }

  const [username, setUsername] = useState(localStorage.getItem("username") ?? generateUsername())

  const { loading, error, data, refetch } = useQuery(GET_WORLD, {
    variables: { username },
    context: { headers: { "x-user": username } },
  })

  const [resetWorld] = useMutation(RESET_WORLD,
    {
      context: { headers: { "x-user": username } },
      onError: (error) => toastError(error.message),
      onCompleted: (data) => refetchWorld() //Reload world on reset
    }
  )

  useEffect(() => {
    refetchWorld()
  }, [username])

  const refetchWorld = () => {
    localStorage.setItem("username", username);
    refetch()
  }

  const onUsernameChanged = (event: any) => {
    setUsername(event.target.value)
  }

  let corps = undefined
  if (loading) corps = <div> Loading... </div>
  else if (error) corps = <div> Erreur de chargement du monde ! </div>
  else corps = <Main
    key={username}
    loadedWorld={data.getWorld}
    username={username}
    onUsernameChanged={onUsernameChanged}
    onResetWorld={resetWorld}
  />

  return (
    <div className="App">
      <ToastContainer theme="dark" />
      {corps}
    </div>
  );
}


export default App;

/*
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
*/