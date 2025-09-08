import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSSFiles/work.css';
import { FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';

function WorkComp() {
  const [captchaSVG, setCaptchaSVG] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [answer, setAnswer] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [loadingNewCaptcha, setLoadingNewCaptcha] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    rightCaptcha: 0,
    wrongCaptcha: 0,
    totalCaptcha: 0
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const [refreshCount, setRefreshCount] = useState(0); 

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
        'https://captcha-hub-1.onrender.com/api/auth/user/stats',
        authHeader
      );
      if (data && typeof data.totalCaptcha === 'number') {
        setStats(data);

        const newLevel = Math.floor(data.totalCaptcha / 10) + 1;
        if (newLevel !== difficultyLevel) {
          setDifficultyLevel(newLevel);
        }

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
    setCaptchaLoading(true);
    const { data } = await axios.get(
      `https://captcha-hub-1.onrender.com/api/auth/user/generate?difficulty=${difficultyLevel}`,
      authHeader
    );
    setCaptchaSVG(data.svg);
    setCaptchaId(data.id);
    setAnswer('');
    setMsg('');
  } catch (err) {
    handleDeactivated(err);
    console.error('Error fetching captcha:', err);
  } finally {
    setCaptchaLoading(false); 
  }
};


  const submitCaptcha = async () => {
    const cleaned = answer.trim();
    if (!cleaned) return setMsg('Please enter the captcha.');

    setVerifying(true);
    try {
      const { data } = await axios.post(
        'https://captcha-hub-1.onrender.com/api/auth/user/verify',
        { captchaId, answer: cleaned },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.stats) setStats(data.stats);

      if (typeof data.success !== "undefined") {
        if (data.success) {
          toast.success("Correct Captcha Entered!", { autoClose: 3000 });
        } else {
          toast.error("The Captcha is incorrect!", { autoClose: 3000 });
        }
      } else if (data.message) {
        toast.info(data.message, { autoClose: 3000 });
      }

      setVerifying(false);
      setLoadingNewCaptcha(true);

      const sleepTime = getSleepTime(data.stats?.totalCaptcha || stats.totalCaptcha);
      setTimeout(() => {
        setLoadingNewCaptcha(false);
        fetchCaptcha();
      }, sleepTime);

    } catch (err) {
      handleDeactivated(err);

      if (err.response && err.response.status === 410) {
        toast.error("Captcha expired. Fetching a new one...", { autoClose: 3000 });
        fetchCaptcha();
      } else {
        console.error('Error verifying captcha:', err);
        setMsg('Something went wrong. Try again.');
        toast.error("Something went wrong. Try again.", { autoClose: 3000 });
      }

      setVerifying(false);
      setLoadingNewCaptcha(false);
    }
  };



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
  const init = async () => {
    await fetchStats();   
    fetchCaptcha();       
  };
  init();
}, []);
useEffect(() => {
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) ||
      (e.metaKey && (e.key === '+' || e.key === '-' || e.key === '=')) 
    ) {
      e.preventDefault();
    }
  };

  const handleGestureStart = (e) => {
    e.preventDefault();
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("gesturestart", handleGestureStart);

  return () => {
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("gesturestart", handleGestureStart);
  };
}, []);



/*
  useEffect(() => {
    fetchCaptcha();
  }, [difficultyLevel]);

    useEffect(() => {
    fetchStats();
  },[]);
*/
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
          {verifying ? (
            <div className="loader">Verifying...</div>
          ) : loadingNewCaptcha ? (
            <div className="loader">Loading new captcha...</div>
          ) : captchaLoading ? (
            <div className="loader">Loading captcha...</div>
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
                onKeyDown={(e) => {
                  
                  if (
                    (e.ctrlKey || e.metaKey) &&
                    ["c", "v", "x", "z", "y", "a"].includes(e.key.toLowerCase())
                  ) {
                    e.preventDefault();
                  }

                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitCaptcha();
                  }
                }}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()} 
                autoComplete="off"
                spellCheck={false}
                disabled={verifying || captchaLoading || loadingNewCaptcha}
              />

              <button onClick={submitCaptcha} disabled={verifying || captchaLoading || loadingNewCaptcha}>
                Submit
              </button>
            </>
          )}
        </div>


      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </div>
    
  );
}

export default WorkComp;
