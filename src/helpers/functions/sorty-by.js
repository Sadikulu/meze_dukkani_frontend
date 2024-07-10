export const handleClickPriceInc = (value, setSortValue, setDirectionValue) => {
  if (value === "lowest") {
    setSortValue("discountedPrice");
    setDirectionValue("ASC");
  } else if (value === "highest") {
    setSortValue("discountedPrice");
    setDirectionValue("DESC");
  } else if (value === "a-z") {
    setSortValue("title");
    setDirectionValue("ASC");
  } else if (value === "z-a") {
    setSortValue("title");
    setDirectionValue("DESC");
  } else if (value === "oldest") {
    setSortValue("createAt");
    setDirectionValue("ASC");
  } else if (value === "newest") {
    setSortValue("createAt");
    setDirectionValue("DESC");
  }
};
