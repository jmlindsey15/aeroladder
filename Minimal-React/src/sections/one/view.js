// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomTable from '/Users/mitchell/Repos/aeroladder/Minimal-React/src/jmltempates/blankTable.js';
import SimpleLayout from '/Users/mitchell/Repos/aeroladder/Minimal-React/src/layouts/simple';
// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const tableName = "users";  // Define table name at the top

  // Utility function to capitalize and remove underscores
  const formatTitle = (str) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
    return (
<SimpleLayout> {/* Wrapping your content inside the SimpleLayout */}
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography variant="h4">{`Page for ${formatTitle(tableName)}`}</Typography> {/* Using the table name in the title */}

        <Box
            sx={{
                mt: 5,
                width: 1,
                height: 320,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                border: (theme) => `dashed 1px ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CustomTable tableName={tableName} /> {/* Passing the table name to CustomTable */}
        </Box>
      </Container>
    </SimpleLayout>
  );
}
