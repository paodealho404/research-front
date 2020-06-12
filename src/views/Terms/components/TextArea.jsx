import React from 'react';

const TextArea = (props) => (
    <div className="form-group">
        <strong>
            <label className="form-label text-secondary" style={{ fontSize: '20px' }}>{props.title}</label>
        </strong>
    &nbsp;
    &nbsp;
    &nbsp;
        <b className="text-danger">(Preenchimento obrigatório)</b>
        <textarea style={{ height: '50px', width: '40%', color: 'black', fontWeight: 'bold' }}
            className="form-control"
            name={props.name}
            rows={props.rows}
            cols={props.cols}
            value={props.value}
            onChange={props.handleChange}
            placeholder={props.placeholder} />
    </div>
);

export default TextArea;