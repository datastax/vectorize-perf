const XWing = () => {
  return (
    <svg width="77" height="85" viewBox="0 0 77 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M44.599 3.04933H32.401L31.4985 9.52915H30.8762L30.1139 0H25.5396L24.0149 7.24215L8.00495 12.2802V9.14798H1.14356V14.1694L0 14.4843V24.7758H1.14356V28.5874H3.0495V51.8386H1.14356V54.5067H3.0495V59.843L6.09901 56.7937V54.5067H8.00495V51.8386H6.09901V28.5874H8.00495V24.7758H24.0149V27.4439H30.6404L35.4505 85H41.5495L46.3596 27.4439H52.9851V24.7758H68.995V28.5874H70.901V51.8386H68.995V54.5067H70.901V56.7937L73.9505 59.843V54.5067H75.8564V51.8386H73.9505V28.5874H75.8564V24.7758H77V14.4843L75.8564 14.1694V9.14798H68.995V12.2802L52.9851 7.24215L51.4604 0H46.8861L46.1238 9.52915H45.5015L44.599 3.04933ZM37.5898 15.2466C35.6838 15.2466 34.2449 16.9754 34.5909 18.8496L36.5551 29.4882C36.6219 29.8497 36.9371 30.1121 37.3048 30.1121H39.6952C40.0629 30.1121 40.3782 29.8497 40.4449 29.4882L42.4091 18.8496C42.7551 16.9754 41.3162 15.2466 39.4102 15.2466H37.5898Z" fill="currentColor"/>
    </svg>
  )
}

const TieFighter = () => {
  return (
    <svg width="64" height="69" viewBox="0 0 64 69" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.90476 0H8.7619V21.85H11.4286V25.8537L17.9048 28.75H20.7993C22.1832 26.026 24.5196 23.8734 27.3666 22.7369L28.5714 19.9333H35.4286L36.6334 22.7369C39.4804 23.8734 41.8168 26.026 43.2007 28.75H46.0952L52.5714 25.8537V21.85H55.2381V0H62.0952V21.85H64V47.15H62.0952V69H55.2381V47.15H52.5714V43.1463L46.0952 40.25H43.2007C41.1199 44.3459 36.8854 47.15 32 47.15C27.1147 47.15 22.8802 44.3459 20.7993 40.25H17.9048L11.4286 43.1463V47.15H8.7619V69H1.90476V47.15H0V21.85H1.90476V0ZM30.0291 30.3483L26.9758 27.2759C28.3983 26.2723 30.1308 25.6833 32 25.6833C33.7721 25.6833 35.4213 26.2127 36.8 27.1228L33.7097 30.2325C33.1816 30.0181 32.6045 29.9 32 29.9C31.2942 29.9 30.6259 30.0609 30.0291 30.3483ZM40.7619 34.5C40.7619 36.3809 40.1766 38.1242 39.1792 39.5556L36.1259 36.4833C36.4115 35.8828 36.5714 35.2101 36.5714 34.5C36.5714 33.6897 36.3632 32.9283 35.9977 32.2671L39.0212 29.2248C40.1145 30.6958 40.7619 32.5218 40.7619 34.5ZM33.9709 38.6517L37.0242 41.7241C35.6017 42.7277 33.8692 43.3167 32 43.3167C30.0341 43.3167 28.2194 42.6652 26.7575 41.565L29.781 38.5227C30.4381 38.8905 31.1947 39.1 32 39.1C32.7058 39.1 33.3741 38.9391 33.9709 38.6517ZM24.6687 39.33C23.7642 37.9427 23.2381 36.2832 23.2381 34.5C23.2381 32.6191 23.8234 30.8758 24.8208 29.4444L27.8741 32.5167C27.5885 33.1172 27.4286 33.7899 27.4286 34.5C27.4286 35.1083 27.5459 35.6889 27.759 36.2204L24.6687 39.33Z" fill="currentColor"/>
    </svg>
  )
}

interface Props {
  type: "vectorize" | "openai";
  word: string;
  duration: number;
  position: number;
}
const StarFighter = ({type, word, duration, position}: Props) => {
  const randomLeft = (type === "vectorize" ? 0 : 50) + position + "%";

  return (
    <div
      className={`flex flex-col items-center drop word ${type === "vectorize" ? "xwing" : "tie-fighter"}`}
      style={{
        animationDuration: `${duration * 10}ms`,
        left: randomLeft
      }}
    >
      <span className="border-solid border-2 border-current rounded-md p-1 mb-1">{word}</span>
      {type === "vectorize" ? <XWing /> : <TieFighter />}
    </div>
  )
}

export default StarFighter;