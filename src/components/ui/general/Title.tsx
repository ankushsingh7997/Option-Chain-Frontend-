import { useNavigate } from "react-router-dom"

const Title:React.FC<{title?:string,message?:string,navigation?:string,text?:string}>=({title,message,navigation,text})=>{
    const navigate = useNavigate()
    return <div className="text-center mb-8">
    <h1 className="text-24 font-ibm font-bold text-white mb-2">{title}</h1>
    <p className="text-[#9A9A9A] text-14 font-montserrat">
      {message}{' '}
      <button className="text-[#3f59d8] hover:text-sec-blue font-medium" onClick={()=>navigate(navigation?navigation:"")}>
       {text}
      </button>
    </p>
  </div>
}


export default Title