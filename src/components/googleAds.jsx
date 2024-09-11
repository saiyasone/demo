import React, { useEffect } from "react";

function GoogleAds() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div>
        <h2>Google ads</h2>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7931814511159648"
        data-ad-slot="9909598547"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

export default GoogleAds;
