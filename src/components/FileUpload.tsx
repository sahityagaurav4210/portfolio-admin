import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import { CloudUpload, UploadFile } from "@mui/icons-material";

export interface IFileUploadProps {
  /** Called whenever the selected file changes (null = cleared) */
  onFileChange: (file: File | null) => void;
  /**
   * Called with `false` while the upload simulation is running,
   * and `true` once it completes. Use this to gate form submission.
   */
  onReadyChange?: (isReady: boolean) => void;
  /** MIME type or file extension filter, e.g. "image/*" or ".pdf" */
  accept?: string;
  /** Maximum allowed file size in MB (default: 5) */
  maxSizeMB?: number;
  /** Disable all interaction */
  disabled?: boolean;
  /** Label shown below the cloud icon */
  label?: string;
  /**
   * Optional deep-validation callback (e.g. magic-byte check).
   * Return false to reject the file with a generic error message,
   * or throw an Error with a custom message.
   */
  validateFile?: (file: File) => Promise<boolean>;
  /** Custom error message shown when validateFile returns false */
  validateErrorMessage?: string;
}

function FileUpload({
  onFileChange,
  onReadyChange,
  accept = "*",
  maxSizeMB = 5,
  disabled = false,
  label = "Drag and drop or click to browse",
  validateFile,
  validateErrorMessage = "Invalid file format.",
}: Readonly<IFileUploadProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileProgress, setFileProgress] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function simulateProgress(file: File) {
    setSelectedFile(file);
    setIsSimulating(true);
    setFileProgress(0);
    onFileChange(file);
    onReadyChange?.(false);

    const duration = 1350;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        clearInterval(timer);
        setFileProgress(100);
        setIsSimulating(false);
        onReadyChange?.(true);
      } else {
        setFileProgress(current);
      }
    }, intervalTime);
  }

  async function processFile(file: File) {
    setValidationError(null);

    if (validateFile) {
      try {
        const isValid = await validateFile(file);
        if (!isValid) {
          setValidationError(validateErrorMessage);
          if (inputRef.current) inputRef.current.value = "";
          return;
        }
      } catch (err: any) {
        setValidationError(err?.message ?? validateErrorMessage);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    simulateProgress(file);
  }

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file) await processFile(file);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0] ?? null;
    if (file) await processFile(file);
  }

  function handleZoneClick() {
    if (!disabled) inputRef.current?.click();
  }

  const isOversized = selectedFile
    ? selectedFile.size / (1024 * 1024) > maxSizeMB
    : false;

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleZoneClick}
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
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        "&:hover": { bgcolor: disabled ? "#dce8f8" : "#cdddf5" },
      }}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleInputChange}
        disabled={disabled}
      />

      {/* Cloud icon */}
      <CloudUpload sx={{ fontSize: 72, color: "primary.main" }} />

      {/* Upload button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={disabled}
        startIcon={
          disabled ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <UploadFile fontSize="small" />
          )
        }
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        sx={{
          borderRadius: 8,
          py: 1.2,
          fontWeight: 700,
          fontSize: "1rem",
          maxWidth: 320,
        }}
      >
        {disabled ? "Uploading..." : "Upload"}
      </Button>

      {/* Hint + file info */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={0.5}
        width="100%"
      >
        <Typography variant="body2" color="primary" fontWeight={500}>
          {label}
        </Typography>

        {isSimulating && (
          <Box
            mt={1}
            width="100%"
            maxWidth={320}
            display="flex"
            flexDirection="column"
            gap={0.5}
          >
            <LinearProgress
              variant="determinate"
              value={fileProgress}
              sx={{ borderRadius: 2, height: 6 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
              textAlign="center"
            >
              Processing... {Math.round(fileProgress)}%
            </Typography>
          </Box>
        )}

        {!isSimulating && selectedFile && (
          <Box mt={1} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Selected file: {selectedFile.name}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={500}
              color={isOversized ? "error" : "text.secondary"}
            >
              File Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            {isOversized && (
              <Typography variant="caption" color="error" fontWeight={700}>
                File exceeds maximum allowed size ({maxSizeMB} MB)
              </Typography>
            )}
          </Box>
        )}

        {validationError && (
          <Typography variant="caption" color="error" fontWeight={700} mt={0.5}>
            {validationError}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default FileUpload;
