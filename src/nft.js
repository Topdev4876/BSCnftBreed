import React,{useEffect, useState} from "react";


export default function NFT({data,receive,deldata,clear,receivelevel,dellevel}) {
  const [clicked,setclicked]=useState(true)
  const [cls, setCls] = useState("card ");
  // 
  useEffect(()=>{
     setCls("card")
  },[clear])
  
  return (
    <div className="item">
      {
        data?
        <div class={cls} value={data[0].slice(84,-4)} level ={data[1]} onClick={e=>{
                      if(clicked){
                        console.log(e.currentTarget.attributes['value'].value)
                          receive(e.currentTarget.attributes['value'].value)
                          receivelevel(e.currentTarget.attributes['level'].value)
                          setCls("card cardselected")
                          setclicked(!clicked)
                      }else {
                        setCls("card")
                        deldata(e.currentTarget.attributes['value'].value)
                        dellevel(e.currentTarget.attributes['level'].value)
                        setclicked(!clicked)
                      }
                        
              }}>
          
          <img class="card-img-top" src={data[0]} alt="Card image"></img>
          <div class="card-img-overlay">
            <h4 class="card-title card-id">LEVEL {data[1]}</h4>
          </div>
          
  
      </div>
      :
      <></>
      }
    </div>
    
  );
}
