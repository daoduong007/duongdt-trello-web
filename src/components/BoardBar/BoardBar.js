import React, { useState } from 'react';
import './BoardBar.scss';
import {
  Container as BootstrapCOntainer,
  Row,
  Col,
} from 'react-bootstrap';

function BoardBar() {
  const log = 'The function is developing';
  return (
    <nav className='navbar-board'>
      <BootstrapCOntainer className='duongdt-trello-container'>
        <Row className='appbar-item'>
          <Col sm={6} xs={10} className='appbar-left-item'>
            <div className='app-actions'>
              <div
                className='item all'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-coffee' />
                <p>
                  <strong>Trello app Duongdt</strong>
                </p>
              </div>
              <div className='divider'></div>
              <div
                className='item home'
                onClick={() => {
                  alert(log);
                }}
              >
                <p>
                  <strong>Private WorkSpace</strong>
                </p>
              </div>
            </div>
          </Col>

          <Col sm={1} xs={12}></Col>
          <Col sm={5} xs={12} className='appbar-right-item'>
            <div className='user-actions'>
              <div
                className='item plus'
                onClick={() => {
                  alert(log);
                }}
              >
                <i className='fa fa-ellipsis-h' />
                <p>
                  <strong>Show Menu</strong>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </BootstrapCOntainer>
    </nav>
  );
}

export default BoardBar;
