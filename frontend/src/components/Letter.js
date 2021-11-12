import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import '../styles/letter/spinner.scss';
import '../styles/letter/letter.scss';

const Letter = ({ match }) => {

  const button = (
    <div className="btn-wrapper">
      <div className="btn">
        <Link to="/3fcdb73d36d54f2cc22d0f68e6b6e182">
          GUESS THE CODE
        </Link>
      </div>
    </div>
  )

  const history = useHistory();

  let [letter, setLetter] = useState();
  let [lastLetter, setLastLetter] = useState(false);
  useEffect(() => {
    if (match.params.hash === 'b9ece18c950afbfa6b0fdbfa4ff731d3') {
      return history.replace('/');
    }
    fetch(`/api/letters/${match.params.hash}`).then(response => {
      response.json().then(data => {
        setLetter(`${data.letter}_${match.params.hash}`);
        setLastLetter(data.lastLetter); 
      });
    }).catch(error => {
      setLetter('The letter could not be loaded');
    });

  }, []);

  return (
    <div className="letter">
      <div className="headline-wrapper">
        <h2 className="headline">
          BRAVO!<br/>
          <span>YOU HAVE DISCOVERED THE LETTER</span>
        </h2>
      </div>
      <div className="letter-wrapper">
        <div className="spinner-wrapper">
          <div className={letter ? "lds-facebook hidden" : "lds-facebook"}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="letter-wrapper__inner">
          <div className="img-wrapper">
            <img src={`/images/letters/${letter}.png`} alt="letter"/>
          </div>
        </div>
      </div>
      {lastLetter ? button : null}
    </div>
  )
}

export default Letter;