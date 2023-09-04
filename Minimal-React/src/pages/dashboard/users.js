import { Helmet } from 'react-helmet-async';
// sections
import UsersView from 'src/sections/users/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Four</title>
      </Helmet>

      <UsersView />
    </>
  );
}
