import React,{useEffect, useState} from "react";
import bananacontract from './MDOGBreedPool.json';
import Modal from "react-bootstrap/Modal";
import {Container,Row,Col} from "react-bootstrap"
import { ethers } from 'ethers'; 
import bepcontract from './MetaDog.json'; 
import Loader from 'react-loader-advanced'
import CircularProgress from "@material-ui/core/CircularProgress";
const spinner = <span><CircularProgress style={{'color': 'blue'}}/></span>;

export default function NFTDOOR({data,receive,deldata,clear}) {
  const [clicked,setclicked]=useState(true)
  const [cls, setCls] = useState("card ");
  const [show,setshow] = useState(false)
  const [date,setdate]  = useState(1)
  const [type,setype]=useState()
  const [loading,setload]=useState(false)
  

  const idrange = [180,540,720,1120,1720,2000,2500,3100,
                  3400,3900,4400,4520,4820,5320,5820,6420,
                  6820,7320,7720,8320,8820,9220,9520,9700,10000];

  const BREEDBOOST_BY_TYPE = [1000000,500000,1000000,1000000,500000,500000,
                              500000,500000,500000,500000,500000,3000000,500000,
                              500000,500000,500000,500000,500000,500000,500000,
                              500000,500000,500000,500000,500000];

  const stakeAddress = "0xd6E427B8e3cF39a1DB778Fc7B248760b1c54386a";
  const bananaabi = bananacontract.abi;
  const bep20address = "0x972954f0ee7c8215eC5B76D55cb15215338F9d56"
  const bepabi = bepcontract.abi;

  const boost=async()=>{
    const provider1 = new ethers.providers.Web3Provider(ethereum);
    const signer1 = provider1.getSigner();
    const StakingContract = new ethers.Contract(stakeAddress, bananaabi,signer1);
    let bepContract = new ethers.Contract(bep20address, bepabi,signer1);
    setload(true)
    let txhash = await bepContract.approve(stakeAddress,"100000000000000000000000000000000").catch(err=>{setload(false);alert(err.data.message);})
    await txhash.wait();
    console.log(data[1])
    txhash = await StakingContract.boostbreed(date,data[1]).catch(err=>{setload(false);alert(err.data.message);})
    await txhash.wait();
    window.location.reload(false);
    setload(false)
  }

  async function checktype(){
    for(let i =0 ; i < 26 ; i++)
    {
      if(data[0].slice(68,-4)<idrange[i]) {
        setype(i);
        break;
      }
    }  
  }

  const newdog=async()=>{
    const provider1 = new ethers.providers.Web3Provider(ethereum);
      const signer1 = provider1.getSigner();
      setload(true)
      const StakingContract = new ethers.Contract(stakeAddress, bananaabi,signer1);
      let txhash = await StakingContract.getnewnft(data[1]).catch(err=>{;setload(false);alert(err.data.message)})
      await txhash.wait();
      setload(false)
      window.location.reload(false);
    }

  // 
  useEffect(()=>{
     setCls("card")
  },[clear])
  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  const handleClose=()=>{setshow(false)}
  function toDate(str){
    let sec = str % 60;
    let min = (str - sec) / 60 % 60;
    let hour =   ((str - sec) / 60 - min) / 60 % 24
    let day = (((str - sec) / 60 - min) / 60 - hour) / 24
    return day + "d :" + hour + "h :" + min + "m"
  }


  return (
    <div className="item col">
      {
        data?
        <div style={{style:"position: relative; left: 0; top: 0;"}} class={cls} value={data[1]} onClick={e=>{
                      if(isNumeric(data[1])){
                        setshow(!show)
                        checktype()
                        console.log(BREEDBOOST_BY_TYPE[type])
                      }
                      if(clicked){
                        if(e.currentTarget.attributes['value'].value!="aa"){
                          receive(e.currentTarget.attributes['value'].value)
                          setCls("card")
                          setclicked(!clicked)
                        }else{
                          console.log("adf")
                        }
                      }else {
                        setCls("card")
                        deldata(e.currentTarget.attributes['value'].value)
                        setclicked(!clicked)
                      }
                        
              }}>
          {isNumeric(data[0].slice(84,-4))
          ?<img class="door" src="./dooropen.svg" alt="Card image"></img>:
          <img class="doorclosed" src="./door.svg" alt="Card image"></img>
          }
          {isNumeric(data[0].slice(84,-4))
          ?
          <div className="doorhide">
            <img src={data[0]} class="card-img-top fishes"/>
          </div>:
          <></>
          }
          {isNumeric(data[0].slice(84,-4))
            ?<div class="card-img-overlay">
              <h4 class="card-title1 card-id">{toDate(data[2])}</h4>
              </div>:
            <></>
            }
        
  
      </div>
      :
      <></>
      }
          <Modal 
              dialogClassName ="modala"
              show={show}
              // show={true}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              centered>
              <Loader  backgroundStyle={{backgroundColor:'transparent'}} show={loading} message={spinner}>
                <Modal.Header closeButton>
                  <Modal.Title>BOOST AND GETNEW DOG</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Container>
                  <div claseName='modaltitle'><div className='modaltitle'><h3 claseName='Popuptitle'>This pair {toDate(data[2])} left</h3><h4>Boost {date} day cost {BREEDBOOST_BY_TYPE[type] * date} MDOG</h4></div>
                  <div>
                  
                
                  </div>
                  </div>
                  <br/>
                  
                    <Row>
                      <Col xs={6} md={4}>
                      <div className="buttonbox">
                        <input type="number" className="inputnumber" value={date} onChange = {(e)=>{if(e.target.value > 0)setdate(e.target.value)}}></input>
                        </div>
                      </Col>
                      <Col xs={6} md={4}>
                      <div className="buttonbox">
                        <button class="btn btn-outline-primary btn-md btn-block" onClick={boost}> BOOSTBREED</button>
                      </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="buttonbox">
                          <button class="btn btn-outline-primary btn-md btn-block" onClick={newdog}> GetNewDog</button>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                    </Row>
                  </Container>
                </Modal.Body>
              </Loader>
            </Modal>
    </div>
    
  );
}
