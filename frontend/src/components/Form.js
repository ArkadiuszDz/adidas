import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import '../styles/form/form.scss';

const Form = () => {

  const [agreement1, setAgreement1] = useState(false);
  const [text, setText] = useState('');
  const [email, setEmail] = useState(localStorage.getItem("email") || '');
  const [textError, setTextError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [agreement1Error, setAgreement1Error] = useState(false);
  const [placeholderClass, setPlaceholderClass] = useState('');
  const [emailPlaceholderClass, setEmailPlaceholderClass] = useState('');

  const textErrorMessage = (
    <p className="error-message">Please enter your code</p>
  );

  const emailErrorMessage = (
    <p className="error-message">Please enter your adress e-mail </p>
  );

  const history = useHistory();

  const emailInputHandler = function(e) {
    const emailRegex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    setEmail(e.target.value);

    if (emailRegex.test(e.target.value)) {
      setEmailError(false);
    }

  }

  const textareaHandler = function(e) {
    setText(e.target.value);
    if (e.target.value.length > 3) {
      setTextError(false);
    }
  }

  const consentInputHandler = function(e) {
    setAgreement1(e.target.checked);
    if (e.target.checked) {
      setAgreement1Error(false);
    }
  }

  const inputBlur = function(e) {
    if (e.target.value.length > 0) {
      setPlaceholderClass('hidden');
    } else {
      setPlaceholderClass('');
    }
  }

  const emailInputBlur = function(e) {
    if (e.target.value.length > 0) {
      setEmailPlaceholderClass('hidden');
    } else {
      setEmailPlaceholderClass('');
    }
  }

  const submitHandler = function() {
    const emailRegex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (emailRegex.test(email) && text.length >= 4 && agreement1) {

      if (localStorage.getItem("email") !== email) {
        localStorage.setItem("email", email);
      }


    axios({
      method: 'post',
      url: '/api/submits',
      data: {
        password: text.toUpperCase(),
        email: email,
        agreement1: agreement1,
        agreement2: agreement1
      }
    })
    .then(response => {
      const data = response.data;

      if (data.success && data.count) {
        history.replace("/3fcdb73d36d54f2cc22d0f68e6b6e182/almost-there");
      } else if (data.success) {
        history.replace("/3fcdb73d36d54f2cc22d0f68e6b6e182/winner");
      } else {
        history.replace("/3fcdb73d36d54f2cc22d0f68e6b6e182/try-again");
      }
    })
    .catch(error => console.log(error));

    } else {

      if (!emailRegex.test(email)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }

      if (!(text.length >= 4)) {
        setTextError(true);
      } else {
        setTextError(false);
      }

      if (!agreement1) {
        setAgreement1Error(true);
      } else {
        setAgreement1Error(false);
      }

    }
  }

  return (
    <div className="form-wrapper">
      <h2 className="headline">
        DECODE THE GAME
      </h2>
      <div className="form-text-wrapper">
        <p className="form-text">
          Save the letters, and with the last QR code
          of&nbsp;the event be the fastest to find the 
          password to&nbsp;win a prize.
        </p>
        <p className="form-text">
          The early bird catches the worm.
        </p>
      </div>
      <form>
        <div className={textError ? "textarea-wrapper error-input" : "textarea-wrapper"}>
          <input
            className="textarea"
            type="text"
            maxLength="20"
            value={text} 
            onChange={e => textareaHandler(e)}
            onBlur={e => inputBlur(e)}
          />
          <p className={`placeholder ${placeholderClass}`}>
            ENTER YOUR CODE HERE…
          </p>
        </div>
        <div className="error-message-wrapper">
          {textError ? textErrorMessage : null}
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="consent" className={agreement1Error ? "error-input" : ""}>
            <div className="checkbox">
              <input id="consent" type="checkbox" 
                value={agreement1}
                onChange={e => consentInputHandler(e)}
              />
              <span className="checkmark"></span>
            </div>
            <p>
              I agree to the terms and conditions<span>*</span>
            </p>
          </label>
        </div>
        <div className={emailError ? "email-wrapper error-input" : "email-wrapper"}>
          <input type="email" 
            value={email}
            onChange={e => emailInputHandler(e)}
            onBlur={e => emailInputBlur(e)}
          />
          <p className={email.length > 0 ? "email-placeholder hidden" : `email-placeholder ${emailPlaceholderClass}`}>
            Your e-mail<span>*</span>
          </p>
        </div>
        <div className="error-message-wrapper">
          {emailError ? emailErrorMessage : null}
        </div>

        <div className="btn-wrapper">
          <div className="btn" onClick={() => submitHandler()}>
            <span>SUBMIT</span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Form;