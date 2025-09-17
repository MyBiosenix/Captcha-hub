import React, { useState, useEffect } from 'react';
import '../CSSFiles/euser.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EUserComp() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [users, search, sortField, sortOrder]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://captcha-hub.onrender.com/api/auth/admin/all-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err.message);
      alert('Error Fetching Users');
    }
  };

  const applyFilters = () => {
    let temp = [...users];

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      temp = temp.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.package?.packages?.toLowerCase().includes(q)
      );
    }

    if (sortField) {
      temp.sort((a, b) => {
        let valA = a[sortField] || 0;
        let valB = b[sortField] || 0;

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        else return valA < valB ? 1 : -1;
      });
    }

    setFilteredUsers(temp);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='mypayments1'>
      <div className='payment-header1'>
        <h2>All Users</h2>
        <p className='breadcrumb1'>Dashboard / All Users List</p>
      </div>

      <div className='inmy-payments1'>
        <div className='buttontxt1'>
          <h3>All Users</h3>
          <input
            type='text'
            placeholder='Search by name, email, or package'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='filter-sort'>
          <label>Sort by:</label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value=''>-- Select Field --</option>
            <option value='rightCaptcha'>Right Captcha</option>
            <option value='wrongCaptcha'>Wrong Captcha</option>
            <option value='totalEarnings'>Amount</option>
          </select>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </div>

        <div className='table-container1'>
          <table className='payment-table1'>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Right Captcha</th>
                <th>Wrong Captcha</th>
                <th>Amount</th>
                <th>Captcha Length</th>
                <th>Captcha Difficulty</th>
                <th>Sleep Time</th>
                <th>Package</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((u, index) => (
                  <tr key={u._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.rightCaptcha || 0}</td>
                    <td>{u.wrongCaptcha || 0}</td>
                    <td>{u.totalEarnings || 0}</td>
                    <td>{u.captchaLength || '-'}</td>
                    <td>{u.captchaDifficulty || '-'}</td>
                    <td>{u.sleepTime || '-'}</td>
                    <td>{u.package?.packages || '-'}</td>
                    <td className='mybttnns1'>
                      <button
                        className='edit-btn1'
                        onClick={() =>
                          navigate('/admin/edit-user/manage-captcha', {
                            state: { userToEdit: u },
                          })
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='11' className='no-data'>
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
  );
}

export default EUserComp;
