import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Howl } from "howler";
import useSound from "use-sound";

const numberToKoreanNative = (num: number): string => {
   if (num < 1 || num > 999) return "지원하지 않는 숫자입니다.";

   const units = ["", "백", "십", ""];
   const nativeNumbers = [
      "",
      "하나",
      "둘",
      "셋",
      "넷",
      "다섯",
      "여섯",
      "일곱",
      "여덟",
      "아홉",
   ];
   const tenPrefixes = [
      "",
      "열",
      "스물",
      "서른",
      "마흔",
      "쉰",
      "예순",
      "일흔",
      "여든",
      "아흔",
   ];

   const digits = String(num).padStart(3, "0").split("").map(Number);

   return digits
      .map((digit, idx) => {
         if (digit === 0) return ""; // 0은 생략

         // 백 단위
         if (idx === 0) return nativeNumbers[digit] + units[idx];
         // 십 단위 (특수 처리)
         if (idx === 1) return tenPrefixes[digit];
         // 일 단위
         return nativeNumbers[digit];
      })
      .join("")
      .replace(/^하나백/, "백"); // '하나백' → '백'
};

export const MainPage = () => {
   const [time, setTime] = useState(3);
   const [count, setCount] = useState(10);
   const [startTimer, setStartTimer] = useState(false);
   const [bpm, setBpm] = useState(20);
   const [start, setStart] = useState(false);
   const [clicked, setClicked] = useState(false);

   const [exeCnt, setExeCnt] = useState(1);

   const [ment, setMent] = useState("시작");
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
   const [play] = useSound('/sounds/pop-268648.mp3');
   const playBeep = (vol: number, t: number) => {
      oscillator.type = "sine"; // 사인파
      oscillator.frequency.setValueAtTime(vol, audioContext.currentTime); // 주파수 설정

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); // 볼륨 설정

      const distortion = audioContext.createWaveShaper();
      distortion.curve = new Float32Array([0, 1, 0]);  // 왜곡

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(); // 소리 시작
      oscillator.stop(audioContext.currentTime + t); // 지정된 시간 후 소리 종료
   };

   const speech = (text) => {
      let voices = [];

      //디바이스에 내장된 voice를 가져온다.
      const setVoiceList = () => {
         voices = window.speechSynthesis.getVoices();
      };

      setVoiceList();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
         //voice list에 변경됐을때, voice를 다시 가져온다.
         window.speechSynthesis.onvoiceschanged = setVoiceList;
      }

      const speech = (txt) => {
         const lang = "ko-KR";
         const utterThis = new SpeechSynthesisUtterance(txt);

         utterThis.lang = lang;

         /* 한국어 vocie 찾기
            디바이스 별로 한국어는 ko-KR 또는 ko_KR로 voice가 정의되어 있다.
         */
         const kor_voice = voices.find(
             (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_")
         );

         //힌국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
         if (kor_voice) {
            utterThis.voice = kor_voice;
         } else {
            return;
         }

         //utterance를 재생(speak)한다.
         window.speechSynthesis.speak(utterThis);
      };

      speech(text);
   };

   // const speech = (query: string) => {
   //    const synth = window.speechSynthesis;
   //
   //    // 음성 목록을 미리 로드
   //    const getVoices = () => {
   //       return new Promise<SpeechSynthesisVoice[]>((resolve) => {
   //          const voices = synth.getVoices();
   //          if (voices.length !== 0) {
   //             resolve(voices);
   //          } else {
   //             synth.onvoiceschanged = () => resolve(synth.getVoices());
   //          }
   //       });
   //    };

   //    const speakText = async () => {
   //       const voices = await getVoices(); // 음성 목록이 로드될 때까지 기다림
   //       const utter = new SpeechSynthesisUtterance(query);
   //
   //       // 한국어 음성 찾기
   //       const koreanVoice = voices.find((voice) => voice.lang === "ko-KR" && voice.name === "Google 한국의");
   //       if (koreanVoice) {
   //          utter.voice = koreanVoice;
   //          console.log("사용 중인 목소리:", koreanVoice.name);
   //       } else {
   //          console.warn("한국어 음성을 찾을 수 없습니다. 기본 음성 사용.");
   //          // 기본 음성 설정 (한국어가 없으면 기본 음성 사용)
   //          utter.voice = voices.find((voice) => voice.lang === "ko-KR") || voices[0];
   //       }
   //
   //       // 텍스트 읽기
   //       synth.cancel();
   //       synth.speak(utter);
   //    };
   //
   //    // 사용자 상호작용을 통해 음성을 시작하도록 해야 함
   //    speakText();
   // };




   useEffect(() => {
      let timer: NodeJS.Timeout;

      const handleExercise = async () => {
         if (startTimer && time > 0) {
            playBeep(500,0.2);
            // 카운트 다운 소리
            console.log(time);
            timer = setInterval(() => {
               setTime((prevTime) => prevTime - 1);
            }, 1000);
         }

         if (startTimer && time === 0) {
            // 시작 개시 소리
            playBeep(1000,0.4);
            console.log("start!!");
            setStartTimer(false); // 타이머가 끝나면 멈춤
            setTimeout(() => {
               setMent("");
               setStart(true);
            }, 1200);
         }
      };

      handleExercise();

      return () => clearInterval(timer);
   }, [startTimer, time]);

   useEffect(() => {
      window.speechSynthesis.getVoices();
   }, []);

   useEffect(() => {
      let timer: NodeJS.Timeout;
      const doExercise = async () => {
         if (count + 1 === exeCnt) {
            setStart(false);
            setClicked(false);
            setMent("시작");
            return;
         }

         if (start && time === 0) {
            play();
            speech(numberToKoreanNative(exeCnt));
            // 횟수 소리
            console.log(numberToKoreanNative(exeCnt));
            timer = setInterval(() => {
               setExeCnt((prev) => prev + 1);
            }, 60000 / bpm);
         }
      };

      doExercise();

      return () => clearInterval(timer);
   }, [start, exeCnt]);

   return (
      <div className="pb-96 justify-center">
         <div className="absolute top-0 w-full text-left">
            <p className="text-white border-b-2 font-light px-4 py-3 text-2xl">
               COUNT UP
            </p>
         </div>
         <div className="text-white">
            <div className="mb-5 pt-28 items-center">
               <>
                  {startTimer && time > 0 ? (
                     <p className="text-2xl font-extrabold">{time}</p>
                  ) : (
                     clicked && <p className="text-2xl font-bold">{ment}</p>
                  )}
               </>
               {!clicked ? (
                  <button
                     className="w-32 h-32 mb-5 rounded-full bg-slate-600 shadow-xl  active:bg-slate-700 active:shadow-inner active:shadow-black border border-gray-500 text-white"
                     onClick={() => {
                        setTime(3);
                        setStartTimer(true);
                        setClicked(true);
                        setExeCnt(1);
                     }}
                  >
                     시작하기
                  </button>
               ) : (
                  start && (
                     <div>
                        <div className="grid gird-col-3 justify-center items-center">
                           <div className="grid border border-gray-500 py-2 px-3 rounded-lg countdown text-4xl font-mono font-extrabold mb-4">
                              <p
                                 style={
                                    { "--value": exeCnt } as React.CSSProperties
                                 }
                              ></p>
                           </div>
                           <button
                              className="grid btn btn-error text-lg text-white"
                              onClick={() => {
                                 setClicked(false);
                                 setStart(false);
                                 setStartTimer(false);
                                 setMent("시작");
                              }}
                           >
                              정지
                           </button>
                        </div>
                     </div>
                  )
               )}
            </div>
         </div>
         <hr className="mb-4 mt-2 justify-center" />
         <div className="mb-3">
            <h1 className="text-white mb-2 text-xl font-bold">속도</h1>
            <p className="text-white text-lg">분당 {bpm}회 실시</p>
         </div>
         <div className="flex mb-4 justify-center gap-5 items-center">
            <button
               className="btn btn-active btn-neutral rounded-full border border-gray-500"
               onClick={() => setBpm(Math.max(bpm - 1, 0))}
            >
               <FaMinus />
            </button>
            <div className="font-mono text-3xl text-white border border-gray-500 rounded-lg">
               <p className="px-4 py-2">{bpm}</p>
            </div>
            <button
               className="btn btn-active btn-neutral rounded-full border border-gray-500"
               onClick={() => setBpm(Math.min(bpm + 1, 60))}
            >
               <FaPlus />
            </button>
         </div>
         <hr className="mb-4 mt-2 justify-center" />
         <div>
            <h1 className="text-white mb-2 text-xl font-bold">횟수</h1>
         </div>
         <div className="flex justify-center mb-7 gap-5 items-center">
            <button
               className="btn btn-active btn-neutral rounded-full border border-gray-500"
               onClick={() => setCount(Math.max(count - 1, 0))}
            >
               <FaMinus />
            </button>
            <div className="font-mono text-3xl text-white border border-gray-500 rounded-lg">
               <p className="px-4 py-2">{count}</p>
            </div>
            <button
               className="btn btn-active btn-neutral rounded-full border border-gray-500"
               onClick={() => setCount(count + 1)}
            >
               <FaPlus />
            </button>
         </div>
         <div className="flex justify-center gap-4 mt-5">
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(count + 5)}
            >
               +{5}
            </button>
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(count + 10)}
            >
               +{10}
            </button>
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(count + 15)}
            >
               +{15}
            </button>
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(count + 20)}
            >
               +{20}
            </button>
         </div>
         <div className="flex justify-center gap-4 mt-3">
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(Math.max(count - 5, 0))}
            >
               -{5}
            </button>
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(Math.max(count - 10, 0))}
            >
               -{10}
            </button>
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(Math.max(count - 15, 0))}
            >
               -{15}
            </button>
            <button
               className="btn btn-active btn-neutral btn-circle text-xl border border-gray-500"
               onClick={() => setCount(Math.max(count - 20, 0))}
            >
               -{20}
            </button>
         </div>
         <div className="flex justify-center">
            <button
               className="btn mt-5 text-lg bg-gray-500 border border-gray-500 text-white"
               onClick={() => setCount(10)}
            >
               횟수 초기화
            </button>
         </div>
      </div>
   );
};
