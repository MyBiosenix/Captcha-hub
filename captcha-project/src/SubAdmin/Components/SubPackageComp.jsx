import React, { useState, useEffect } from 'react';
import '../../Citizen/CSSFiles/payment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from "xlsx";       
import jsPDF from "jspdf";         
import autoTable from "jspdf-autotable";

function SubPackageComp() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');
  const admin = JSON.parse(localStorage.getItem('admin'));
  const role = admin?.role;

  const handlepackageadd = () => {
    if (token && admin) {
      navigate('/admin/package-type/package-form');
    } else {
      navigate('/admin/login');
    }
  };

  const fetchPackage = async () => {
    try {
      const res = await axios.get('https://api.captcha-google.com/api/types/all-packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Packages');
    }
  };


  useEffect(() => {
    fetchPackage();
  }, []);


  const filteredPackages = packages.filter(pkg =>
    pkg.packages.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPackages.map((pkg, i) => ({
      "Sr. No.": i + 1,
      "Package Type": pkg.packages
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packages");
    XLSX.writeFile(workbook, "PackageTypes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Package Type List", 14, 15);

    const tableColumn = ["Sr. No.", "Package Type"];
    const tableRows = [];

    filteredPackages.forEach((pkg, i) => {
      tableRows.push([i + 1, pkg.packages]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("PackageTypes.pdf");
  };

  return (
    <div className='mypayments'>
      <div className='payment-header'>
        <h2>Package Type</h2>
        <p className='breadcrumb'>Dashboard / All Package-Type List</p>
      </div>

      <div className='inmy-payments'>
        <div className='buttontxt'>
          <h3>All Package Types</h3>
          {role === 'superadmin' &&(
            <button className='request-btn' onClick={handlepackageadd}>+ Add Package Type</button>
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
              placeholder='Search by package type'
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
                <th>Package Name</th>
                <th>Price(Per Captcha)</th>
                { role === 'superadmin' && (
                  <>
                    <th>Edit</th>
                    <th>Delete</th>
                  </>
                )}

              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((pkg, index) => (
                  <tr key={pkg._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{pkg.packages}</td>
                    <td>{pkg.price}</td>
                    { role === 'superadmin' && (
                      <>
                        <td>
                          <button 
                            className="edit-btn" 
                            onClick={() => navigate('/admin/package-type/package-form', { state: { packageToEdit: pkg } })}
                          >
                            Edit
                          </button>
                        </td>

                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeletePackage(pkg._id)}>
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === "superadmin" ? 4 : 2} className='no-data'>No data available in table</td>
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
  );
}

export default SubPackageComp;
