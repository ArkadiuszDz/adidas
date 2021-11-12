import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/result/result.scss';

const Result = () => {

  const button = (
    <div className="btn-wrapper">
      <div className="btn">
        <Link to="/3fcdb73d36d54f2cc22d0f68e6b6e182">
          TRY AGAIN
        </Link>
      </div>
    </div>
  )

  const winner = (
    <div className="result-message-wrapper">
      <div className="result-box result-box--win">
        <div className="result-message-wrapper__inner">
          <p className="line-top">
            CONGRATULATIONS
          </p>
        </div>
      </div>
    </div>
  );

  const winnerText = (
    <>
      <p className="result-text">
        This is the correct answer - you have
        won&nbsp;a&nbsp;prize! We will send you a&nbsp;further
        instructions by email.
      </p>
      <p className="result-text">
        Please do not share the password
        with anyone.
      </p>
    </>
  );

  const lost = (
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
  );

  const lostText = (
    <>
      <p className="result-text">
        After 5 minutes try again…
      </p>
    </>
  );

  const tooSlow = (
    <div className="headline-wrapper">
      <h2 className="headline">
        GREAT!<br/>
      </h2>
    </div>
  );

  const tooSlowText = (
    <>
      <p className="result-text">
        This is the correct answer. 
        Unfortunately, some people got here faster!
      </p>
      <p className="result-text">
        Better luck next time!
      </p>
    </>
  );

  return (
    <div className="result-wrapper">
      {tooSlow}
      <div className="result-text-wrapper">
        {tooSlowText}
      </div>
      {button}
    </div>
  )
}

export default Result;