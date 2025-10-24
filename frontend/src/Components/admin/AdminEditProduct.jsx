import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import AppContext from '../../Context/AppContext'; // Adjust path if needed
import { toast } from 'react-toastify';
import axios from 'axios'; // Import axios for fetching the single product

const AdminEditProduct = () => {
  const { adminUpdateProduct } = useContext(AppContext);
  const navigate = useNavigate();
  const { id: productId } = useParams(); // Get product ID from URL parameter
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // State for initial fetch

  // Use VITE_URL from context or define it if not available
  const url = import.meta.env.VITE_URL || ''; // Ensure URL is defined

  // State for the product being edited
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '', // Use 'stock' to match backend
    category: '',
    imgSrc: '',
  });

  // Fetch product data when the component mounts or ID changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        toast.error("No product ID provided.");
        setFetching(false);
        return;
      }
      setFetching(true);
      try {
        // We need a direct axios call here as AppState doesn't have getProductById
        // Assuming your backend has a route like /api/product/:id
        const api = await axios.get(`${url}/product/${productId}`, {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        });

        if (api.data?.product) {
          const product = api.data.product;
          // Pre-fill the form state with fetched data
          setEditFormData({
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '', // Use stock
            category: product.category || '',
            imgSrc: product.imgSrc || '',
          });
        } else {
          toast.error("Failed to fetch product details.");
          navigate('/admin/products'); // Redirect if product not found
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error(error.response?.data?.message || "Error fetching product.");
        navigate('/admin/products'); // Redirect on error
      } finally {
        setFetching(false);
      }
    };

    fetchProductDetails();
  }, [productId, navigate, url]); // Depend on productId, navigate, and url

  // Handle input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    // Handle number inputs specifically
    const processedValue = (name === 'price' || name === 'stock') ? (value === '' ? '' : Number(value)) : value;
    setEditFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  // Handle form submission (saving changes)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!editFormData.title || editFormData.price === '' || editFormData.stock === '') {
      return toast.warn('Please fill in Title, Price, and Stock.');
    }
    if (isNaN(editFormData.price) || isNaN(editFormData.stock) || editFormData.price < 0 || editFormData.stock < 0) {
      return toast.warn('Price and Stock must be valid non-negative numbers.');
    }

    setLoading(true);
    try {
      const data = await adminUpdateProduct(productId, editFormData);
      if (data.success) {
        toast.success(data.message || 'Product updated successfully!');
        // Navigate back to the product list page after successful update
        navigate('/admin/products');
      } else {
        toast.error(data.message || 'Failed to update product.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the product.');
    } finally {
      setLoading(false);
    }
  };

  // --- Reusable Admin Navigation Component ---
  const AdminNav = () => {
    const location = useLocation();
    const currentPath = location.pathname; // includes '/admin/products/edit/:id'

    return (
      <nav className="nav nav-pills nav-fill mb-4 bg-light p-2 rounded">
        <Link
          className={`nav-link ${currentPath === '/admin/orders' ? 'active' : 'text-dark'}`}
          to="/admin/orders"
        >
          Manage Orders
        </Link>
        {/* Highlight "Manage Products" when on add or edit page */}
        <Link
          className={`nav-link ${currentPath.startsWith('/admin/products') ? 'active' : 'text-dark'}`}
          to="/admin/products"
        >
          Manage Products
        </Link>
        <Link
          className={`nav-link ${currentPath === '/admin/users' ? 'active' : 'text-dark'}`}
          to="/admin/users"
        >
          Manage Users
        </Link>
      </nav>
    );
  };

  // Show loading spinner while fetching initial data
  if (fetching) {
    return (
      <div className="container my-4 text-center">
        <AdminNav />
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading product data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: '900px' }}>
      <AdminNav />
      <h1 className="h3 mb-4">Edit Product: {editFormData.title || 'Loading...'}</h1>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSaveEdit}>
            <div className="row g-3">
              {/* Title */}
              <div className="col-12">
                <label htmlFor="editTitle" className="form-label">Title*</label>
                <input type="text" className="form-control" id="editTitle" name="title" value={editFormData.title} onChange={handleEditFormChange} required />
              </div>

              {/* Price & Stock */}
              <div className="col-md-6">
                <label htmlFor="editPrice" className="form-label">Price*</label>
                <input type="number" step="0.01" min="0" className="form-control" id="editPrice" name="price" value={editFormData.price} onChange={handleEditFormChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="editStock" className="form-label">Stock*</label>
                <input type="number" min="0" className="form-control" id="editStock" name="stock" value={editFormData.stock} onChange={handleEditFormChange} required />
              </div>

              {/* Description */}
              <div className="col-12">
                <label htmlFor="editDescription" className="form-label">Description</label>
                <textarea className="form-control" id="editDescription" name="description" value={editFormData.description} onChange={handleEditFormChange} rows="3"></textarea>
              </div>

              {/* Category & Image URL */}
              <div className="col-md-6">
                <label htmlFor="editCategory" className="form-label">Category</label>
                <input type="text" className="form-control" id="editCategory" name="category" value={editFormData.category} onChange={handleEditFormChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="editImgSrc" className="form-label">Image URL</label>
                <input type="text" className="form-control" id="editImgSrc" name="imgSrc" value={editFormData.imgSrc} onChange={handleEditFormChange} placeholder="https://example.com/image.jpg" />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2" disabled={loading || fetching}>
                {loading ? 'Saving...' : 'Save Changes'}
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

export default AdminEditProduct;
