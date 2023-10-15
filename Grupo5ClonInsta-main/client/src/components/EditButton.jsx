import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function EditButton({ entryId }) {
  return (
    <Link to={`/${entryId}/editEntry`}>
      <button>Editar Entrada</button>
    </Link>
  );
}

EditButton.propTypes = {
  entryId: PropTypes.number.isRequired, 
};

export default EditButton;
