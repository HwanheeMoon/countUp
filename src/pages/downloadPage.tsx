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

   const beforeInstallPromptHandler = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();

      setDeferredPrompt(event);
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

   const installApp = () => {
      if (deferredPrompt) {
         deferredPrompt?.prompt();
      } else {
         alert("이미 프로그램이 깔려 있어요.");
      }
   };

   return (
      <div className="h-screen items-center py-96">
         <button className="btn btn-primary" onClick={installApp}>
            앱 설치하기
         </button>
      </div>
   );
};
