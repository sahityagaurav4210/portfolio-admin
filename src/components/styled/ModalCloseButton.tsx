import { IconButton, styled } from "@mui/material";

const ModalCloseButton = styled(IconButton)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.secondary.A100,
  borderRadius: 5,
  width: 32,
  height: 32,
  "&:hover": {
    backgroundColor: theme.palette.error.main,
    color: "white",
  },
}));

export default ModalCloseButton;