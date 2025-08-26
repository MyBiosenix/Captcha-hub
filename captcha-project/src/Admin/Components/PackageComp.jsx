import React, { useState, useEffect } from 'react';
import '../../Citizen/CSSFiles/payment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PackageComp() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 Search state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');
  const admin = JSON.parse(localStorage.getItem('admin'));
  const role = admin?.role;

  const handlepackageadd = () => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');
    if (token && admin) {
      navigate('/admin/package-type/package-form');
    } else {
      navigate('/admin/login');
    }
  };

  const fetchPackage = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5035/api/types/all-packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Packages');
    }
  };

  const handleDeletePackage = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are You Sure you Want to delete this Package Type?')) {
      try {
        await axios.delete(`http://localhost:5035/api/types/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPackage();
      } catch (err) {
        console.error(err.message);
        alert('Error Deleting Package');
      }
    }
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  // 🔹 Filtered Packages
  const filteredPackages = packages.filter(pkg =>
    pkg.packages.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Pagination applied on filtered data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            <p>Copy</p>
            <p>Excel</p>
            <p>PDF</p>
            <p>Print</p>
          </div>
          <div className='search'>
            {/* 🔹 Search Box */}
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
                <th>Package Type</th>
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
                  <td colSpan="4" className='no-data'>No data available in table</td>
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

export default PackageComp;
