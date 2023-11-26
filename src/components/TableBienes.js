import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, ButtonGroup } from '@mui/material';


export default function TableBienes({ rows = [], callback = (d) => { } }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {Object.keys((rows[0] || [])).slice(1).map((titulo) => {
              return <TableCell key={titulo} align="center">{titulo == "numeroEtiqueta" ? "# etiqueta" : titulo}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {Object.entries(row).slice(1).map(([key, value]) => {
                let minWidth = "inherit";
                if (key == "dependencia") {
                  minWidth = "200px";
                } else if (key == "responsable") {
                  minWidth = "120px";
                }
                return <TableCell style={{ minWidth: minWidth }} key={key} align="center">{value}</TableCell>
              })}
              <TableCell align="right">
                <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                  <Button variant="outlined" size="small" onClick={() => {
                    callback({ ...row, _id: '' });
                  }}>Clonar</Button>
                  <Button variant="outlined" size="small" onClick={() => {
                    callback(row);
                  }}>Editar</Button>
                </ButtonGroup>

              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
