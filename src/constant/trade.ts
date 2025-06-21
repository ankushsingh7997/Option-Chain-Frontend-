const commen="flex items-center text-13"
export const POSITION_COLUMNS = [
    {
      title: "instrument",
      css: `w-[40%] md:w-[22%] ${commen}`,
      key: "instrument",
    },
    {
      title: "ord",
      css: `w-[6%] md:w-[6%] ${commen}`,
      key: "orders",
    },
    {
      title: "b/s",
      css: `w-[3%] ${commen}`,
      key: "bs",
    },
    {
      title: "avg",
      css: `w-[10%] md:w-[7%] ${commen}`,
      key: "avg",
    },
    {
      title: "ltp",
      css: `w-[10%] md:w-[6%] ${commen}`,
      key: "ltp",
    },
    {
      title: "lot",
      css: `w-[3%] ${commen}`,
      key: "lot",
    },
    {
      title: "mtm",
      css: `w-[7%] ${commen}`,
      key: "mtm",
    }
  ];
  

export const ORDER_COLUMNS=[
    {
        title:"instrument",
        css: `w-[37%] md:w-[22%] ${commen}`,
        key:"instrument"
    },{
        title :"ord",
        css:`w-[12%] md:w-[6%] ${commen}`,
        key:"orders"
    },
    {
        title : "b/s",
        css:` w-[5%] md:w-[3%] ${commen}`,
        key:"bs"
    },
    {
        title:"ltp",
        css:`w-[10%] md:w-[6%] ${commen}`,
        key:"ltp"
    },
  
    {
        title:"price",
        css:`w-[10%] md:w-[7%] ${commen}`,
        key:"price"
    },
    {
        title:"status",
        css:`w-[17%] ${commen}`,
        key:"status"
    },
]