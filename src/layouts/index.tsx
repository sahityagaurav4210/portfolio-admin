import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Footer from '../views/Footer';
import { Box, } from '@mui/material';

export default function Layout() {
  return (
    <>
      <DashboardLayout defaultSidebarCollapsed sidebarExpandedWidth={220} sx={{
        '& .Toolpad_Breadcrumbs-root': {
          display: 'none',
        },
      }}>
        <PageContainer>
          <Outlet />
        </PageContainer>

        <Box>
          <Footer />
        </Box>
      </DashboardLayout>

    </>
  );
}
