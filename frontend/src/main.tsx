import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AccountProvider } from "./contexts/AccountContext.tsx";
import { TransferProvider } from "./contexts/TranferContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AccountProvider>
          <TransferProvider>
            <App />
          </TransferProvider>
        </AccountProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
