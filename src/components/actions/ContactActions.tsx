import React, { ReactNode, useState } from "react";
import { IContactActionsProp } from "../../interfaces/component_props.interface";
import { Box, Fab } from "@mui/material";
import { LocationOn, Visibility } from "@mui/icons-material";
import IPLocModal from "../../models/IPLocModal";

function ContactActions({ row, handleViewBtnClick }: Readonly<IContactActionsProp>): ReactNode {
  const [clientIp, setClientIp] = useState<string>("");
  const [ipLocDialogOpen, setIpLocDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Box component="div" display="flex" columnGap={1}>
        <Fab color="primary" size="small" onClick={() => handleViewBtnClick(row?.original?.id)}>
          <Visibility fontSize="small" />
        </Fab>

        <Fab
          color="warning"
          size="small"
          onClick={() => {
            setClientIp(row?.original?.ipAddress);
            setIpLocDialogOpen(true);
          }}
        >
          <LocationOn fontSize="small" />
        </Fab>
      </Box>

      {ipLocDialogOpen && (
        <IPLocModal clientIp={clientIp} handleModalOnClose={() => setIpLocDialogOpen(false)} isOpen={ipLocDialogOpen} />
      )}
    </>
  );
}

export default React.memo(ContactActions);
