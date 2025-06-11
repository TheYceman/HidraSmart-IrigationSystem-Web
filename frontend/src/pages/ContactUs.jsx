import { useEffect, useState } from "react";
function ContactUs() {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      fetch("/api/contactUsResources", {
        credentials: "include",
      })
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }, []);

    useEffect(() => {
        if (!data) return;
    
        const scriptUrls = [
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
          "https://www.google.com/recaptcha/enterprise.js?render=6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX",
          "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
          "https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/scripts/base.js",
          "https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/scripts/common-funtions-forms.js",
          "/scripts/login-header-image.js",
          "/scripts/login.js",
        ];
    
        const loadScript = (src) =>
          new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
    
        const loadAllScripts = async () => {
          for (const src of scriptUrls) {
            try {
              await loadScript(src);
            } catch (err) {
              console.error("Error cargando script:", src, err);
            }
          }
        };
    
        loadAllScripts();
    
        return () => {
          scriptUrls.forEach((src) => {
            const script = Array.from(document.scripts).find((s) => s.src === src);
            if (script) document.body.removeChild(script);
          });
        };
      }, [data]);

}

export default ContactUs;