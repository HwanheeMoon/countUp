import React, { useEffect, useState } from "react";

export const DownloadPage = () => {
   let deferredPrompt;

   window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;
   });

   const installApp = () => {
      if (!deferredPrompt) {
         alert("이미 앱이 설치되어 있거나 앱을 설치할 수 없는 환경입니다");
         return;
      }

      deferredPrompt.prompt();
   };

   return (
      <div className="h-screen items-center py-96">
         <button className="btn btn-primary" onClick={installApp}>
            앱 설치하기
         </button>
      </div>
   );
};
