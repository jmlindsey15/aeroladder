import { Helmet } from 'react-helmet-async';
import OneView from 'src/sections/one/view';
import BlankTable from 'src/jmltempates/blankTable';  // <-- make sure the path is correct

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: One</title>
      </Helmet>
      <OneView />
    </>
  );
}
