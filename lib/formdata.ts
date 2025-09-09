export const parseFormData = (formData: FormData) => {
  return Array.from(formData.entries()).reduce((acc, [key, value]) => {
    if (value instanceof File) {
      Object.assign(acc, { [key]: value });
    } else {
      try {
        Object.assign(acc, { [key]: JSON.parse(value) });
      } catch {
        Object.assign(acc, { [key]: value });
      }
    }

    return acc;
  }, {});
};
