import React, { useEffect, useState } from 'react';
import '../CSSFiles/dashboard.css';
import { FaRupeeSign, FaCheck, FaTimes, FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';

function DashComp() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    rightCaptcha: 0,
    wrongCaptcha: 0,
    totalCaptcha: 0,
    validTill: null,
    packageName: '',
    packagePrice: 0
  });

  // ✅ NEW: timer state
  const [timeLeft, setTimeLeft] = useState("");

  const token = localStorage.getItem('token');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        'https://api.captcha-google.com/api/auth/user/stats',
        authHeader
      );
      console.log("📡 API Response:", data);

      setStats(data);
    } catch (e) {
      console.error("Error fetching stats:", e.response?.data || e.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ✅ NEW: countdown effect based on stats.validTill
  useEffect(() => {
    if (!stats?.validTill) {
      setTimeLeft("");
      return;
    }

    const pad = (n) => String(n).padStart(2, "0");

    const compute = () => {
      const expiry = new Date(stats.validTill);

      // If validTill is a date-only, count until end-of-day
      expiry.setHours(23, 59, 59, 999);

      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft(`${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, [stats?.validTill]);

  return (
    <div className='mydashboard'>
      <div className='mindash'>
        <div className='myh2'>
          <h2>Dashboard</h2>
        </div>

        <div className='indashboard'>
          <div className='icontexts'>
            <div className='icon-wrap one'>
              <FaRupeeSign />
            </div>
            <div className='mydoit'>
              <h4>Total Earning</h4>
              <h3>₹{stats.totalEarnings}</h3>
            </div>
          </div>

          <div className='icontexts'>
            <div className='icon-wrap two'>
              <FaCheck />
            </div>
            <div className='mydoit'>
              <h4>Correct Captcha</h4>
              <h3>{stats.rightCaptcha}</h3>
            </div>
          </div>

          <div className='icontexts'>
            <div className='icon-wrap three'>
              <FaTimes />
            </div>
            <div className='mydoit'>
              <h4>Incorrect Captcha</h4>
              <h3>{stats.wrongCaptcha}</h3>
            </div>
          </div>

          <div className='icontexts'>
            <div className='icon-wrap four'>
              <FaTicketAlt />
            </div>
            <div className='mydoit'>
              <h4>Total Captcha</h4>
              <h3>{stats.totalCaptcha}</h3>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>
            Subscription Plan:{" "}
            <strong>
              {stats.packageName ? `${stats.packageName} ` : "No plan assigned"}
            </strong>
          </p>

          <p style={{ marginBottom: "6px" }}>
            Valid till:{" "}
            <strong>
              {stats.validTill
                ? new Date(stats.validTill).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "No expiry date set"}
            </strong>
          </p>

          {/* ✅ Timer below validity */}
          {stats.validTill && (
            <p style={{ fontWeight: 700 }}>
              Time Left: {timeLeft}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashComp;
