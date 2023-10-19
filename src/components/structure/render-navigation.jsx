import { Link, Route, Routes, Navigate, NavLink } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { nav } from "./navigation";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import urls from "../../utils/urls";
export const RenderRoutes = () => {
  const flattenNav = (nav) => {
    let flattenedNav = [];

    const flatten = (navItem) => {
      if (!("navs" in navItem)) flattenedNav.push(navItem);
      else {
        navItem.navs.forEach(flatten);
      }
    };

    nav.forEach(flatten);

    return flattenedNav;
  };

  const { user } = AuthData();

  const renderRoute = (route) => {
    return <Route key={route.id} path={route.path} element={route.element} />;
  };

  return (
    <Routes>
      {flattenNav(nav).map((r) => {
        if ("path" in r) {
          if ((r.isPrivate && user.AuthToken) || !r.isPrivate)
            return renderRoute(r);
          else return false;
        } else return false;
      })}

      <Route
        key={0}
        path='*'
        element={<Navigate to={urls.client.homepage} replace />}
      />
    </Routes>
  );
};

export const RenderMenu = () => {
  const { user, logout } = AuthData();

  const renderDropdownMenuItem = (r) => {
    if ((!r.isPrivate || user.AuthToken) && r.isMenu) {
      return (
        <NavDropdown.Item key={r.id} as={NavLink} to={r.path}>
          {r.name}
        </NavDropdown.Item>
      );
    } else return false;
  };
  const renderMenuItem = (r) => {
    if ((!r.isPrivate || user.AuthToken) && r.isMenu) {
      return (
        <NavLink key={r.id} to={r.path} className='nav-link'>
          {r.name}
        </NavLink>
      );
    } else return false;
  };
  const renderMenuItems = (navs) => {
    return navs.map((r) => {
      if ("path" in r) return renderMenuItem(r);
      else if ("navs" in r) {
        if ((!r.isPrivate || user.AuthToken) && r.isMenu) {
          return (
            <NavDropdown key={-2} title={r.name}>
              {r.navs.map((item) => {
                return renderDropdownMenuItem(item);
              })}
            </NavDropdown>
          );
        } else return false;
      } else return false;
    });
  };

  return (
    <header>
      <Navbar
        bg='success'
        expand='sm'
        className='p-3 mb-4 navbar-dark'
        sticky='top'
      >
        <Navbar.Brand>
          <Link className='navbar-brand' to='/'>
            ESZUT
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='w-100'>
            {renderMenuItems(nav)}

            {user.AuthToken ? (
              <NavLink
                key={0}
                to={"#"}
                className='nav-link ms-sm-auto'
                onClick={logout}
              >
                Wyloguj
              </NavLink>
            ) : (
              <NavLink
                key={-1}
                to={urls.client.login}
                className='nav-link ms-sm-auto'
              >
                Zaloguj się do PA
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};
