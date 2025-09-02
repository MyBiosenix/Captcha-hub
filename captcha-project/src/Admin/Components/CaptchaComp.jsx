import React, { useState, useEffect } from 'react'
import '../../Citizen/CSSFiles/payment.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as XLSX from "xlsx";       // 📊 Excel
import jsPDF from "jspdf";          // 📄 PDF
import autoTable from "jspdf-autotable";  // 📝 Table for PDF

function CaptchaComp() {
  const navigate = useNavigate();
  const [captchas, setCaptchas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); 
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');
  const admin = JSON.parse(localStorage.getItem('admin'));
  const role = admin?.role;

  const handleAdd = () => {
    if (token && admin) {
      navigate('/admin/captcha-type/captcha-form');
    } else {
      navigate('admin/login');
    }
  };

  const fetchCaptchas = async () => {
    try {
      const res = await axios.get('http://localhost:5035/api/auth/all-captchas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaptchas(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Captchas');
    }
  };

  const handleDeleteCaptcha = async (id) => {
    if (window.confirm('Are You Sure you Want to delete this Captcha Type?')) {
      try {
        await axios.delete(`http://localhost:5035/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCaptchas();
      } catch (err) {
        console.error(err.message);
        alert('Error Deleting Captcha');
      }
    }
  };

  useEffect(() => {
    fetchCaptchas();
  }, []);

  const filteredCaptchas = captchas.filter(c =>
    c.captcha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCaptchas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCaptchas.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 🔹 Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCaptchas.map((c, i) => ({
      "Sr. No.": i + 1,
      "Captcha Type": c.captcha
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Captchas");
    XLSX.writeFile(workbook, "CaptchaTypes.xlsx");
  };

  // 🔹 Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Captcha Type List", 14, 15);

    const tableColumn = ["Sr. No.", "Captcha Type"];
    const tableRows = [];

    filteredCaptchas.forEach((c, i) => {
      tableRows.push([i + 1, c.captcha]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("CaptchaTypes.pdf");
  };

  return (
    <div className='mypayments'>
      <div className='payment-header'>
        <h2>Manage Captcha Type</h2>
        <p className='breadcrumb'>Dashboard / All Captcha-Type List</p>
      </div>

      <div className='inmy-payments'>
        <div className='buttontxt'>
          <h3>All Captcha Type</h3>
          {role === 'superadmin' && (
            <button className='request-btn' onClick={handleAdd}>+ Add Captcha Type</button>
          )}
        </div>

        <div className='printform'>
          <div className='inprint'>
            <p onClick={exportToExcel} style={{ cursor: "pointer" }}>Excel</p>
            <p onClick={exportToPDF} style={{ cursor: "pointer" }}>PDF</p>
          </div>
          <div className='search'>
            <input 
              type='text' 
              placeholder='Search by captcha type'
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
                <th>Captcha Type</th>
                {role === "superadmin" && (
                  <>
                    <th>Edit</th>
                    <th>Delete</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((c, index) => (
                  <tr key={c._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{c.captcha}</td>
                    {role === "superadmin" && (
                      <>
                        <td>
                          <button
                            className='edit-btn'
                            onClick={() => navigate('/admin/captcha-type/captcha-form', { state: { captchaToEdit: c } })}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className='delete-btn'
                            onClick={() => handleDeleteCaptcha(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === "superadmin" ? 4 : 2} className='no-data'>
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className='pagination'>
            <button onClick={() => goToPage(1)} disabled={currentPage === 1}>{'«'}</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>{'‹'}</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>{'›'}</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>{'»'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptchaComp;
