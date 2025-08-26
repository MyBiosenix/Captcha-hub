import React, { useEffect, useState } from 'react';
import '../CSSFiles/work.css';
import { FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';

function WorkComp() {
  const [captchaSVG, setCaptchaSVG] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [answer, setAnswer] = useState('');
  const [stats, setStats] = useState({
    totalEarnings: 0,
    rightCaptcha: 0,
    wrongCaptcha: 0,
    totalCaptcha: 0
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const [refreshCount, setRefreshCount] = useState(0); // track refresh usage

  const token = localStorage.getItem('token');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  };

  const handleDeactivated = (err) => {
  if (err.response && err.response.status === 403) {
    alert("Your account has been deactivated. Please contact admin.");
    localStorage.clear();
    window.location.href = "/citizen/login";
  }
};

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5035/api/auth/user/stats',
        authHeader
      );
      if (data && typeof data.totalCaptcha === 'number') {
        setStats(data);

        const newLevel = Math.floor(data.totalCaptcha / 10) + 1;
        if (newLevel !== difficultyLevel) {
          setDifficultyLevel(newLevel);
        }

        // Reset refresh count when user crosses into a new 100 range
        const hundredBlock = Math.floor(data.totalCaptcha / 100);
        if (refreshCount > 0 && data.totalCaptcha % 100 === 0) {
          setRefreshCount(0);
        }
      }
    } catch (e) {
      handleDeactivated(e);
      console.error('Error fetching stats:', e);
    }
  };

  const getSleepTime = (totalCaptcha) => {
  let sleep = 1000 + Math.floor(totalCaptcha / 1000) * 500;

  if (sleep > 10000) sleep = 10000;

  return sleep;
  };


  const fetchCaptcha = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5035/api/auth/user/generate?difficulty=${difficultyLevel}`,
        authHeader
      );
      setCaptchaSVG(data.svg);
      setCaptchaId(data.id);
      setAnswer('');
      setMsg('');
    } catch (err) {
      handleDeactivated(err);
      console.error('Error fetching captcha:', err);
    }
  };

  const submitCaptcha = async () => {
    const cleaned = answer.trim();
    if (!cleaned) return setMsg('Please enter the captcha.');

    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5035/api/auth/user/verify',
        { captchaId, answer: cleaned },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.stats) setStats(data.stats);
      if (data.message) setMsg(data.message);

      const sleepTime = getSleepTime(data.stats?.totalCaptcha || stats.totalCaptcha);

      setTimeout(() => {
        setLoading(false);
        fetchCaptcha();
      }, sleepTime);

    } catch (err) {
      handleDeactivated(err);
      console.error('Error verifying captcha:', err);
      setMsg('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  // Handle refresh with limitation
  const handleRefresh = () => {
    const hundredBlock = Math.floor(stats.totalCaptcha / 100);
    if (refreshCount < 2) {
      setRefreshCount(refreshCount + 1);
      fetchCaptcha();
    } else {
      setMsg(`You can refresh only 2 times per 100 captchas.`);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCaptcha();
  }, [difficultyLevel]);

  return (
    <div className='workcomp'>
      <div className='inworkcomp'>
        <h2>Captcha Work</h2>
        <div className='paras'>
          <p>Total Earnings: ₹{stats.totalEarnings}</p>
          <p>
            <span style={{ color: 'green' }}>
              Right Captcha: {stats.rightCaptcha}
            </span>
          </p>
          <p>
            <span style={{ color: 'red' }}>
              Wrong Captcha: {stats.wrongCaptcha}
            </span>
          </p>
          <p>Total Captcha: {stats.totalCaptcha}</p>
        </div>

        <div className='captcha'>
          {loading ? (
            <div className="loader">Loading next captcha...</div>
          ) : (
            <>
              {captchaSVG && (
                <div
                  className="captcha-box"
                  dangerouslySetInnerHTML={{ __html: captchaSVG }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              )}
              <FaSyncAlt
                style={{
                  cursor: refreshCount < 2 ? 'pointer' : 'not-allowed',
                  color: refreshCount < 2 ? 'black' : 'gray'
                }}
                onClick={refreshCount < 2 ? handleRefresh : null}
                title='Refresh captcha'
              />
              <input
                type="text"
                placeholder="Enter Captcha"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitCaptcha()}
                disabled={loading}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              <button onClick={submitCaptcha} disabled={loading}>
                Submit
              </button>
              {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkComp;
