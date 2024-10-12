import { useState } from 'react';

import './menu.css';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className='Menu'>
      <div className='Menu__button'>
        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          Menu
        </button>
      </div>

      {/*
        aside or navbar (or a combination of the two)
        is probably the most semantic markup for this component
      */}
      <aside
        className={['Menu__sidebar', menuOpen && 'Menu__sidebar--open']
          .filter(Boolean)
          .join(' ')}
      >
        <ul className='Menu__items'>
          <li className='Menu__item'>
            <a href='#home' className='Menu__link'>
              Home
            </a>
          </li>
          <li
            className={['Menu__item', 'Menu__item--active']
              .filter(Boolean)
              .join(' ')}
          >
            <a href='#wallet' className='Menu__link'>
              Wallet
            </a>
          </li>
          <li className='Menu__item'>
            <a href='#providers' className='Menu__link'>
              Providers
            </a>
          </li>
        </ul>
      </aside>
    </section>
  );
};

export { Menu };
