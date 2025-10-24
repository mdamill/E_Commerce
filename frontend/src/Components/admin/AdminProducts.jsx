import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import AppContext from '../../Context/AppContext'; // Adjust path
import { toast } from 'react-toastify';
// Removed react-bootstrap imports if they were there

const AdminProducts = () => {
  // Get functions and products from AppState
  // We only need allProducts and adminDeleteProduct here now
  const { products: allProducts, adminAddProduct, adminUpdateProduct, adminDeleteProduct } = useContext(AppContext);
  const navigate = useNavigate(); // Hook for navigation

  // Local state for this component
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Tracks API call status (only for delete now)

  // State for Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Update local products state whenever the context's products change
  useEffect(() => {
    // console.log("[AdminProducts] useEffect updating local products from context:", allProducts); // Log context products
    // Ensure we are working with an array
    setProducts(Array.isArray(allProducts) ? allProducts : []);
  }, [allProducts]);


  // --- Delete Product Logic ---
  const handleDeleteClick = (product) => {
    // console.log("[AdminProducts] handleDeleteClick triggered for:", product); // Log product to delete
    setProductToDelete(product); // Set which product to potentially delete
    setShowDeleteModal(true); // Show confirmation modal
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null); // Clear which product was targeted
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return; // Should not happen, but safety check
    // console.log("[AdminProducts] handleConfirmDelete - Deleting product ID:", productToDelete._id); // Log ID being deleted

    setLoading(true);
    try {
      // Call the delete function from context
    //   console.log("[AdminProducts] handleConfirmDelete - Calling adminDeleteProduct..."); // Log before call
      const data = await adminDeleteProduct(productToDelete._id);
    //   console.log("[AdminProducts] handleConfirmDelete - Response from adminDeleteProduct:", data); // Log response

      // Check specific message based on AppState return
      if (data.message === "Product deleted successfully") {
        toast.success('Product deleted successfully!');
        // No need to close modal here, finally block handles it
        // The product list will update automatically via setReload in AppState
      } else {
        // Handle cases where the backend returns success=false or a different message
        toast.error(data.message || 'Failed to delete product.');
      }
    } catch (error) {
       console.error("[AdminProducts] handleConfirmDelete - Error:", error); // Log error
       // Catch unexpected errors during the call itself
       toast.error('An error occurred while deleting the product.');
    } finally {
      setLoading(false);
      // Ensure modal is closed regardless of success/failure after action
      handleCloseDeleteModal();
    }
  };

  // --- Reusable Admin Navigation Component ---
  const AdminNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
      <nav className="nav nav-pills nav-fill mb-4 bg-light p-2 rounded">
        <Link
          className={`nav-link ${currentPath === '/admin/orders' ? 'active' : 'text-dark'}`}
          to="/admin/orders"
        >
          Manage Orders
        </Link>
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

  return (
    <div className="container my-4" style={{ maxWidth: '1200px' }}>
      <AdminNav />

      <div className="d-flex justify-content-between align-items-center mb-4">
         <h1 className="h3 mb-0">Product Management</h1>
         {/* Button to navigate to the Add Product page */}
         <Link to="/admin/products/add" className="btn btn-primary">
            Add New Product
         </Link>
      </div>


      {/* --- Products Table --- */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{width: '80px'}}>Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Ensure mapping only happens if products is an array */}
                {Array.isArray(products) && products.length > 0 ? (
                  products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img
                           src={product.imgSrc || 'https://placehold.co/60x60/eee/ccc?text=No+Img'}
                           alt={product.title}
                           width="60"
                           height="60"
                           className="img-thumbnail"
                           onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/60x60/eee/ccc?text=Error'; }}
                         />
                      </td>
                      <td>{product.title}</td>
                      <td>{product.category || '-'}</td>
                      <td>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                      <td>{product.stock !== undefined ? product.stock : '-'}</td>
                      <td className="text-center">
                        {/* Link to the Edit Product page */}
                        <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                            aria-label={`Edit ${product.title}`}
                         >
                           Edit
                         </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(product)}
                          disabled={loading}
                          aria-label={`Delete ${product.title}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">No products found. Add one!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Delete Confirmation Modal (Custom HTML/Bootstrap) --- */}
      {showDeleteModal && (
         <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete the product: <strong>{productToDelete?.title}</strong>?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;

