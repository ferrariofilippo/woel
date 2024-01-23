export type DropDownField = {
  label: string;
  value: number;
};
export const formatDropdownLabels = (
  data: any,
  label: string,
  value: string
): DropDownField[] => {
  let ret = [];
  if (data) {
    ret = data.map((item: any) => {
      return {
        label: item[label],
        value: item[value],
      };
    });
  }
  return ret;
};
