import { Helmet } from 'react-helmet-async';
// sections
import CareerPathView from "../../sections/careerpath/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Two</title>
      </Helmet>

      <CareerPathView/>
    </>
  );
}
