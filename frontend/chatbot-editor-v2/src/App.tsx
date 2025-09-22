import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProductsList } from "./pages/ProductsList";
import { ProductDetail } from "./pages/ProductDetail";

const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
});

export default App;