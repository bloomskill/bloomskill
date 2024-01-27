import React from 'react';
import PropTypes from 'prop-types';
import { HiArrowLeft } from 'react-icons/hi';
import { GoBack } from './BackLink.styled';

export const BackButton = ({ to, children }) => {
  return (
    <GoBack to={to}>
      <HiArrowLeft size={16} />
      {children}
    </GoBack>
  );
};
BackButton.propTypes = {
  to: PropTypes.string,
  children: PropTypes.string,
};
