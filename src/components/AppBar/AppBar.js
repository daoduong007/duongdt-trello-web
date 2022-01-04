import React, { useState } from 'react';
import './AppBar.scss';
import {
  Container as BootstrapCOntainer,
  Row,
  Col,
  FormControl,
  InputGroup,
} from 'react-bootstrap';

function AppBar() {
  const [value, setValue] = useState('');

  const onChangeValue = (e) => {
    setValue(e.target.value);
  };
  const log = 'The function is developing';
  return (
    <nav className='navbar-app'>
      <BootstrapCOntainer className='duongdt-trello-container'>
        <Row className='appbar-item'>
          <Col sm={5} xs={12} className='appbar-left-item'>
            <div className='app-actions'>
              <div
                className='item all'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-th' />
              </div>
              <div
                className='item home'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-home' />
              </div>
              <div
                className='item boards'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-columns' />
              </div>
              <div className='item search'>
                <InputGroup className='group-search'>
                  <FormControl
                    className='input-search'
                    placeholder='Jump to ...'
                    onChange={onChangeValue}
                    value={value}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && setValue('');
                    }}
                  />
                  <InputGroup.Text
                    className='input-icon-search'
                    onClick={() => {
                      setValue('');
                    }}
                  >
                    <i className='fa fa-search' />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </Col>

          <Col sm={2} xs={12}></Col>
          <Col sm={5} xs={12} className='appbar-right-item'>
            <div className='user-actions'>
              <div
                className='item plus'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-plus-square-o' />
              </div>
              <div
                className='item info'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-info-circle' />
              </div>
              <div
                className='item noti'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-bell-o' />
              </div>
              <div
                className='item avatar'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-user' />
              </div>
            </div>
          </Col>
        </Row>
      </BootstrapCOntainer>
    </nav>
  );
}

export default AppBar;
