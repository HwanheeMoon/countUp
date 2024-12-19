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
   const [deferredPrompt, setDeferredPrompt] =
      useState<BeforeInstallPromptEvent | null>(null);

   const beforeInstallPromptHandler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
   };

   useEffect(() => {
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
      if (!deferredPrompt) {
         return;
      }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
         console.log("success");
      } else {
         console.log("user dismissed");
      }
      setDeferredPrompt(null);
   };

   return (
      <div className="h-screen items-center py-96">
         <button className="btn btn-primary" onClick={installApp}>
            앱 설치하기
         </button>
      </div>
   );
};
