import React from "react";
import { settings } from "../../../helpers/setting";

const Map = () => {
  return (
    <div className="mb-5">
      <iframe
        title={settings.siteName}
        src={settings.mapEmbedUrl}
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
