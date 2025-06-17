const GeneralError:React.FC<{message:string}>=({message})=>{
    return  <div className="mb-4 h-[40px] p-3 bg-[rgba(240,68,56,0.1)] border border-[rgba(240,68,56,0.2)] rounded-lg flex items-center">
    <p className="text-[#f04438] text-14 font-montserrat">{message}</p>
  </div>
}

export default GeneralError