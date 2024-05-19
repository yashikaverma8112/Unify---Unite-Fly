import React from 'react';
import Modal from 'react-responsive-modal';
import { Input, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const ModalContainer = ({
  isOpen,
  onClose,
  question,
  setInputUrl,
  setQuestion,
  inputUrl,
  handleSubmit,
  btnValue
}) => {
  const Close = <CloseIcon />;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeOnEsc
      center
      closeOnOverlayClick={false}
      styles={{
        overlay: {
          height: 'auto',
        },
        modal: {
          
          width: '100%',
          height :'80%',
          maxWidth: '600px', // Adjust the maximum width as needed
          borderRadius:'10px'
        },
      }}
    >
      <div className="modal-content p-4">
        <div className="text-danger fs-3 text-center mb-3" style={{ fontWeight: 'bold' }}>
          <h5>{btnValue}</h5>
        </div>
        <div className="modal__Field">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            className="form-control mb-3"
            placeholder="Start your question with 'What', 'How', 'Why', etc."
          />
          <div className="d-flex flex-column">
            <Input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              type="text"
              className="form-control mb-3"
              placeholder="Optional: include a link that gives context"
            />
            {inputUrl !== '' && (
              <img
                style={{
                  height: '40vh',
                  objectFit: 'contain',
                  marginBottom: '10px',
                }}
                src={inputUrl}
                alt="displayImage"
              />
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-danger" onClick={handleSubmit}>
            {btnValue}
          </button>
          <button
            className="btn btn-secondary "
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalContainer;
