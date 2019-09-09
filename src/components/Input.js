import React from "react";

const Input = ({ name, placeholder, value, handleChange }) => {
  return (
    <div>
      <label htmlFor={name} className="visuallyHidden">
        {placeholder}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default Input;
