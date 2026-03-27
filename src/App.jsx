import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collections from './pages/Collections';
import SubCategory from './pages/SubCategory';
import ProductDetails from './pages/ProductDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import { CartProvider } from './context/CartContext';
import LeadPopup from './components/LeadPopup';

function App() {
  return (
    <Router>
      <CartProvider>
        <LeadPopup />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:categoryId" element={<Collections />} />
          <Route path="/category/:categoryId/:subCategoryId" element={<SubCategory />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
