import { ISkillForm } from "../interfaces/models.interface";

function useAppTextfieldValue() {
  const editSkillModalTextfields = function (skillData: ISkillForm | undefined) {
    return [
      {
        label: "Name",
        name: "name",
        type: "text",
        value: skillData?.name,
        required: true,
        fullWidth: true,
        autoFocus: true,
        helperText: "Only characters, digits and some special characters are allowed.",
        size: { xs: 12, md: 6 },
        sx: { mt: 1 },
      },
      {
        label: "Experience (in months)",
        name: "experience",
        type: "number",
        value: skillData?.experience,
        required: true,
        fullWidth: true,
        autoFocus: false,
        helperText: "Only positive natural numbers are allowed. Please enter the amount in months.",
        size: { xs: 12, md: 6 },
        sx: { mt: { xs: 0, md: 1 } },
      },

    ];
  };

  return { editSkillModalTextfields };
}

export default useAppTextfieldValue;
