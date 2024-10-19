import React from 'react';
import Select from 'react-select';
import './Navbar.css';

const Navbar = ({ userLang, setUserLang, userTheme,
  setUserTheme, fontSize, setFontSize }) => {
  const languages = [
    { value: "javascript", label: "Javascript" },
    // { value: "python", label: "Python" },
    // { value: "java", label: "Java" },
  ];
  const themes = [
    { value: "light", label: "Light" },
    { value: "vs-dark", label: "Dark" },
  ]
  
  return (
    <div className="navbar">
      <Select options={languages}
        value={userLang.label}
        onChange={(e) => setUserLang(e)}
        placeholder={userLang.label} />
      <Select options={themes}
        value={userTheme.label}
        onChange={(e) => setUserTheme(e)}
        placeholder={userTheme.label} />
      <label className="navbar-text">Font Size</label>
      <input type="range"
        min="12"
        nmax="30"
        value={fontSize}
        step="2"
        onChange={(e) => { setFontSize(e.target.value) }} />
    </div>
  )
}

export default Navbar