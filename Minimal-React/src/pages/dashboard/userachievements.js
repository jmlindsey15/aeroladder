import { Helmet } from 'react-helmet-async';
// sections
import UserAchievementsView from "../../sections/userachievements/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Two</title>
      </Helmet>

      <UserAchievementsView/>
    </>
  );
}
