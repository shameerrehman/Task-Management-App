import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const UserSearchDropdown = ({ onUserSelect }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://seyi6tnkiy76d4eril23nq4uqm0nzaix.lambda-url.us-east-1.on.aws/',
          {
            searchString: inputValue,
          }
        );

        const usersObject = response.data;
        // Convert object to array of options
        const formattedOptions = Object.entries(usersObject).map(([username, fullName]) => ({
          value: username,
          label: username,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleInputChange = value => {
    setInputValue(value);
  };

  const handleUserChange = selectedOption => {
    onUserSelect(selectedOption);
  };

  return (
    <Select
      options={options}
      isSearchable
      placeholder="Search for a user..."
      onInputChange={handleInputChange}
      onChange={handleUserChange}
    />
  );
};

export default UserSearchDropdown;
