import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// main routes
const HubView = lazy(() => import('src/pages/dashboard/hub'));
const FlightPlanView = lazy(() => import('src/pages/dashboard/flightplan'));
const MyCareerView = lazy(() => import('src/pages/dashboard/mycareer'));
// new routes
const FlightsView = lazy(() => import('src/pages/dashboard/flights'));
const RoutesView = lazy(() => import('src/pages/dashboard/routes'));
const CareerPathView = lazy(() => import('src/pages/dashboard/careerpath'));
const UserAchievementsView = lazy(() => import('src/pages/dashboard/userachievements'));



//Admin routes
const UsersView = lazy(() => import('src/pages/dashboard/users'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));


//New main
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
// new routes
        { path: 'flights', element: <FlightsView /> },
        { path: 'routes', element: <RoutesView /> },
        { path: 'careerpath', element: <CareerPathView /> },
        { path: 'userachievements', element: <UserAchievementsView /> },
//Admin routes
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
