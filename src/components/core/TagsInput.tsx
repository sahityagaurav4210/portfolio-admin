import React, { useState } from "react";
import { Box, Button, Chip, InputAdornment, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Sell } from "@mui/icons-material";
import useAppCss from "../../hooks/useAppCss";
import { ITagsInput } from "../../interfaces/component_props.interface";

/**
 * TagsInput — lets users type a tag, click "Add", and see chips appear.
 *
 * Props:
 *   tags        – string[]  current tag list (controlled)
 *   onAddTag    – (tag: string) => void
 *   onRemoveTag – (tag: string) => void
 *   disabled    – boolean
 */
function TagsInput({ tags = [], onAddTag, onRemoveTag, disabled = false, isRequired = false }: Readonly<ITagsInput>) {
  const [input, setInput] = useState("");
  const { GlobalChipCss, RequiredFieldCss } = useAppCss();

  const handleAdd = () => {
    if (!input.trim()) return;
    onAddTag(input.trim().toUpperCase());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow pressing Enter to add a tag
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Input row */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          width: "100%",
          my: 1,
        }}
      >
        <TextField
          label="Add a tag"
          placeholder="e.g. Engineering"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Sell fontSize="small" color="primary" />
                </InputAdornment>
              ),
            },
          }}
          required={isRequired}
          sx={RequiredFieldCss}
          helperText="Press ENTER key to add a tag. Only numbers, alphabets, spaces and special characters like dash (-), forward slash (/) are allowed."
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={disabled || !input.trim()}
          startIcon={<AddIcon fontSize="small" />}
          sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
          size="small"
        >
          Add Tag
        </Button>
      </Box>

      {/* Chip list — only shown when tags exist */}
      {tags.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={disabled ? undefined : () => onRemoveTag(tag)}
              sx={{ ...GlobalChipCss, mr: 0.54 }}
              color="success"
              variant="outlined"
              icon={<Sell fontSize="small" color="success" />}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default React.memo(TagsInput);
