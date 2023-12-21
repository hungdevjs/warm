import { forwardRef } from 'react';

const FileInput = ({ inputId, onChange, accept, ...rest }, ref) => {
  return (
    <>
      <label htmlFor={inputId} ref={ref} style={{ display: 'none' }} />
      <input
        id={inputId}
        style={{ display: 'none' }}
        type="file"
        accept={accept}
        {...rest}
        onChange={onChange}
      />
    </>
  );
};

export default forwardRef(FileInput);
