import React from 'react';
import styles from './Input.module.scss'

const Input = ({ type, onChange, placeholder, label, name }) => {
  return (
    <fieldset>
      <label htmlFor={name} className={styles['label']}>{label}</label>
      <input name={name} id={name} type={type} onChange={onChange} placeholder={placeholder} className={styles['input']} />
    </fieldset>
  );
};

export default Input;