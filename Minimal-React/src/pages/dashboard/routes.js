import { Helmet } from 'react-helmet-async';
// sections
import RoutesView from 'src/sections/routes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Two</title>
      </Helmet>

      <RoutesView />
    </>
  );
}
