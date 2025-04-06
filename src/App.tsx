import { Outlet } from 'react-router-dom';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { AppBranding, AppNav, AppTheme } from './configs/app.config';

function App() {
  return (
    <>
      <ReactRouterAppProvider navigation={AppNav} branding={AppBranding} theme={AppTheme} >
        <Outlet />
      </ReactRouterAppProvider>
    </>
  );
}

export default App;
