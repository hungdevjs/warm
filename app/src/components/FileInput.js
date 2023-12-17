import { forwardRef } from 'react';

const FileInput = ({ inputId, onChange, accept }, ref) => {
  return (
    <>
      <label htmlFor={inputId} ref={ref} style={{ display: 'none' }} />
      <input
        id={inputId}
        style={{ display: 'none' }}
        type="file"
        accept={accept}
        onChange={onChange}
      />
    </>
  );
};

export default forwardRef(FileInput);
