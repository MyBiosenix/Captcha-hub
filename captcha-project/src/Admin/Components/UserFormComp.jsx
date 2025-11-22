import React, { useEffect, useState } from 'react';
import '../../Citizen/CSSFiles/paymentform.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function UserFormComp() {
  const location = useLocation();
  const navigate = useNavigate();

  const userToEdit = location.state?.userToEdit || null;

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');

  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');

  const [admin, setAdmin] = useState('');
  const [packageType, setPackageType] = useState('');
  const [paymentMode, setPaymentMode] = useState('');

  const [adminsList, setAdminsList] = useState([]);
  const [packagesList, setPackagesList] = useState([]);

  const [validTill, setValidTill] = useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {

    if (userToEdit) {
      setName(userToEdit.name || ''); 
      setEmail(userToEdit.email || '');
      setMobile(userToEdit.mobile || '');
      setPrice(userToEdit.price || '');
      setAdmin(userToEdit.admin || '');
      setPackageType(userToEdit.package || '');
      setPaymentMode(userToEdit.paymentmode || '');
      setValidTill(userToEdit.validTill?.split("T")[0] || '');
    }
  }, [userToEdit]);

  useEffect(() => {
    axios
      .get('https://api.captcha-google.com/api/auth/admin/alladmins')
      .then((res) => setAdminsList(res.data))
      .catch((err) => console.error('Error Fetching Admins:', err));

    axios
      .get('https://api.captcha-google.com/api/types/allpackages')
      .then((res) => setPackagesList(res.data))
      .catch((err) => console.error('Error Fetching Packages:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setMobileError('');
    setPriceError('');

    let valid = true;

    if (name.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      valid = false;
    }

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      valid = false;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setMobileError('Mobile number must be exactly 10 digits');
      valid = false;
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      setPriceError('Enter a valid price');
      valid = false;
    }

    if (!valid) return;

    try {
      if (userToEdit) {
        await axios.put(
          `https://api.captcha-google.com/api/auth/user/edit-user/${userToEdit._id}`,
          {
            name,
            email,
            mobile,
            admin,
            package: packageType,
            price: Number(price),
            paymentmode: paymentMode,
            validTill
          }
        );
        alert('User Updated Successfully');
      } else {
        await axios.post('https://api.captcha-google.com/api/auth/user/create-user', {
          name,
          email,
          mobile,
          admin,
          package: packageType,
          price: Number(price),
          paymentmode: paymentMode,
          validTill
        });
        alert('User Created Successfully');
      }

      setName('');
      setEmail('');
      setMobile('');
      setPrice('');
      setAdmin('');
      setPackageType('');
      setPaymentMode('');
      setValidTill('')

      navigate('/admin/manage-user');
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Something went wrong while saving user.');
    }
  };

  return (
    <div className='mypf'>
      <h2>{userToEdit ? 'Edit User' : 'Add User'}</h2>
      <form className='fiseforms' onSubmit={handleSubmit}>
        <div className='fiform'>
          <h3>Basic Details</h3>
          <div className='in-fiform'>
            <div>
              <input
                type='text'
                placeholder='Name*'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
            </div>

            <div>
              <input
                type='email'
                placeholder='Enter Email Id*'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            </div>

            <div>
              <input
                type='tel'
                placeholder='Enter Mobile Number*'
                value={mobile}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setMobile(e.target.value);
                }}
                maxLength={10}
                required
              />
              {mobileError && <p style={{ color: 'red' }}>{mobileError}</p>}
            </div>

            <select
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              required
            >
              <option value='' disabled hidden>
                Select Admin
              </option>
              {adminsList.map((ad) => (
                <option key={ad._id} value={ad._id}>
                  {ad.name}
                </option>
              ))}
            </select>

            <select
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              required
            >
              <option value='' disabled hidden>
                Select Package
              </option>
              {packagesList.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.packages}
                </option>
              ))}
            </select>

            <div>
              <input
                type='number'
                placeholder='Enter Package Price*'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step='0.01'
                required
              />
              {priceError && <p style={{ color: 'red' }}>{priceError}</p>}
            </div>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              required
            >
              <option value='' disabled hidden>
                Payment Mode
              </option>
              <option value='cash'>Cash</option>
              <option value='cheque'>Cheque</option>
              <option value='online'>Online Transfer</option>
              <option value='gpay'>GooglePay</option>
              <option value='phonepe'>PhonePe</option>
            </select>
            <div>
              <input
                type="date"
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                required
              />
            </div>

          </div>
        </div>

        <div className='seform'>
          <div className='mybtns'>
            <button
              type='button'
              className='water-button'
              onClick={() => navigate('/admin/manage-user')}
            >
              Cancel
            </button>
            <button className='water-button2' type='submit'>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserFormComp;
