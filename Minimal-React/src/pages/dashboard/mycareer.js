import { Helmet } from 'react-helmet-async';
// sections
import MyCareerView from 'src/sections/mycareer/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Three</title>
      </Helmet>

      <MyCareerView/>
    </>
  );
}
