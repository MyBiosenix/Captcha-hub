import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Citizen/CSSFiles/payment.css';
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";        
import jsPDF from "jspdf";           
import autoTable from "jspdf-autotable"; 

function SubAdminComp() {
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const adminsPerPage = 5;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const admin = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    if (token && admin?.role === 'superadmin') {
      fetchAdmins();
    }
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('https://captcha-hub.onrender.com/api/auth/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching admins');
    }
  };

  const handleAddSubadmin = () => {
    if (!token) {
      alert('Please Login First');
      navigate('/admin/login');
      return;
    }
    if (admin.role !== 'superadmin') {
      alert('Only Super Admins can add Sub-admins');
      return;
    }
    navigate('/admin/add-subadmin');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await axios.delete(`https://captcha-hub.onrender.com/api/auth/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAdmins();
      } catch (err) {
        console.error(err);
        alert('Error deleting admin');
      }
    }
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(admins.map((a, i) => ({
      "Sr. No.": i + 1,
      "Name": a.name,
      "User Type": a.role,
      "Email Id": a.email,
      "Password": a.password
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SubAdmins");
    XLSX.writeFile(workbook, "SubAdmins.xlsx");
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sub Admin List", 14, 15);

    const tableColumn = ["Sr. No.", "Name", "User Type", "Email Id", "Password"];
    const tableRows = [];

    admins.forEach((a, i) => {
      tableRows.push([i + 1, a.name, a.role, a.email, a.password]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("SubAdmins.pdf");
  };


  const filteredAdmins = admins.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * adminsPerPage;
  const indexOfFirst = indexOfLast - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='mypayments'>
      <div className='payment-header'>
        <h2>Manage Sub-Admin</h2>
        <p className='breadcrumb'>Dashboard / All Sub-Admin List</p>
      </div>

      <div className='inmy-payments'>
        <div className='buttontxt'>
          <h3>All Sub Admin</h3>
          <button className='request-btn' onClick={handleAddSubadmin}>+ Add Sub-Admin</button>
        </div>

        <div className='printform'>
          <div className='inprint'>
            <p onClick={exportToExcel} style={{cursor: "pointer"}}>Excel</p>
            <p onClick={exportToPDF} style={{cursor: "pointer"}}>PDF</p>
          </div>
          <div className='search'>
            <input
              type='text'
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.length > 0 ? currentAdmins.map((a, index) => (
                <tr key={a._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{a.name}</td>
                  <td>{a.role}</td>
                  <td>{a.email}</td>
                  <td>{a.password}</td>
                  <td className='mybttnns'>
                    <button
                      className='edit-btn'
                      onClick={() => navigate('/admin/edit-subadmin', { state: { admin: a } })}
                    >
                      Edit
                    </button>
                    <button
                      className='delete-btn'
                      onClick={() => handleDelete(a._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className='no-data'>No data available in table</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={() => goToPage(1)} disabled={currentPage === 1}>{'«'}</button>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>{'‹'}</button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>{'›'}</button>
          <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>{'»'}</button>
        </div>
      </div>
    </div>
  );
}

export default SubAdminComp;
