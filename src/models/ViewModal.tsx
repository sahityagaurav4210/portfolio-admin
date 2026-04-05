import { memo, ReactNode } from "react";
import { IViewDialogProp } from "../interfaces/component_props.interface";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { Close, Edit, Palette } from "@mui/icons-material";
import AppImage from "../components/AppImage";
import useAppHelperFn from "../hooks/useAppHelperFn";
import ModalHeading from "../components/headings/ModalHeading";
import ModalCloseButton from "../components/styled/ModalCloseButton";

function ViewModal({
  open,
  handleDialogCloseBtnClick,
  details,
  onEditHandler,
}: Readonly<IViewDialogProp>): ReactNode {
  const { getResourceUrl } = useAppHelperFn();
  const imageUrl = getResourceUrl(details?.url);

  const experienceYears = details?.experience
    ? (Number(details.experience) / 12).toFixed(1).replace(/\.0$/, "")
    : "—";

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
      slotProps={{ paper: { sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" } } }}
    >
      <Box display="flex" justifyContent="flex-end" p={1}>
        <ModalCloseButton onClick={handleDialogCloseBtnClick}>
          <Close fontSize="small" />
        </ModalCloseButton>
      </Box>

      {/* ── Header ── */}
      <DialogTitle sx={{ pb: 1.5 }}>
        <ModalHeading text="Your Skill" Icon={Palette} />
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Box display="flex" gap={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden", mb: 3 }}>
          {/* Years of experience */}
          <Box sx={{ flex: 1, px: 2.5, py: 2, borderRight: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Experience
            </Typography>

            <Box display="flex" alignItems="baseline" gap={0.5}>
              <Typography variant="h4" fontWeight={700} lineHeight={1}>
                {experienceYears}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Years
              </Typography>
            </Box>
          </Box>

          {/* Skill Name */}
          <Box sx={{ flex: 1, px: 2.5, py: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Skill Name
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{ color: "text.primary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              <Typography variant="h4" fontWeight={700}>
                {details?.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── Description ── */}
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
          Description
        </Typography>

        <Box
          sx={{
            border: "1.5px solid",
            borderColor: "warning.A100",
            borderRadius: 2,
            bgcolor: "warning.A100",
            p: 2,
          }}
        >
          {/* Skill image + name */}
          <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
            <AppImage url={imageUrl} width="56px" height="56px" />
          </Box>

          {/* Rich text description */}
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: details?.description ?? "" }}
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.7,
              color: "text.primary",
              textAlign: "justify",
              "& strong, & b": { fontWeight: 700 },
              "& a": { color: "warning.main" },
            }}
          />
        </Box>
      </DialogContent>

      <Divider />

      {/* ── Footer ── */}
      <DialogActions>
        {onEditHandler && (
          <Button
            variant="contained"
            color="success"
            startIcon={<Edit fontSize="small" />}
            onClick={onEditHandler}
            sx={{ fontWeight: 700 }}
          >
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default memo(ViewModal);
