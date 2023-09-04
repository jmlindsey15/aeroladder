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
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    user: `${ROOTS.DASHBOARD}/user`,
    admin: {
      root: `${ROOTS.DASHBOARD}/admin`,
      users: `${ROOTS.DASHBOARD}/admin/users`,
      five: `${ROOTS.DASHBOARD}/admin/five`,
      six: `${ROOTS.DASHBOARD}/admin/six`,
    },
  },
};
