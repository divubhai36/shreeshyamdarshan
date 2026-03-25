import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collections from './pages/Collections';
import SubCategory from './pages/SubCategory';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:categoryId" element={<Collections />} />
          <Route path="/category/:categoryId/:subCategoryId" element={<SubCategory />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
