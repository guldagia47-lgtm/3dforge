import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "@/auth/AuthProvider";
import { I18nProvider } from "@/i18n/context";
import { installMockGenerateModelEndpoint } from "@/lib/mockGenerateModelEndpoint";

installMockGenerateModelEndpoint();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  </StrictMode>
);
