import { memo, ReactNode } from "react";
import { IViewProjectDialogProp } from "../../interfaces/component_props.interface";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { AccountTree, Close, Code, Description, Edit, Launch, Sell } from "@mui/icons-material";
import AppImage from "../../components/AppImage";
import useAppHelperFn from "../../hooks/useAppHelperFn";
import ModalHeading from "../../components/headings/ModalHeading";
import ModalCloseButton from "../../components/styled/ModalCloseButton";
import useAppCss from "../../hooks/useAppCss";
import { getProjectPriorityLabel } from "../../constants";


function ViewProjectModal({
  open,
  handleDialogCloseBtnClick,
  details,
  onEditHandler,
}: Readonly<IViewProjectDialogProp>): ReactNode {
  const theme = useTheme();
  const { getResourceUrl } = useAppHelperFn();
  const { GlobalChipCss } = useAppCss();
  const imageUrl = getResourceUrl(details?.cardImage);

  const isPersonal = details?.type?.toLowerCase() === "personal";

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
        <ModalHeading text="Project Details" Icon={AccountTree} />
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {/* ── Top Summary Box ── */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            p: 2,
            mb: 3,
            bgcolor: "background.paper",
          }}
        >
          {/* Card Image preview */}
          {details?.cardImage && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: { xs: "100%", md: 240 },
                maxHeight: 180,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "action.hover",
              }}
            >
              <AppImage url={imageUrl} width="100%" height="auto" />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1.5, flexDirection: "column" }}>
            <Box>
              <Box display="flex" justifyContent="center" flexDirection="column" flexWrap="wrap" gap={1} mb={0.5}>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {details?.name}
                </Typography>

                <Box>
                  <Chip
                    label={isPersonal ? "Personal" : "Professional"}
                    color={isPersonal ? "primary" : "secondary"}
                    size="small"
                    variant="filled"
                    sx={{ fontWeight: 600, textTransform: "capitalize", mr: 1 }}
                  />

                  {details?.projectDomain && (
                    <Chip
                      label={`Domain: ${details.projectDomain}`}
                      color="info"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, textTransform: "capitalize", mx: 1 }}
                    />
                  )}

                  {details?.priority !== undefined && (
                    <Chip
                      label={`Priority: ${getProjectPriorityLabel(details.priority)}`}
                      color="default"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, mx: 1 }}
                    />
                  )}


                  {details?.ongoing && (
                    <Chip
                      label="Ongoing"
                      color="warning"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, mx: 1 }}
                    />
                  )}

                  {details?.disabled && (
                    <Chip
                      label="Disabled"
                      color="error"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, mx: 1 }}
                    />
                  )}
                </Box>

                {details?.note && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mt: 0.5 }}>
                    <strong>Note:</strong> {details.note}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Links */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {details?.liveLink && (
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  startIcon={<Launch fontSize="small" />}
                  href={details.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Live Demo
                </Button>
              )}
              {details?.codeLink && (
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<Code fontSize="small" />}
                  href={details.codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Source Code
                </Button>
              )}
              {details?.documentation_link && (
                <Button
                  variant="outlined"
                  size="small"
                  color="info"
                  startIcon={<Description fontSize="small" />}
                  href={details.documentation_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Documentation
                </Button>
              )}
            </Stack>
          </Box>
        </Box>

        {/* ── Tech Stack ── */}
        {details?.tech_stack && details.tech_stack.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
              Tech Stack
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {details.tech_stack.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  color="success"
                  variant="outlined"
                  icon={<Sell fontSize="small" color="success" />}
                  sx={GlobalChipCss}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* ── Project Description (Rich Text) ── */}
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
          Project Details / Overview
        </Typography>

        <Box
          sx={{
            border: "1.5px solid",
            borderColor: "warning.A100",
            borderRadius: 2,
            bgcolor: "warning.A100",
            p: 2.5,
          }}
        >
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: details?.text ?? "<p>No description provided.</p>" }}
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.7,
              color: "text.primary",
              textAlign: "justify",
              "& strong, & b": { fontWeight: 700 },
              "& a": { color: theme.palette.primary.main, textDecoration: "underline" },
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
            sx={{ fontWeight: 700, color: "white" }}
          >
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default memo(ViewProjectModal);
