import React, { useEffect, useState } from "react";
declare global {
   interface WindowEventMap {
      beforeinstallprompt: BeforeInstallPromptEvent;
   }
}

interface BeforeInstallPromptEvent extends Event {
   readonly platforms: Array<string>;
   readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
   }>;
   prompt(): Promise<void>;
}

export const DownloadPage = () => {
   const [isShown, setIsShown] = useState(false);
   const [isIOS, setIsIOS] = useState(false);
   const [deferredPrompt, setDeferredPrompt] =
      useState<BeforeInstallPromptEvent | null>(null);

   const beforeInstallPromptHandler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsShown(true);
   };

   useEffect(() => {
      const isDeviceIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
      setIsIOS(isDeviceIOS);

      window.addEventListener(
         "beforeinstallprompt",
         beforeInstallPromptHandler
      );

      return () => {
         window.removeEventListener(
            "beforeinstallprompt",
            beforeInstallPromptHandler
         );
      };
   }, []);

   const installApp = async () => {
      setIsShown(false);
      if (!deferredPrompt) {
         return;
      }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(outcome);
      setDeferredPrompt(null);
   };

   if (!isIOS && !isShown) {
      return null;
   }

   return (
      <div className="h-screen items-center py-96">
         <button className="btn btn-primary" onClick={installApp}>
            앱 설치하기
         </button>
      </div>
   );
};
