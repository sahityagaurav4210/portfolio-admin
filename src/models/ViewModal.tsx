import { memo, ReactNode, useCallback, useState } from "react";
import { IViewDialogProp } from "../interfaces/component_props.interface";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Cancel, ListAlt, Visibility, VisibilityOff } from "@mui/icons-material";
import Heading from "../components/Heading";
import AppImage from "../components/AppImage";
import { BtnClick } from "../interfaces";
import { Grid } from "@mui/system";

function ViewModal({ open, handleDialogCloseBtnClick, details }: Readonly<IViewDialogProp>): ReactNode {
  const theme = useTheme();
  const [showDesc, setShowDesc] = useState(false);

  const handleShowDescBtn = useCallback(
    function (e: BtnClick) {
      e.preventDefault();
      setShowDesc((prev) => !prev);
    },
    [showDesc]
  );

  return (
    <Dialog maxWidth="lg" fullWidth open={open}>
      <DialogTitle>
        <Box component="div" className="flex justify-end">
          <IconButton onClick={handleDialogCloseBtnClick}>
            <Cancel fontSize="medium" color="error" />
          </IconButton>
        </Box>

        <Heading Icon={ListAlt} text="Your skill" />
      </DialogTitle>

      <DialogContent sx={{ borderTop: `1px solid ${theme.palette.secondary.A100}` }}>
        <Box component="div" className="flex justify-end my-2">
          <Button
            variant="contained"
            startIcon={showDesc ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            onClick={handleShowDescBtn}
          >
            {showDesc ? "Hide description" : "Show description"}
          </Button>
        </Box>

        <Grid container columnSpacing={1} rowSpacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField label="Name" value={details?.name.toUpperCase()} disabled fullWidth />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField label="Experience (in months)" value={details?.experience} disabled fullWidth />
          </Grid>
        </Grid>

        {showDesc && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              fontWeight={700}
              className="underline underline-offset-2 uppercase decoration-wavy"
              color="primary"
            >
              Description
            </Typography>
            <Box component="div" className="flex items-center justify-evenly gap-x-2 flex-wrap md:flex-nowrap">
              <AppImage url={details?.url || "/404.jpg"} width="128px" height="128px" />
              <Box
                component="div"
                dangerouslySetInnerHTML={{ __html: details?.description }}
                className="text-justify"
              ></Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default memo(ViewModal);
