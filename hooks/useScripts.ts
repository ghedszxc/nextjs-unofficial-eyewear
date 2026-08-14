import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IScript } from "../models/IScript";

const useScripts = (
  scripts: IScript[],
  forceClean?: boolean
): [loadScripts: () => void, loaded: boolean] => {
  const router = useRouter();
  const pathname = usePathname();

  const [initiated, setInitiated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadScripts = () => {
    // Load all scripts only once
    if (initiated) return;
    setInitiated(true);

    const scriptExists = (script: IScript) => {
      return script?.id
        ? document.getElementById(script?.id)
        : script?.src
        ? document.querySelector(`script[src="${script?.src}"]`)
        : false;
    };

    const getNewScript = (script: IScript) => {
      const newScript = document.createElement("script");
      if (script?.src) newScript.src = script.src;
      if (script?.type) newScript.type = script.type;
      if (script?.id) newScript.id = script.id;
      if (script?.async) newScript.async = script.async;
      if (script?.defer) newScript.defer = script.defer;
      if (script?.innerHTML) newScript.innerHTML = script.innerHTML;
      return newScript;
    };

    const load = (script: IScript) => {
      if (!scriptExists(script)) {
        const newScript = getNewScript(script);
        if (script?.head) {
          document.head.appendChild(newScript);
        } else {
          document.body.appendChild(newScript);
        }
      }
    };

    const loadSequentially = (scripts: IScript[], index: number = 0) => {
      if (index >= scripts.length) {
        // All scripts are loaded
        setLoaded(true);
        return;
      }

      const script = scripts[index];
      if (!scriptExists(script)) {
        const newScript = getNewScript(script);
        newScript.onload = () => {
          // Current script loaded, proceed to next script
          loadSequentially(scripts, index + 1);
        };

        if (script?.head) {
          document.head.appendChild(newScript);
        } else {
          document.body.appendChild(newScript);
        }
      }
    };

    const filteredScripts = scripts.filter(
      (script: IScript) => script?.src || script?.innerHTML
    );
    const unqueuedScripts = filteredScripts.filter(
      (script: IScript) => !script?.queue
    );
    const queuedScripts = filteredScripts.filter(
      (script: IScript) => script?.queue
    );

    unqueuedScripts.forEach((script: IScript) => {
      load(script);
    });

    if (queuedScripts.length > 0) {
      loadSequentially(queuedScripts);
    } else {
      // All scripts are loaded since there is nothing queued
      setLoaded(true);
    }
  };

  useEffect(() => {
    return () => {
      window.location.reload()
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      // Remove scripts on unmount
      scripts.forEach((script: IScript) => {
        if (script?.preserve) return;
        const currentScript = document.querySelector(
          `script[src="${script.src}"]`
        );
        if (currentScript) {
          currentScript.remove();
        }
      });
    };
  }, []);

  return [loadScripts, loaded];
};

export default useScripts;
