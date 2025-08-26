import React, { useEffect, useState } from 'react';
import '../../Citizen/CSSFiles/payment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AUserComp() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchActiveUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5035/api/auth/user/active-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Users');
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  return (
    <div className='mypayments'>
      <div className='payment-header'>
        <h2>Manage User</h2>
        <p className='breadcrumb'>Dashboard / Active Users List</p>
      </div>

      <div className='inmy-payments'>
        <div className='buttontxt'>
          <h3>Active Users</h3>
        </div>

        <div className='printform'>
          <div className='inprint'>
            <p>Copy</p>
            <p>Excel</p>
            <p>PDF</p>
            <p>Print</p>
          </div>
          <div className='search'>
            <input type='text' placeholder='Search' />
          </div>
        </div>

        <div className='table-container'>
          <table className='payment-table'>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Email Id</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, index) => (
                  <tr key={u._id}>
                    <td>{index + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      {u.isActive ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
                      ) : (
                        <span style={{ color: "red", fontWeight: "bold" }}>Inactive</span>
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
          <div className='pagination'>
            <button>{'«'}</button>
            <button>{'‹'}</button>
            <button>{'›'}</button>
            <button>{'»'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AUserComp;
