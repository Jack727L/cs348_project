import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactCountryFlag from 'react-country-flag';
import { getNationalities } from '../api/playersApi';
import nationalityToCode from '../utils/nationalityToCode';
import './NationalityDropdown.css';

const NationalityDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setOpen(prev => !prev);
  };

  const handleOptionClick = (nat) => {
    onChange(nat);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && nationalityOptions.length === 0) {
      setLoading(true);
      getNationalities()
        .then(data => {
          setNationalityOptions(data);
        })
        .catch(err => {
          setFetchError("Error fetching nationalities");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, nationalityOptions.length]);

  return (
    <div className="nationality-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        {value ? value.countryname : 'Select Nationality'}
      </div>
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setOpen(false)}>
              &times;
            </button>
            {loading ? (
              <p>Loading nationalities...</p>
            ) : fetchError ? (
              <p className="error">{fetchError}</p>
            ) : (
              <div className="options-grid">
                {nationalityOptions.map((nat) => (
                  <div
                    key={nat.country_id}
                    className="grid-option"
                    onClick={() => handleOptionClick(nat)}
                  >
                    <ReactCountryFlag
                      countryCode={nationalityToCode[nat.countryname] || ""}
                      svg
                      style={{ width: '1.5em', marginRight: '8px' }}
                    />
                    {nat.countryname}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

NationalityDropdown.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default NationalityDropdown;