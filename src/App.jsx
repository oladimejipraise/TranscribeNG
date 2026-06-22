import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TranscriptProvider } from "./context/TranscriptContext";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <TranscriptProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </TranscriptProvider>
    </AuthProvider>
  );
}