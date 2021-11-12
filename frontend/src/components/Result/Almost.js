import React from 'react';
import '../../styles/result/result.scss';

const Result = () => {

  return (
    <div className="result-wrapper">
      <div className="headline-wrapper">
        <h2 className="headline">
          GREAT!<br/>
        </h2>
      </div>
      <div className="result-text-wrapper">
        <p className="result-text">
          This is the correct answer. 
          Unfortunately, some people got here faster!
        </p>
        <p className="result-text">
          Better luck next time!
        </p>
      </div>
    </div>
  )
}

export default Result;