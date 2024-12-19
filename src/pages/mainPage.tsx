import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Howl } from "howler";

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

   const speech = (query: string) => {
      const synth = window.speechSynthesis;

      const speakText = () => {
         const voices = synth.getVoices();
         const utter = new SpeechSynthesisUtterance(query);

         // 한국어 음성 찾기
         const koreanVoice = voices.find((voice) => voice.lang === "ko-KR" && voice.name === "Google 한국의");
         if (koreanVoice) {
            utter.voice = koreanVoice;
            console.log("사용 중인 목소리:", koreanVoice.name);
         } else {
            console.warn("한국어 음성을 찾을 수 없습니다. 기본 음성 사용.");
            // 기본 음성 설정 (한국어가 없으면 기본 음성 사용)
            utter.voice = voices.find((voice) => voice.lang === "ko-KR") || voices[0]; // 기본 음성으로 설정
         }

         // 텍스트 읽기
         synth.speak(utter);
      };

      if (synth.getVoices().length > 0) {
         // 음성 목록이 이미 준비된 경우 바로 실행
         speakText();
      } else {
         // 음성 목록이 준비되지 않은 경우 이벤트 대기
         synth.onvoiceschanged = () => {
            // 음성 목록이 준비되면 다시 실행
            speakText();
         };
      }
   };



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
      let timer: NodeJS.Timeout;
      const doExercise = async () => {
         if (count + 1 === exeCnt) {
            setStart(false);
            setClicked(false);
            setMent("시작");
            return;
         }

         if (start && time === 0) {
            playBeep(400,0.1);
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
