import React, { useEffect, useState } from "react";

function Dir() {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://ws1.soc.com.br/WebSoc/exportadados?parametro={%22empresa%22:%22173058%22,%22codigo%22:%22195505%22,%22chave%22:%228169689d8ec403e45ae5%22,%22tipoSaida%22:%22html%22}');
      const html = await response.text();
      setHtmlContent(html);
    }
    fetchData();
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export default Dir;
