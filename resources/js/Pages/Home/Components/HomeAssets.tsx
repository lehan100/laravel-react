import { useEffect } from 'react';

const templateAssetVersion = '20260507-wrapper-deal';

const templateScripts = [
  { id: 'home-template-core-js', src: `/home-template/js/core.min.js?v=${templateAssetVersion}` },
  { id: 'home-template-main-js', src: `/home-template/js/main.min.js?v=${templateAssetVersion}` },
];

export default function HomeAssets() {
  useEffect(() => {
    templateScripts.forEach((scriptConfig) => {
      document.getElementById(scriptConfig.id)?.remove();
    });

    const loadScript = (scriptConfig: (typeof templateScripts)[number], onLoad?: () => void): void => {
      const script = document.createElement('script');
      script.id = scriptConfig.id;
      script.src = scriptConfig.src;
      script.async = false;

      if (onLoad) {
        script.onload = onLoad;
      }

      document.body.appendChild(script);
    };

    loadScript(templateScripts[0], () => loadScript(templateScripts[1]));
  }, []);

  return null;
}
