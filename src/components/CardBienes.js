import * as React from 'react';
import MediaCard from './MediaCard';
import { Grid } from '@mui/material';

export default function CardBienes({ rows = [], callback = (d) => { } }) {
  return (
    <Grid container spacing={1}>
      {rows.map((row, i) => (
        <Grid item xs={6} sm={6} md={4} lg={3}>
          <MediaCard row={row} callback={callback} />
        </Grid>
      ))}
    </Grid>
  );
}
