import { Menu } from './components/menu';
import { NavBar } from './components/navbar';

import { AlleLogo } from '../../assets/logos/alle-logo';

import './header.css';

// because we're using semantic html in the subcomponents,
// try navigating the website with just your keyboard.
// try it with the menu opened and closed and note the differences

// no domain-specific props (no implementation details)
const Header = () => {
  // semantic html
  // generic class name
  return (
    <header className='Header'>
      <AlleLogo />

      {/* note we're not controlling the mobile display with props or any JS */}
      <NavBar />

      <Menu />
    </header>
  );
};

export { Header };
