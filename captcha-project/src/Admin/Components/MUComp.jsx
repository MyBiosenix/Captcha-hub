import React, { useEffect, useState } from 'react';
import '../../Citizen/CSSFiles/payment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MUComp() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const token = localStorage.getItem('token');
  const admin = JSON.parse(localStorage.getItem('admin'));
  const role = admin?.role

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5035/api/auth/user/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Users');
    }
  };

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5035/api/auth/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        console.error(err.message);
        alert('Error Deleting User');
      }
    }
  };

  const handleActivate = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5035/api/auth/user/${id}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err.message);
      alert('Error Activating User');
    }
  };

  const handleDeactivate = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5035/api/auth/user/${id}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err.message);
      alert('Error Deactivating User');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Filter users by searchTerm
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className='mypayments'>
      <div className='payment-header'>
        <h2>Manage User</h2>
        <p className='breadcrumb'>Dashboard / All User List</p>
      </div>

      <div className='inmy-payments'>

        <div className='buttontxt'>
          <h3>All User Type</h3>
          {role === 'superadmin' && (
            <button className='request-btn' onClick={() => navigate('/admin/manage-user/add-user')}>+ Add User</button>
          )}
        </div>

        <div className='printform'>
          <div className='inprint'>
            <p>Copy</p>
            <p>Excel</p>
            <p>PDF</p>
            <p>Print</p>
          </div>
          <div className='search'>
            <input 
              type='text' 
              placeholder='Search by name or email' 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }} 
            />
          </div>
        </div>

        <div className='table-container'>
          <table className='payment-table'>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>User Type</th>
                <th>Email Id</th>
                <th>Password</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((u, index) => (
                  <tr key={u._id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{u.name}</td>
                    <td><span className='user-type-badge'>Citizen</span></td>
                    <td>{u.email}</td>
                    <td>{u.password}</td>
                    <td>
                      {u.isActive ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
                      ) : (
                        <span style={{ color: "red", fontWeight: "bold" }}>Inactive</span>
                      )}
                    </td>
                    <td className='mybttnns'>
                      {role === 'superadmin' && (
                        <>
                          <button className='edit-btn' onClick={() => navigate('/admin/manage-user/add-user',{state : {userToEdit:u}})}>Edit</button>

                      
                          <button className='delete-btn' onClick={() => handleDeleteUser(u._id)}>Delete</button>
                        </>
                      )}
                      
                      {u.isActive ? (
                        <button className='deactivate-btn' onClick={() => handleDeactivate(u._id)}>Deactivate</button>
                      ) : (
                        <button className='activate-btn' onClick={() => handleActivate(u._id)}>Activate</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🔹 Pagination Controls */}
          <div className='pagination'>
            <button onClick={() => goToPage(1)} disabled={currentPage === 1}>{'«'}</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>{'‹'}</button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>{'›'}</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>{'»'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MUComp;