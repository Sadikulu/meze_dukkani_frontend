import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminPageTitle = ({ titleEdit }) => {
  const location = useLocation();
  const path = location.pathname
    .split("/")
    .filter((part) => part !== "")
    .map((part) => {
      const words = part.split("-");
      const capitalizedWords = words.map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      );
      return capitalizedWords.join(" ");
    });
  const [title, titleLink, titleNew] = path.map(
    (part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`
  );

  const styles = {
    adminPageTitle: {
      fontWeight: 400,
    },
  };

  const renderLink = (to, text) => (
    <Link className="text-decoration-none" to={to}>
      {text}
    </Link>
  );

  return (
    <h6 style={styles.adminPageTitle}>
      {renderLink("/admin", "Dashboard")}
      {" > "}
      <span>{title.replace("Admin", "")}</span>
      {titleLink && renderLink(`/admin/${titleLink}`, titleLink)}
      {titleEdit && <span>{" > " + titleEdit}</span>}
      {titleNew && !titleEdit && <span>{" > " + titleNew}</span>}
    </h6>
  );
};

export default AdminPageTitle;
