import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId="72596852849-flej8bf0mhl4427pfdgephp3rvcl758n.apps.googleusercontent.com"
createRoot(document.getElementById("root")).render(

    <BrowserRouter>
      <AppContextProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
        </GoogleOAuthProvider>
      </AppContextProvider>
    </BrowserRouter>

);
