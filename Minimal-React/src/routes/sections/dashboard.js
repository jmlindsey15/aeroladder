import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const HubView = lazy(() => import('src/pages/dashboard/hub'));
const FlightPlanView = lazy(() => import('src/pages/dashboard/flightplan'));
const MyCareerView = lazy(() => import('src/pages/dashboard/mycareer'));
const UsersView = lazy(() => import('src/pages/dashboard/users'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <HubView />, index: true },
      { path: 'hub', element: <HubView /> },
      { path: 'flightplan', element: <FlightPlanView /> },
      { path: 'mycareer', element: <MyCareerView /> },
      {
        path: 'admin',
        children: [
          { element: <UsersView />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
