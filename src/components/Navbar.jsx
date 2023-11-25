import React from 'react';

function Navbar() {
  return (
    <div style={{ backgroundColor: "rgba(10, 25, 47, 1)", margin: 'auto'}}>
      <nav style={{ maxWidth: '1250px', padding: '15px 50px', margin: 'auto', display: 'flex', justifyContent: 'space-between' }}>
          <a style={{ padding: '5px', cursor: 'pointer', color: 'white', textDecoration: 'none', border: '1px solid transparent' }} href='/'>
          <span style={{ color: '#fff' }}>Path Finder Visualizer</span>
          </a>
      </nav>
    </div>
  );
}

export default Navbar;
