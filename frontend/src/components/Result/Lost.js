import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/result/result.scss';

const Lost = () => {

  const [btnEnabled, setBtnEnabled] = useState(false);

  useEffect(() => {
    let remainingTime;

    fetch('/api/nextSubmitTime')
    .then(response => {
      response.json().then(data => {
        setBtnEnabled(data.enabled);

        if (!data.enabled && data.remaining) {
          remainingTime = setTimeout(() => {
            setBtnEnabled(true);
          }, data.remaining);
        }
      })
    })
    .catch(error => console.log(error));

    return () => {
      clearTimeout(remainingTime);
    }
  }, []);

  return (
    <div className="result-wrapper">
      <div className="result-message-wrapper">
        <div className="result-box result-box--lost">
          <div className="result-message-wrapper__inner">
            <div className="cross">
              <div className="cross__inner">
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
            <p className="line-top">
              ANSWER
            </p>
            <p className="line-bottom">
              IS INCORRECT
            </p>
            <div className="cross cross--block">
              <div className="cross__inner">
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
            <div className="cross cross--block">
              <div className="cross__inner">
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="result-text-wrapper">
        <p className="result-text">
          After 5 minutes try again…
        </p>
      </div>
      <div className="btn-wrapper">
        <div className={btnEnabled ? "btn btn--enabled" : "btn btn--disabled"}>
          <Link to="/3fcdb73d36d54f2cc22d0f68e6b6e182">
            TRY AGAIN
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Lost;