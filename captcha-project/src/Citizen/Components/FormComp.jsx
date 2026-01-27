import React, { useState } from 'react';
import axios from 'axios';
import '../CSSFiles/paymentform.css';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

function FormComp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pcamount: '',
    reqamount: '',
    bankname: '',
    branchname: '',
    accholder: '',
    accnumber: '',
    ifscCode: '',
    paymentmode: '',
    paymentDate: '',
    paymentTime: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://api.captcha-google.com/api/auth/user/create-payment-req', formData);
      alert(res.data.message);
      setFormData({
        name: '',
        email: '',
        pcamount: '',
        reqamount: '',
        bankname: '',
        branchname: '',
        accholder: '',
        accnumber: '',
        ifscCode: '',
        paymentmode: '',
        paymentDate: '',
        paymentTime: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error submitting payment request');
    }
  };

  return (
    <div className="mypf">
      <h2>Add Payment Request</h2>
      <form className="fiseforms" onSubmit={handleSubmit}>
        <div className="fiform">
          <h3>Basic Details</h3>
          <div className="in-fiform">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name*" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Id*" required />
            <input type="number" name="pcamount" value={formData.pcamount} onChange={handleChange} placeholder="Per Captcha Amount*" required />
            <input type="number" name="reqamount" value={formData.reqamount} onChange={handleChange} placeholder="Request Amount" required />
          </div>
        </div>

        <div className="seform">
          <h3>Bank Details</h3>
          <div className="in-seform">
            <input type="text" name="bankname" value={formData.bankname} onChange={handleChange} placeholder="Bank Name*" required />
            <input type="text" name="branchname" value={formData.branchname} onChange={handleChange} placeholder="Branch Name*" required />
            <input type="text" name="accholder" value={formData.accholder} onChange={handleChange} placeholder="Account Holder Name*" required />
            <input type="text" name="accnumber" value={formData.accnumber} onChange={handleChange} placeholder="Account Number*" required />
            <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" required />

            <select name="paymentmode" value={formData.paymentmode} onChange={handleChange} required>
              <option value="" disabled hidden>Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online transfer">Online Transfer</option>
              <option value="gpay">GooglePay</option>
              <option value="phonepay">PhonePe</option>
            </select>

            <div className="input-wrapper">
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="styled-input"
                required
              />
              <FaRegCalendarAlt className="input-icon" />
            </div>

            <div className="input-wrapper">
              <input
                type="time"
                name="paymentTime"
                value={formData.paymentTime}
                onChange={handleChange}
                className="styled-input"
                required
              />
              <FaRegClock className="input-icon" />
            </div>
          </div>

          <div className="mytextarea">
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
          </div>

          <div className="mybtns">
            <button type="button" className="water-button" onClick={() => setFormData({
              name: '',
              email: '',
              pcamount: '',
              reqamount: '',
              bankname: '',
              branchname: '',
              accholder: '',
              accnumber: '',
              ifscCode: '',
              paymentmode: '',
              paymentDate: '',
              paymentTime: '',
              notes: ''
            })}>
              Cancel
            </button>
            <button type="submit" className="water-button2">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormComp;
