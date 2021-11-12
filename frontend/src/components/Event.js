import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import '../styles/event/event.scss';

const Event = () => {

  const history = useHistory();

  let [eventStatus, setEventStatus] = useState('unopen');

  useEffect(() => {
    fetch("/api/eventStatus").then(response => {
      response.json().then(data => {
        if (data.status === 'open') {
          return history.push('/3fcdb73d36d54f2cc22d0f68e6b6e182');
        }
        setEventStatus(data.status);
      });
    }).catch(err => console.log(err));
  }, []);

  const eventUnopen = (
    <>
      <p className="line-top">
        BE READY TO GUESS 
      </p>
      <p className="line-bottom">
        THE PASSWORD
      </p>
      <p className="line-additional">
        SOON…
      </p>
    </>
  );

  const eventOpen = (
    <>
      <p className="line-top">
        BE READY TO GUESS 
      </p>
      <p className="line-bottom">
        THE PASSWORD
      </p>
      <p className="line-additional">
        SOON…
      </p>
    </>
  );

  const eventClosed = (
    <>
      <div className="cross">
        <div className="cross__inner">
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <p className="line-top">
        THE GAME HAS
      </p>
      <p className="line-bottom">
        BEEN DECODED
      </p>
    </>
  );

  const mainText = (
    <>
      <h2 className="headline">
        DECODE THE GAME
      </h2>
      <div className="event-text-wrapper">
        <p className="event-text">
          Save the letters, and with the last QR code
          of&nbsp;the event be the fastest to find the 
          password to&nbsp;win a prize.
        </p>
      </div>
    </>
  );

  return (
    <div className="event-wrapper">
      {eventStatus !== 'closed' ? mainText : null}
      <div className="event-message-wrapper">
        <div className="event-message-wrapper__inner">
          {eventStatus === 'unopen' ? eventUnopen : null}
          {eventStatus === 'closed' ? eventClosed : null}
          {eventStatus === 'open' ? eventOpen: null}
        </div>
      </div>
    </div>
  )
}

export default Event;