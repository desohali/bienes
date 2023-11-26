import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup } from '@mui/material';
import Catalogo_Nacional from '../Catalogo_Nacional.json'; // Ruta relativa al archivo JSON

export default function MediaCard({ row, callback }) {

  const bien = Catalogo_Nacional.find(({ Codigo }) => Codigo == row.codigo);
  return (
    <Card sx={{ width: "100%" }}>
      {/* <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      /> */}
      <CardContent>
        <Typography gutterBottom variant="p" component="div">
          {bien ? bien.label : ""}
        </Typography>
        {Object.entries(row).slice(1).map(([key, value]) => {
          return <Typography variant="body2" color="text.secondary">{`${key} : ${value} `}</Typography>
        })}

      </CardContent>
      <CardActions>
        <ButtonGroup size="small" variant="outlined" aria-label="outlined primary button group">
          <Button variant="outlined" size="small" onClick={() => {
            callback({ ...row, _id: '' });
          }}>Clonar</Button>
          <Button variant="outlined" size="small" onClick={() => {
            callback(row);
          }}>Editar</Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}