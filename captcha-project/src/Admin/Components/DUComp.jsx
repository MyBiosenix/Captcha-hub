import React, { useEffect, useState } from 'react';
import '../../Citizen/CSSFiles/payment.css';
import axios from 'axios';
import * as XLSX from "xlsx";       // 📊 Excel
import jsPDF from "jspdf";          // 📄 PDF
import autoTable from "jspdf-autotable";  // 📝 Table for PDF

function DUComp() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchInactiveUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5035/api/auth/user/inactive-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Users');
    }
  };

  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  // 🔹 Filter users by search term
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

  // 📊 Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map((u, i) => ({
      "Sr. No.": i + 1,
      "Name": u.name,
      "Email Id": u.email,
      "Status": u.isActive ? "Active" : "Inactive"
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inactive Users");
    XLSX.writeFile(workbook, "InactiveUsersList.xlsx");
  };

  // 📄 Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Inactive Users List", 14, 15);

    const tableColumn = ["Sr. No.", "Name", "Email Id", "Status"];
    const tableRows = [];

    filteredUsers.forEach((u, i) => {
      tableRows.push([
        i + 1,
        u.name,
        u.email,
        u.isActive ? "Active" : "Inactive"
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("InactiveUsersList.pdf");
  };

  return (
    <div className='mypayments'>
      <div className='payment-header'>
        <h2>Manage User</h2>
        <p className='breadcrumb'>Dashboard / Inactive Users List</p>
      </div>

      <div className='inmy-payments'>
        <div className='buttontxt'>
          <h3>Inactive Users</h3>
        </div>

        <div className='printform'>
          <div className='inprint'>
            <p onClick={exportToExcel} style={{ cursor: "pointer" }}>Excel</p>
            <p onClick={exportToPDF} style={{ cursor: "pointer" }}>PDF</p>
          </div>
          <div className='search'>
            <input
              type='text'
              placeholder='Search by name or email'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 when searching
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
                <th>Email Id</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((u, index) => (
                  <tr key={u._id}>
                    <td>{indexOfFirstUser + index + 1}</td>
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
                  <td colSpan="4" style={{ textAlign: "center" }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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

export default DUComp;