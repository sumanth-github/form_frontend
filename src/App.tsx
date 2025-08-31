import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductSubmissionForm } from "./components/ProductSubmissionForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Product Submission as default route */}
        <Route path="/" element={<ProductSubmissionForm />} />
      </Routes>
    </Router>
  );
}

export default App;
