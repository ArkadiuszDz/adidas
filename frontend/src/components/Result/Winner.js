import React from 'react';
import '../../styles/result/result.scss';

const Winner = () => {

  return (
    <div className="result-wrapper">
      <div className="result-message-wrapper">
        <div className="result-box result-box--win">
          <div className="result-message-wrapper__inner">
            <p className="line-top">
              CONGRATULATIONS
            </p>
          </div>
        </div>
      </div>
      <div className="result-text-wrapper">
        <p className="result-text">
          This is the correct answer - you have
          won&nbsp;a&nbsp;prize! We will send you a&nbsp;further
          instructions by email.
        </p>
        <p className="result-text">
          Please do not share the password
          with anyone.
        </p>
      </div>
    </div>
  )
}

export default Winner;