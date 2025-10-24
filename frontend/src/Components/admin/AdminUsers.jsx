import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppContext from '../../Context/AppContext'; // Adjust path if needed
import { toast } from 'react-toastify';

const AdminUsers = () => {
  // Get functions from AppState
  const { getAllUsers, adminUpdateUserRole } = useContext(AppContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Call the context function
      const data = await getAllUsers();
      // Correctly check if the response has the 'users' array
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // Handle cases where data is missing or malformed, or if success was false
        toast.error(data.message || 'Failed to fetch users');
        setUsers([]); // Set to empty array on failure
      }
    } catch (error) {
      // Catch errors during the API call itself
      toast.error('An error occurred while fetching users.');
      setUsers([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []); // Runs once on load

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Call the context function
      const data = await adminUpdateUserRole(userId, newRole);
      // --- CORRECTED CHECK: Check if data.user exists ---
      if (data && data.user) {
        toast.success(`User role updated successfully!`);
        // Update the user in our local state to refresh the UI instantly
        setUsers(prevUsers =>
          prevUsers.map(user =>
            // Use the updated user object returned from the backend
            user._id === userId ? data.user : user
          )
        );
      } else {
        // Handle cases where success might be false or data.user is missing
        toast.error(data.message || 'Failed to update user role.');
      }
    } catch (error) {
      // Catch errors during the API call itself
      toast.error('An error occurred while updating the user role.');
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

  // Helper to get a Bootstrap color for the role
  const getRoleBadgeClass = (role) => {
    return role === 'admin' ? 'bg-success' : 'bg-secondary';
  };

  return (
    <div className="container my-4" style={{ maxWidth: '1200px' }}>
      <AdminNav />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">User Management</h1>
         <button onClick={fetchUsers} className="btn btn-sm btn-outline-primary" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Users'}
        </button>
      </div>


      {/* --- Users Table --- */}
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
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col" style={{ minWidth: '150px' }}>Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id}>
                        <td><strong>{user.username}</strong></td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            // Disable changing the role for the currently logged-in admin maybe?
                            // disabled={loggedInUser?._id === user._id} // Example - requires getting loggedInUser from context
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No users found.</td>
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

export default AdminUsers;

