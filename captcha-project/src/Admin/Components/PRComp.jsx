import React, { useState, useEffect } from 'react';
import '../../Citizen/CSSFiles/payment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PRComp() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://captcha-hub-1.onrender.com/api/auth/user/all-reqs', {
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
        await axios.delete(`https://captcha-hub-1.onrender.com/api/auth/user/pay/${id}`, {
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


  const filteredPayments = payments.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.paymentmode && p.paymentmode.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      currentPayments.map((p, i) => ({
        "Sr. No.": indexOfFirstPayment + i + 1,
        "Transaction ID": p._id,
        "Name": p.name,
        "Amount": p.reqamount,
        "Payment Mode": p.paymentmode,
        "Payment Status": p.paymentStatus || "Pending",
        "Payment Date/Time": p.paymentDate
          ? `${new Date(p.paymentDate).toLocaleDateString()} ${p.paymentTime || ""}`
          : "-"
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "PaymentRequests.xlsx");
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Request List", 14, 15);

    const tableColumn = [
      "Sr. No.",
      "Transaction ID",
      "Name",
      "Amount",
      "Payment Mode",
      "Status",
      "Date / Time"
    ];
    const tableRows = [];

    currentPayments.forEach((p, i) => {
      tableRows.push([
        indexOfFirstPayment + i + 1,
        p._id,
        p.name,
        p.reqamount,
        p.paymentmode,
        p.paymentStatus || "Pending",
        p.paymentDate
          ? `${new Date(p.paymentDate).toLocaleDateString()} ${p.paymentTime || ""}`
          : "-"
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("PaymentRequests.pdf");
  };

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
            <p onClick={exportToExcel} style={{ cursor: "pointer"}}>Excel</p>
            <p onClick={exportToPDF} style={{ cursor: "pointer"}}>PDF</p>
          </div>
          <div className='search'>
            <input 
              type='text' 
              placeholder='Search by name, ID, or mode' 
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
              {currentPayments.length > 0 ? (
                currentPayments.map((p, index) => (
                  <tr key={p._id}>
                    <td>{indexOfFirstPayment + index + 1}</td>
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

export default PRComp;
