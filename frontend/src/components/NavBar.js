import React from 'react';

const NavBar = () => {
  return (
    <nav style={styles.navBar}>
      <h1 style={styles.title}>Crowdfunding DApp</h1>
      <button style={styles.connectButton}>Connect Wallet</button>
    </nav>
  );
};

const styles = {
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  title: {
    fontSize: '24px',
  },
  connectButton: {
    backgroundColor: '#61dafb',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default NavBar;
