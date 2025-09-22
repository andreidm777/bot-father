import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProductsList } from "./pages/ProductsList";
import { ProductDetail } from "./pages/ProductDetail";
import { BotList } from "./pages/BotList";
import { LoginPage } from "./pages/LoginPage";
import { authStore } from "./stores/authStore";

const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {authStore.isAuthenticated ? (
          <>
            <Route path="/" element={<ProductsList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/product/:productId/bots" element={<BotList />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
});

export default App;