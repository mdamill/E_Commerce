import React, { useState, useEffect, useContext, useMemo } from 'react'; // Added useMemo
import { Link, useLocation } from 'react-router-dom';
import AppContext from '../../Context/AppContext'; // Adjust path if needed (e.g., ../../Context/AppContext)
import { toast } from 'react-toastify';

const AdminOrders = () => {
  // Get functions from our AppState
  const { getAllOrders, updateOrderStatus } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'Pending'

  // Define your valid statuses from your backend model
  const ORDER_STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders(); // Call context function

      // Check if data exists AND if the 'orders' array is present
      if (data && data.orders) {
        setOrders(data.orders);
      } else {
         // Error logging removed
      }
    } catch (error) { // Catch potential errors if getAllOrders itself throws
       // Error logging removed
       toast.error('An unexpected error occurred while fetching orders.'); // Keep user-facing toast
    } finally {
      setLoading(false);
    }
  };


  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []); // Runs once on load

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    // Log removed
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      // Log removed

      // Check if the response data includes the 'order' object,
      // which indicates success from your backend.
      if (data && data.order) {
        toast.success(`Order status updated!`);
        // Log removed
        // Update the order in our local state to refresh the UI instantly
        setOrders(prevOrders =>
          prevOrders.map(order =>
            // Use the updated order data returned from the backend
            order._id === orderId ? data.order : order
          )
        );
      } else {
        // Error logging removed
        // Toast for specific error messages is handled in AppState
        // If data might be null/undefined from AppState catch block:
        if (!data?.message) {
            toast.error("Failed to update order status."); // Keep user-facing toast
        }
      }
    } catch (error) {
      // Error logging removed
       toast.error("An unexpected error occurred while updating status."); // Keep user-facing toast
      // More detailed error toast is likely handled in AppState's catch block
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
          className={`nav-link ${currentPath === '/admin/products' ? 'active' : 'text-dark'}`}
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

  // --- Filter Logic ---
  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  }, [orders, filter]);

  // Helper to get a Bootstrap color for the status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Shipped': return 'bg-info text-dark';
      case 'Delivered': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: '1200px' }}>
      <AdminNav />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Order Management</h1>
        <button onClick={fetchOrders} className="btn btn-sm btn-outline-primary" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* --- Filter Buttons --- */}
      <div className="mb-3">
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'} me-2`}
          onClick={() => setFilter('all')}
        >
          All Orders ({orders ? orders.length : 0})
        </button>
        <button
          className={`btn btn-sm ${filter === 'Pending' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('Pending')}
        >
          Pending ({orders ? orders.filter(o => o.status === 'Pending').length : 0})
        </button>
      </div>

      {/* --- Orders Table --- */}
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Items</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Status</th>
                    <th scope="col" style={{ minWidth: '150px' }}>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <tr key={order._id}>
                        {/* Shortened Order ID */}
                        <th scope="row" title={order._id}>
                          ...{order._id.slice(-6)}
                        </th>

                        {/* Date */}
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>

                        {/* Customer Info - populated from backend */}
                        <td>
                          <div>{order.userId?.username || '(No Username)'}</div>
                          <small className="text-muted">{order.userId?.email || '(No Email)'}</small>
                        </td>

                        {/* Simple item summary */}
                        <td>{order.items.length} item(s)</td>

                        <td><strong>${order.totalPrice.toFixed(2)}</strong></td>

                        {/* Status Badge */}
                        <td>
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>

                        {/* Status Update Dropdown */}
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            {ORDER_STATUSES.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">No {filter === 'Pending' ? 'pending' : ''} orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

