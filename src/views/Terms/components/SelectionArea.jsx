import React from 'react';

const SelectionArea = (props) => (
    <div className="form-group">
        <strong>
            <label className="form-label text-secondary" style={{ fontSize: '20px' }}>{props.title}</label>
        </strong>
    &nbsp;
    &nbsp;
    &nbsp;
        <b className="text-danger">(Preenchimento obrigatório)</b>
        <select style={{ height: '50px', width: '40%', color: 'black', fontWeight: 'bold' }} className="form-control" name={props.name} value={props.value} onChange={props.handleChange} placeholder={props.placeholder}>
            {props.options.map(option => {
                return (
                    <option value={option} style={{ color: 'black', fontSize: '1.25em' }}>{option}</option>
                );
            })}
        </select>
    </div>
);

export default SelectionArea;