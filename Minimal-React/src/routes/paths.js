// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    hub: `${ROOTS.DASHBOARD}/hub`,
    flightplan: `${ROOTS.DASHBOARD}/flightplan`,
    mycareer: `${ROOTS.DASHBOARD}/mycareer`,
    flights: `${ROOTS.DASHBOARD}/flights`,
    routes: `${ROOTS.DASHBOARD}/routes`,
    careerpath: `${ROOTS.DASHBOARD}/careerpath`,
    userachievements: `${ROOTS.DASHBOARD}/userachievements`,
    user: `${ROOTS.DASHBOARD}/user`,
    admin: {
      root: `${ROOTS.DASHBOARD}/admin`,
      users: `${ROOTS.DASHBOARD}/admin/users`,
      five: `${ROOTS.DASHBOARD}/admin/five`,
      six: `${ROOTS.DASHBOARD}/admin/six`,
    },
  },
};
