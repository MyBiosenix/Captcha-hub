import React, { useState, useEffect } from 'react';
import '../CSSFiles/payment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentComp() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [totalCaptcha, setTotalCaptcha] = useState(0);

  const fetchPayments = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("https://captcha-hub-1.onrender.com/api/auth/user/user-reqs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      setPayments(res.data); 
    } else {
      setPayments([]); 
    }
  } catch (err) {
    console.error("Error fetching payments:", err.message);
    alert("Server error while fetching payments");
  }
};

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(
        'https://captcha-hub-1.onrender.com/api/auth/user/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data && typeof data.totalCaptcha === 'number') {
        setTotalCaptcha(data.totalCaptcha);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStats();
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
          <button
            className='request-btn'
            onClick={() => {
              if (totalCaptcha < 16000) {
                alert("Complete 16000 captchas before creating a payment request");
              } else {
                navigate('/citizen/payment-form');
              }
            }}>
              + Payment Request
          </button>

        </div>

        <div className='printform'>
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
                <th>Payment ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Payment Date / Time</th>
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

export default PaymentComp;
