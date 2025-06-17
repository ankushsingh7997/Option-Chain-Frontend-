import React, { memo, useCallback, useEffect, useRef } from "react";
import { convertObject, formatNumber,} from "../../../constant/option";
import { useStrikeData } from "../../../hooks/useStrikeData";
import Progress from "./Progress"
import { useMutation } from "@apollo/client";
import { PLACE_ORDER } from "../../../graphql/trade/trade";
import { OptionChainData } from "../../../websocket/optionChainUtils";
import { useAppSelector } from "../../../store";
import { selectBrokerData, selectOptionChainState } from "../../../store/selectors";
import { useToast } from "../../../hooks/useToast";

export interface strikeLtp {
    strike: string
}

interface CallPutProps extends strikeLtp {
    lp: string;
    bg: string;
    oi:number;
    poi:number;
    maxOi:number;
    option?:OptionChainData 
    onToggle:(type:"B"|"S",option?:OptionChainData)=>void
}

interface StrikeProps extends strikeLtp {
    bg: string;
}

const Strike: React.FC<StrikeProps> = memo(({ strike, bg }) => (
    <div className={`w-[20%] h-[100%] border-x border-x-light-gray flex items-center justify-center ${bg}`}>
        {strike}
    </div>
))

const Call: React.FC<CallPutProps> = memo(({ lp, bg, oi, poi = 0, maxOi, option, onToggle }) => {
    const profit = poi !== 0 ? (((Number(oi) - poi) / poi) * 100) > 0 : false
   
    const classCss = {
        outer: "absolute right-0",
        inner: `rounded-l-[30px] absolute right-0 ${profit ? "bg-profit-light" : "bg-loss-light"}`
    }

    const handleToggle = useCallback((type: "B" | "S") => {
        onToggle(type, option);
    }, [onToggle, option]);
    
    return (
        <div className={`w-[40%] h-[100%] flex items-center justify-start pl-2 ${bg} relative group`}>
            <div className="w-[50%] flex justify-between">
                <span>{lp}</span>
                <span className={profit ? "text-profit" : "text-loss"}>
                    {formatNumber(Number(oi))}
                </span>
            </div>

            <Progress oi={oi} maxOi={maxOi} classCss={classCss} />

            <div className="absolute right-6 top-3 opacity-0 group-hover:opacity-100 transition-opacity  flex w-[50px] justify-between">
               <span className="bg-profit w-[18px] flex items-center justify-center rounded-[3px]" onClick={() => handleToggle('B')}>B</span>
               <span className="bg-loss w-[18px] flex items-center justify-center rounded-[3px]" onClick={() => handleToggle('S')}>S</span>
            </div>
        </div>
    )
})

const Put: React.FC<CallPutProps> = memo(({  lp, bg, oi, poi, maxOi, option, onToggle }) => {
    const profit = poi !== 0 ? (((Number(oi) - poi) / poi) * 100) > 0 : false
    const textColorClass = profit ? "text-profit" : "text-loss"
    const classCss = {
        outer: "absolute left-0",
        inner: `rounded-r-[30px] absolute left-0 ${profit ? "bg-profit-light" : "bg-loss-light"}`
    }

    const handleToggle = useCallback((type: "B" | "S") => {
        onToggle(type, option);
    }, [onToggle, option]);
    
    return (
        <div className={`w-[40%] h-[100%] flex items-center justify-end pr-2 ${bg} relative group`}>
            <div className="w-[50%] flex justify-between">
                <span className={textColorClass}>{formatNumber(Number(oi))}</span>
                <span>{lp}</span>
            </div>
            <Progress oi={oi} maxOi={maxOi} classCss={classCss} />
            <div className="absolute left-6 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-50 flex w-[50px] justify-between">
               <span className="bg-loss w-[18px] flex items-center justify-center rounded-[3px]" onClick={() => handleToggle('S')}>S</span>
               <span className="bg-profit w-[18px] flex items-center justify-center rounded-[3px]" onClick={() => handleToggle('B')}>B</span>
            </div>
        </div>
    )
})

const StrikeLtp = React.memo<strikeLtp>(({ strike }) => {
    const {lots}=useAppSelector(selectOptionChainState)
    const broker=useAppSelector(selectBrokerData)
    const [placeOrder] = useMutation(PLACE_ORDER);
    const rowRef = useRef<HTMLDivElement>(null);
    const { atm, callBg, putBg, strikeBg, callLtp, putLtp, callOi, putOi, callPoi, putPoi,maxCallOi,maxPutOi,callOption,putOption} = useStrikeData(strike);
    const toast=useToast()
    
    const handleOrderToggle = useCallback(async (type: "B" | "S", option?: OptionChainData) => {
        if (!option||!broker) return;
        
        try {
            const input = convertObject({option, actid: broker?.actid, lot: lots, transaction: type === "B" ? 1 : 0});
            const { data } = await placeOrder({ variables: { input } });
            const response=data.placeOrder
            if(response.status) toast.success(response.message)
            else toast.error(response.message)
        } catch (error) {
            console.error("Order error:", error);
        }
    }, [placeOrder,lots]);
    
    useEffect(() => {
        if (atm && rowRef.current) {
            rowRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }
    }, [])
    
    return (
        <div ref={rowRef} className="flex h-14 justify-between border-b border-b-light-gray text-12 cursor-default">
            <Call strike={strike} lp={callLtp} bg={callBg} oi={callOi} poi={callPoi} maxOi={maxCallOi} option={callOption}  onToggle={handleOrderToggle}/>
            <Strike strike={strike} bg={strikeBg} />
            <Put strike={strike} lp={putLtp} bg={putBg} oi={putOi} poi={putPoi} maxOi={maxPutOi} option={putOption} onToggle={handleOrderToggle}/>
        </div>
    )
})

export default StrikeLtp