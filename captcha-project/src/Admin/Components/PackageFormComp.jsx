import React, { useEffect, useState } from 'react'
import '../../Citizen/CSSFiles/paymentform.css'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


function PackageFormComp() {
  const location = useLocation();
  const navigate = useNavigate();

  const packageToEdit = location.state?.packageToEdit || null;

  const [packages, setPackages] = useState('');

  useEffect(() => {
      if (packageToEdit) {
        setPackages(packageToEdit.packages);
      }
  }, [packageToEdit]);
 
  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    if (packages.trim() === "") {
      alert('Package Type is Required');
      return;
    }

    try {
      if (packageToEdit) {
        await axios.put(`https://captcha-hub.onrender.com/api/types/edit-package/${packageToEdit._id}`, { packages });
        alert('Package Type Updated Successfully');
      } else {
        await axios.post('https://captcha-hub.onrender.com/api/types/package-type', { packages });
        alert('Package Type Added Successfully');
      }
      setPackages('');
      navigate('/admin/package-type');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving Package');
    }
  };

  return (
    <div className='mypf'>
      <div className='fiseforms'>
        <div className='seform'>
            <h2>{packageToEdit ? 'Edit Package Type' : 'Add Package Type'}</h2>
            
            <div className='in-seform'>
                <input type='text' placeholder='Enter Name*' value={packages} onChange={(e) => setPackages(e.target.value)} required/>
            </div>

            <div className='mybtns'>
                <button className='water-button'>Cancel</button>
                <button className='water-button2' onClick={handlePackageSubmit}>Submit</button>
            </div>
      </div>
      </div>
    </div>
  )
}

export default PackageFormComp
