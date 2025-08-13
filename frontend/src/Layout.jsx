
import { CustomNav } from './components/CustomNav.jsx';
import {Outlet} from 'react-router-dom';
export const Layout = () => {
  return (
    <div>
        <CustomNav />
        <Outlet />    
    </div>
  )
}
