import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppContext from '../../Context/AppContext'; // Adjust path if needed
import { toast } from 'react-toastify';

const AdminAddProduct = () => {
  const { adminAddProduct } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State for the "Add Product" form - ensuring it uses 'qty'
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    qty: '', // Use 'qty' to match backend model
    category: '',
    imgSrc: '',
  });

  // Handle input changes
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    // Handle number inputs specifically for price and qty
    const processedValue = (name === 'price' || name === 'qty') ? (value === '' ? '' : Number(value)) : value;
    setNewProduct(prev => ({ ...prev, [name]: processedValue }));
  };

  // Handle form submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    // Basic validation - ensure all required fields (including qty and imgSrc) are filled
    if (!newProduct.title || newProduct.price === '' || newProduct.qty === '' || !newProduct.imgSrc) {
      return toast.warn('Please fill in Title, Price, Quantity (Qty), and Image URL.');
    }
    // Validate numbers are non-negative
    if (isNaN(newProduct.price) || isNaN(newProduct.qty) || newProduct.price < 0 || newProduct.qty < 0) {
      return toast.warn('Price and Quantity (Qty) must be valid non-negative numbers.');
    }
    // Simple URL validation for imgSrc
    try {
      new URL(newProduct.imgSrc); // Check if it's a valid URL structure
    } catch (_) {
      return toast.warn('Please enter a valid Image URL (e.g., https://...).');
    }

    setLoading(true);
    // console.log("[AdminAddProduct] Attempting to add product with data:", newProduct); // Log data being sent
    try {
      // Pass the newProduct state (which includes qty)
      const data = await adminAddProduct(newProduct);
    //   console.log("[AdminAddProduct] Response from adminAddProduct:", data); // Log response

      if (data.success) {
        toast.success(data.message || 'Product added successfully!');
        navigate('/admin/products'); // Navigate back after successful addition
      } else {
        // Error toast is handled within AppState, but log here for debugging
         console.error("Add product failed (in component):", data.message);
         // No need to show another toast here if AppState already did
      }
    } catch (error) {
       // Catch unexpected errors during the context call itself
      console.error("[AdminAddProduct] Error during handleAddProduct:", error);
      toast.error('An unexpected error occurred while adding the product.');
    } finally {
      setLoading(false);
    }
  };

  // --- Reusable Admin Navigation Component ---
  const AdminNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
      <nav className="nav nav-pills nav-fill mb-4 bg-light p-2 rounded">
        <Link className={`nav-link ${currentPath === '/admin/orders' ? 'active' : 'text-dark'}`} to="/admin/orders">Manage Orders</Link>
        <Link className={`nav-link ${currentPath.startsWith('/admin/products') ? 'active' : 'text-dark'}`} to="/admin/products">Manage Products</Link>
        <Link className={`nav-link ${currentPath === '/admin/users' ? 'active' : 'text-dark'}`} to="/admin/users">Manage Users</Link>
      </nav>
    );
  };

  return (
    <div className="container my-4" style={{ maxWidth: '900px' }}>
      <AdminNav />
      <h1 className="h3 mb-4">Add New Product</h1>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleAddProduct}>
            <div className="row g-3">
              {/* Title */}
              <div className="col-12">
                <label htmlFor="title" className="form-label">Title*</label>
                <input type="text" className="form-control" id="title" name="title" value={newProduct.title} onChange={handleNewProductChange} required />
              </div>

              {/* Price & Qty */}
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Price*</label>
                <input type="number" step="0.01" min="0" className="form-control" id="price" name="price" value={newProduct.price} onChange={handleNewProductChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="qty" className="form-label">Quantity (Qty)*</label> {/* Use qty */}
                <input type="number" min="0" className="form-control" id="qty" name="qty" value={newProduct.qty} onChange={handleNewProductChange} required /> {/* Use qty */}
              </div>

              {/* Description */}
              <div className="col-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name="description" value={newProduct.description} onChange={handleNewProductChange} rows="3"></textarea>
              </div>

              {/* Category & Image URL */}
              <div className="col-md-6">
                <label htmlFor="category" className="form-label">Category</label>
                <input type="text" className="form-control" id="category" name="category" value={newProduct.category} onChange={handleNewProductChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="imgSrc" className="form-label">Image URL*</label> {/* Made required */}
                <input type="url" className="form-control" id="imgSrc" name="imgSrc" value={newProduct.imgSrc} onChange={handleNewProductChange} placeholder="https://example.com/image.jpg" required /> {/* Made required, type="url" */}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
              <Link to="/admin/products" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
