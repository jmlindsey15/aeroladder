import { Helmet } from 'react-helmet-async';
// sections
import FlightPlanView from 'src/sections/flightplan/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Two</title>
      </Helmet>

      <FlightPlanView />
    </>
  );
}
