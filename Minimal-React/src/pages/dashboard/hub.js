import { Helmet } from 'react-helmet-async';
import HubView from 'src/sections/hub/view';
import BlankTable from 'src/jmltempates/GenericTable';  // <-- make sure the path is correct

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: One</title>
      </Helmet>
      <HubView />
    </>
  );
}
