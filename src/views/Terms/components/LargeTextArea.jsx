import React from 'react';

const LargeTextArea = (props) => (
    <div className="form-group">
        <strong>
            <label className="form-label text-secondary" style={{ fontSize: '20px' }}>{props.title}</label>
        </strong>
    &nbsp;
    &nbsp;
    &nbsp;
        <textarea style={{ height: '100px', width: '100%', color: 'black', fontWeight: 'bold' }}
            className="form-control"
            name={props.name}
            rows={props.rows}
            cols={props.cols}
            value={props.value}
            onChange={props.handleChange}
            placeholder={props.placeholder} />
    </div>
);

export default LargeTextArea;