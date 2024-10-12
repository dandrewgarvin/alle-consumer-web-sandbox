import './navbar.css';

const NavBar = () => {
  return (
    <nav className='NavBar'>
      <ul className='NavBar__items'>
        <li className='NavBar__item'>
          <a href='#home' className='NavBar__link'>
            Home
          </a>
        </li>
        <li
          className={['NavBar__item', 'NavBar__item--active']
            .filter(Boolean)
            .join(' ')}
        >
          <a href='#wallet' className='NavBar__link'>
            Wallet
          </a>
        </li>
        <li className='NavBar__item'>
          <a href='#providers' className='NavBar__link'>
            Providers
          </a>
        </li>
      </ul>
    </nav>
  );
};

export { NavBar };
