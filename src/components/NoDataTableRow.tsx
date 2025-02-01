import { TableCell, TableRow } from '@mui/material'
import { ReactNode } from 'react'
import { INoDataTableRow } from '../interfaces/component_props.interface'

function NoDataTableRow({ colspan, text }: INoDataTableRow): ReactNode {
  return (
    <>
      <TableRow>
        <TableCell colSpan={colspan} align='center'>{text}</TableCell>
      </TableRow>
    </>
  )
}

export default NoDataTableRow