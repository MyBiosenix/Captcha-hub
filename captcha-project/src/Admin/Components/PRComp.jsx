import React, { useState, useEffect } from 'react';
import '../../Citizen/CSSFiles/payment.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PRComp() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5035/api/auth/user/all-reqs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Payments');
    }
  };

  const handleDeletePayment = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this Payment Request?')) {
      try {
        await axios.delete(`http://localhost:5035/api/auth/user/pay/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPayments();
      } catch (err) {
        console.error(err.message);
        alert('Error Deleting Payment Request');
      }
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className='mypayments'>
      <div className='payment-header'>
        <h2>Payment Request</h2>
        <p className='breadcrumb'>Dashboard / All Payment Request List</p>
      </div>

      <div className='inmy-payments'>
        <div className='buttontxt'>
          <h3>All Payment Request List</h3>
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

        {/* Payments Table */}
        <div className='table-container'>
          <table className='payment-table'>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Transaction ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Payment Date / Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((p, index) => (
                  <tr key={p._id}>
                    <td>{index + 1}</td>
                    <td>{p._id}</td>
                    <td>{p.name}</td>
                    <td>{p.reqamount}</td>
                    <td>{p.paymentmode}</td>
                    <td>{p.paymentStatus || 'Pending'}</td>
                    <td>
                      {p.paymentDate
                        ? `${new Date(p.paymentDate).toLocaleDateString()} ${p.paymentTime || ''}`
                        : '-'}
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/citizen/edit-payment/${p._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePayment(p._id)}
                        style={{ marginLeft: '5px', backgroundColor: 'red', color: '#fff' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='8' className='no-data'>
                    No data available in table
                  </td>
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

export default PRComp;
