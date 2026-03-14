import React, { ReactNode, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Close, CloudUpload, East, UploadFile } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../../configs/toasts.config";
import { ApiStatus } from "../../api";
import { FilesController } from "../../controllers/files.controller";
import { IUploadCVModalProp } from "../../interfaces/models.interface";

function UploadCVModal({ open, setOpen }: Readonly<IUploadCVModalProp>): ReactNode {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [websites, setWebsites] = useState<string>("");
  const [cvUploading, setCvUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileProgress, setFileProgress] = useState<number>(0);
  const [isFileSimulating, setIsFileSimulating] = useState<boolean>(false);
  const cvInputRef = useRef<HTMLInputElement>(null);

  function handleDialogClose() {
    if (cvUploading) return;
    setOpen(false);
    setCvFile(null);
    setWebsites("");
    if (cvInputRef.current) cvInputRef.current.value = "";
  }

  function simulateProgress(file: File) {
    setCvFile(file);
    setIsFileSimulating(true);
    setFileProgress(0);

    const duration = 1350; // 1.35s
    const intervalTime = 30; // ms per tick
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setFileProgress((prevProgress) => {
        const nextProgress = prevProgress + increment;
        if (nextProgress >= 100) {
          clearInterval(timer);
          setIsFileSimulating(false);
          return 100;
        }
        return nextProgress;
      });
    }, intervalTime);
  }

  // Read the first 4 bytes of the file to verify the "%PDF" magic number (Hex: 25 50 44 46)
  function validatePdfSignature(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        if (!e.target?.result) return resolve(false);
        const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4);
        const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        // 25 50 44 46 is the hex representation of "%PDF"
        resolve(hex === "25504446");
      };
      reader.onerror = () => resolve(false);
      // Read only the first 4 bytes for the signature check
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  }

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      if (file.type !== "application/pdf") {
        toast.warning("Only PDF files are supported.", getGlobalToastConfig());
        if (cvInputRef.current) cvInputRef.current.value = "";
        return;
      }

      const isValidSignature = await validatePdfSignature(file);
      if (!isValidSignature) {
        toast.error("Invalid file format. The file appears to be corrupted or spoofed.", getGlobalToastConfig());
        if (cvInputRef.current) cvInputRef.current.value = "";
        return;
      }

      simulateProgress(file);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;

    if (file) {
      if (file.type !== "application/pdf") {
        toast.warning("Only PDF files are supported.", getGlobalToastConfig());
        return;
      }

      const isValidSignature = await validatePdfSignature(file);
      if (!isValidSignature) {
        toast.error("Invalid file format. The file appears to be corrupted or spoofed.", getGlobalToastConfig());
        return;
      }

      simulateProgress(file);
    }
  }

  async function handleUploadSubmit() {
    if (!cvFile || !websites.trim()) {
      toast.warning("Please fill up the form correctly", getGlobalToastConfig());
      return;
    }

    setCvUploading(true);

    const formData = new FormData();
    formData.append("resume", cvFile);
    formData.append("websites", websites.trim());

    try {
      const controller = new FilesController();
      const reply = await controller.uploadResume(formData);

      if (reply.status === ApiStatus.SUCCESS) {
        toast.success(reply.message, getGlobalToastConfig());
        handleDialogClose();
      } else {
        toast.error(reply.message, getGlobalToastConfig());
      }
    } catch {
      toast.error("Something went wrong while uploading, please try again.", getGlobalToastConfig());
    } finally {
      setCvUploading(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            PDF Document Upload
          </Typography>
          <IconButton size="small" onClick={handleDialogClose} disabled={cvUploading}>
            <Close fontSize="small" color="error" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ bgcolor: "#eef2f7", py: 4, px: 3 }}>
        {/* Drop zone */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !cvUploading && cvInputRef.current?.click()}
          sx={{
            border: "2.5px dashed",
            borderColor: isDragging ? "primary.dark" : "primary.main",
            borderRadius: 4,
            bgcolor: isDragging ? "primary.50" : "#dce8f8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            py: 5,
            px: 3,
            cursor: cvUploading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            "&:hover": { bgcolor: "#cdddf5" },
          }}
        >
          {/* Hidden file input */}
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />

          {/* Cloud icon */}
          <CloudUpload sx={{ fontSize: 72, color: "primary.main" }} />

          {/* Upload button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={cvUploading}
            startIcon={cvUploading ? <CircularProgress size={16} color="inherit" /> : <UploadFile fontSize="small" />}
            onClick={(e) => { e.stopPropagation(); cvInputRef.current?.click(); }}
            sx={{ borderRadius: 8, py: 1.2, fontWeight: 700, fontSize: "1rem", maxWidth: 320 }}
          >
            {cvUploading ? "Uploading..." : "Upload"}
          </Button>

          {/* Hint & Selected File Info */}
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.5} width="100%">
            <Typography variant="body2" color="primary" fontWeight={500}>
              Drag and drop or click to browse
            </Typography>

            {isFileSimulating && (
              <Box mt={1} width="100%" maxWidth={320} display="flex" flexDirection="column" gap={0.5}>
                <LinearProgress variant="determinate" value={fileProgress} sx={{ borderRadius: 2, height: 6 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500} textAlign="center">
                  Processing... {Math.round(fileProgress)}%
                </Typography>
              </Box>
            )}

            {!isFileSimulating && cvFile && (
              <Box mt={1} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Selected file: {cvFile.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight={500}
                  color={(cvFile.size / (1024 * 1024)) > 5 ? "error" : "text.secondary"}
                >
                  File Size: {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
                {(cvFile.size / (1024 * 1024)) > 5 && (
                  <Typography variant="caption" color="error" fontWeight={700}>
                    File exceeds maximum allowed size (5 MB)
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Websites field */}
        <TextField
          label="Website URLs"
          placeholder="Ex: https://sgaurav.me, https://github.com/sgaurav"
          helperText="Enter one or more URLs separated by commas"
          fullWidth
          multiline
          minRows={2}
          value={websites}
          onChange={(e) => setWebsites(e.target.value)}
          disabled={cvUploading}
          sx={{ mt: 3, bgcolor: "transparent" }}
        />

        {/* Constraint notes */}
        <Box mt={1.5} display="flex" flexDirection="column" alignItems="flex-start" gap={0.25}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <East sx={{ fontSize: 12 }} /> Only PDF files are allowed
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <East sx={{ fontSize: 12 }} /> Max allowed file size is 5 MB
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "flex-end", gap: 1 }}>
        <Button variant="outlined" color="error" onClick={handleDialogClose} disabled={cvUploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={
            cvUploading ||
            isFileSimulating ||
            !cvFile ||
            (cvFile.size / (1024 * 1024)) > 5 ||
            !websites.trim()
          }
          startIcon={cvUploading ? <CircularProgress size={16} color="secondary" /> : <CloudUpload fontSize="small" />}
          onClick={handleUploadSubmit}
        >
          {cvUploading ? "Uploading..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(UploadCVModal);
