import { Helmet } from 'react-helmet-async';
// sections
import FlightsView from 'src/sections/flights/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Two</title>
      </Helmet>

      <FlightsView />
    </>
  );
}
