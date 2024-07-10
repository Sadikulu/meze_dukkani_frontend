export const Stars = () => {
  return [1, 2, 3, 4, 5].map((value) => (
    <option key={value} value={value}>
      {"★ ".repeat(value)}
    </option>
  ));
};
