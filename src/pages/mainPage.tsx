import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export const MainPage = () => {
   const [time, setTime] = useState(3);
   const [count, setCount] = useState(10);
   const [startTimer, setStartTimer] = useState(false);
   const [bpm, setBpm] = useState(20);
   const [start, setStart] = useState(false);
   const [clicked, setClicked] = useState(false);

   const [exeCnt, setExeCnt] = useState(0);

   const [ment, setMent] = useState("시작");

   useEffect(() => {
      let timer: NodeJS.Timeout;

      const handleExercise = async () => {
         if (startTimer && time > 0) {
            // 카운트 다운 소리
            timer = setInterval(() => {
               setTime((prevTime) => prevTime - 1);
            }, 1000);
         }

         if (startTimer && time === 0) {
            // 시작 개시 소리
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
         if (start && time === 0) {
            // 횟수 소리
            console.log("sound " + exeCnt);
            timer = setInterval(() => {
               setExeCnt((prev) => prev + 1);
            }, 60000 / bpm);
         }

         if (count + 1 === exeCnt) {
            setStart(false);
            setClicked(false);
         }
      };

      doExercise();

      return () => clearInterval(timer);
   }, [start, exeCnt]);

   return (
      <div className="h-svh">
         <div className="absolute top-0 w-full text-left">
            <p className="text-white border-b-2 font-light px-4 py-3 text-2xl">
               COUNT UP
            </p>
         </div>
         <div className="text-white">
            <div className="mb-5 pt-40 items-center">
               <>
                  {startTimer && time > 0 ? (
                     <p className="text-2xl font-extrabold">{time}</p>
                  ) : (
                     clicked && <p>{ment}</p>
                  )}
               </>
               {!clicked ? (
                  <button
                     className="w-32 h-32 mb-5 rounded-full bg-slate-600 shadow-md shadow-gray-400 active:bg-slate-700 active:shadow-inner-lg active:shadow-gray-400 border border-gray-500 text-white"
                     onClick={() => {
                        setTime(3);
                        setStartTimer(true);
                        setClicked(true);
                        setExeCnt(0);
                     }}
                  >
                     시작히기
                  </button>
               ) : (
                  start && (
                     <div className="">
                        <p className="text-4xl font-mono font-extrabold mb-4">
                           {exeCnt}
                        </p>
                        <button
                           className="btn btn-error text-white"
                           onClick={() => {
                              setClicked(false);
                              setStart(false);
                              setStartTimer(false);
                           }}
                        >
                           정지
                        </button>
                     </div>
                  )
               )}
            </div>
         </div>
         <hr className="mb-4 mt-2 w-80 justify-self-center" />
         <div>
            <h1 className="text-white mb-2 text-xl font-bold">속도</h1>
         </div>
         <div className="flex mb-4 justify-self-center gap-5 items-center">
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
               onClick={() => setBpm(bpm + 1)}
            >
               <FaPlus />
            </button>
         </div>
         <hr className="mb-4 mt-2 w-80 justify-self-center" />
         <div>
            <h1 className="text-white mb-2 text-xl font-bold">횟수</h1>
         </div>
         <div className="flex justify-self-center gap-5 items-center">
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
         <div className="flex justify-center gap-4 mt-3">
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

         <div className="flex max-w-64 justify-self-center flex-col">
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
