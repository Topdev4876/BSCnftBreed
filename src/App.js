import React from 'react';
import './App.css';
import bananacontract from './MDOGBreedPool.json';
import contract from './DOGToken.json'
import { ethers } from 'ethers'; 
import NFT from './nft';
import { useState ,useEffect } from 'react';
import Loader from 'react-loader-advanced'
import CircularProgress from "@material-ui/core/CircularProgress";
import bepcontract from './MetaDog.json'; 
import Carousel from 'react-multi-carousel';
import '../node_modules/react-multi-carousel/lib/styles.css'
import NFTDOOR from './nftwithdoor';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1800 },
    items: 6,
    slidesToSlide: 4 // optional, default to 1.
  },
  desktop1: {
    breakpoint: { max: 1800, min: 1024 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};


const responsive1 = {
  desktop: {
    breakpoint: { max: 3000, min: 1800 },
    items: 6,
    slidesToSlide: 6 // optional, default to 1.
  },
  desktop1: {
    breakpoint: { max: 1800, min: 1400 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  desktop2: {
    breakpoint: { max: 1400, min: 1024 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 800 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  tablet1: {
    breakpoint: { max: 800, min: 464 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};
const spinner = <span><CircularProgress style={{'color': 'blue'}}/></span>;

const BigNumber = require('bignumber.js');


const { ethereum } = window;
const stakeAddress = "0xB49A2b01d224A7ec34EF6Ad313062c6C3d64c35f";
//0x7c69FA0985BC28332519d09c29C01629685d8Fc2
const bananaabi = bananacontract.abi;
const contractaddress= "0x04e8C7205dC00F7e36D891b5827fDc365F96C069"
const bep20address = "0x972954f0ee7c8215eC5B76D55cb15215338F9d56"
const bepabi = bepcontract.abi;
const abi=contract.abi


function App() {
  const [json,setjson]=useState([])
  const [status , setStatus]=useState('CONNECT WALLET')
  const [account,setCurrentAccount]=useState()
  const [loading,setload]=useState(false)
  const [seleted,setselected]=useState([])
  const [showaddtoken, setshowadd]=useState(false)
  const [staking,setstaking]=useState([])
  const [seletedstaking,setselectedstaking]=useState([])
  const [clear,setclear]=useState(false)
  const [date,setdate]=useState()
  const [breeddate,setbreeddata]=useState()
  const [selected2,setselected2]=useState(false)
  const [level,setlevel]=useState([])
  const [time,settime]=useState("Please select two DOG");
  const [bal,setbal]=useState(0)

  const idrange = [ 180,540,720,1120,1720,2000,2500,3100,
                    3400,3900,4400,4520,4820,5320,5820,6420,
                    6820,7320,7720,8320,8820,9220,9520,9700,10000];
                    
  const BREEDTIME_BY_TYPE = [ 30,25,35,25,25,
                              30,25,25,25,25,
                              30,60,25,25,25,
                              35,25,25,25,25,
                              30,30,25,30,60 ];
                              
  const BREEDTAX_BY_TYPE = [6000000,5000000,10000000,5000000,5000000,
                            5000000,5000000,5000000,5000000,5000000,
                            5000000,10000000,5000000,5000000,5000000,
                            5000000,5000000,5000000,6000000,5000000,
                            6000000,7000000,6000000,7000000,5000000];

  useEffect(()=>{
    checkWalletIsConnected()
  },[])
  useEffect(()=>{
    console.log(seletedstaking)
  },[seletedstaking])

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        checkWalletIsConnected();
      })
    }
  })

  useEffect(()=>{
    if(seleted.length==2) {
      let type1 = gettype(seleted[0])
      let type2 = gettype(seleted[1])
      if(type1 == type2){
          setselected2(true)
        let type;
        for(let i =0 ; i < 26 ; i++)
        {
          if(seleted[0]<idrange[i]) {
            type = i ;
            break;
          }
        }
        let date = BREEDTIME_BY_TYPE[type] - level[0] -level[1];
        console.log(type1,level[0],level[1])
        settime( `Breeding time is ${ date} days and cost is ${BREEDTAX_BY_TYPE[type]} MDOG`)
      }else {
        settime( `Please select same type of DOG`)
      }
      
    }
    else {setselected2(false);settime("Please select 2 DOG")}
  },[seleted])

  function gettype(aa){
    for(let i =0 ; i < 26 ; i++)
      {
        if(aa < idrange[i]) {
          return i;
          break;
        }
      }
  }

  const checkWalletIsConnected = async () => {
    if (!ethereum) {
      setStatus("DOWNLOAD METAMASK");
      return;
    } else {
      if(window.ethereum.networkVersion!=97){
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
        });

      }
        setStatus("CONNECT WALLET");
        const accounts = await ethereum.request({ method: 'eth_accounts' }).then().catch((err)=>{alert(err)});
        if (accounts.length !== 0) {
          setStatus("show nft")
          setshowadd(true)
          const account = accounts[0];
          setCurrentAccount(account);
          setload(true)
          await test()
          setload(false)
        } else {
          connectWalletHandler()
        }
      
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setStatus("DOWNLOAD METAMASK");
    }else
    {
      if(window.ethereum.networkVersion!=97){
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
          // params: [{ chainId: '0x4' }],
        });

      }
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
        setStatus("show nft")
    }
  }

  const send =async ()=>{
    if(selected2){
      console.log(seleted)
      let type1 = gettype(seleted[0])
      let type2 = gettype(seleted[1])
      console.log(type1,type2)
      if(type1 == type2){
        if(bal >= BREEDTAX_BY_TYPE[type1]){
        const provider1 = new ethers.providers.Web3Provider(ethereum);
        const signer1 = provider1.getSigner();
        const Contract = new ethers.Contract(contractaddress, abi,signer1);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const StakingContract = new ethers.Contract(stakeAddress, bananaabi,signer);
        let bepContract = new ethers.Contract(bep20address, bepabi,signer);
        console.log(seleted[1],seleted[0])
        setload(true)
        let txhash = await bepContract.approve(stakeAddress,ethers.utils.parseEther(BREEDTAX_BY_TYPE[type1].toString())).catch((err)=>{setload(false);alert(err.data.message);})
        await txhash.wait();
        let tx = await Contract.approveNFTS(stakeAddress,seleted[1],seleted[0]).catch((err)=>{setload(false);alert(err.data.message);})
        await tx.wait()
        tx = await StakingContract.deposit(seleted[1],seleted[0]).catch(err=>{setload(false);alert(err.data.message);})
        await tx.wait()
        let temp=json;
        let stakingnft=staking;
        for(let i = 0;i<json.length;i++)
        {
          for(let j=0;j<seleted.length;j++)
          {
            if(seleted[j]==json[i].slice(68,-4))
            {
              stakingnft.push(json[i])
            }
          }
        }
        for(let i =0;i< 4;i++){
          stakingnft.push('aa')
        }
        temp = temp.filter(item => !stakingnft.includes(item))
        setselected([])
        setjson(temp)
        setclear(true)
        window.location.reload(false);
        setload(false)
        }else{
          alert("Need more mdog")
        }
        
      }else{
        alert('select same type of dog')
      }
        
    }else{
      alert('select 2 nft')
    }
    
  }

  async function test( ){
    const provider1 = new ethers.providers.Web3Provider(ethereum);
    const signer1 = provider1.getSigner();
    const Contract = new ethers.Contract(contractaddress, abi,signer1);
    const StakingContract = new ethers.Contract(stakeAddress, bananaabi,signer1);
    let bepContract = new ethers.Contract(bep20address, bepabi,signer1);
    setload(true)
    let balance
    
    const accounts = await ethereum.request({ method: 'eth_accounts' }).then().catch((err)=>{setload(false);alert(err)});
    await bepContract.balanceOf(accounts[0]).then((result)=>{balance=BigNumber(result._hex).shiftedBy(-18);setbal(parseInt(balance.toString()));})
    await Contract.balanceOf(accounts[0]).then((result)=>{balance=BigNumber(result._hex)}).catch((err)=>{setload(false);alert(err)});;
    let temp=[]
    for (let i = 0; i < balance; i++) {
      let id=await Contract.tokenOfOwnerByIndex(accounts[0], i)
      let level
      await Contract.getlevel(id).then((result)=>{level=BigNumber(result._hex).toString()});
      temp.push([`https://metadogs.mypinata.cloud/ipfs/QmbpHijUWz57v5CMucX3s6up9fTUdWZE7Vk5Mq79tztHGG/${id}.png`,level])
      
      console.log(temp)
    }
    setjson(temp)
    let array = await StakingContract.getdipositid().catch((err)=>{setload(false);alert(err.data.message);})
    // await StakingContract.getremaintime().then((result)=>{setbreeddata(parseInt(BigNumber(result._hex).toString())/3600)}).catch((err)=>{setload(false)})
    let staking = []
    console.log(array)
    if(array.length!=0){
      for(let i =0;i<array.length;i++){
        let time
        console.log(array[i])
        await StakingContract.getremaintime(BigNumber(array[i].ID._hex).toString()).then((result)=>{time=BigNumber(result._hex).toString()});
        console.log(time)
        staking.push([`https://metadogs.mypinata.cloud/ipfs/QmbpHijUWz57v5CMucX3s6up9fTUdWZE7Vk5Mq79tztHGG/${BigNumber(array[i].fristDog._hex).toString()}.png`,
        `${BigNumber(array[i].ID._hex).toString()}`,
        parseInt(time)
      ])
      
      }
    }
    for(let i =0;i< 4;i++){
      staking.push(['aa',"p"])
    }
    console.log(staking)
    setstaking(staking)
    setload(false)
  }

  async function connect(){
    if (!ethereum) {
      window.location.href='https://metamask.io/download.html'
    }else
    {
      if(window.ethereum.networkVersion!=97){
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
        });

      }
      setloading(true)
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }).catch((err)=>{setloading(false)});
      setaccount(accounts[0])
      await nfts()
      setloading(false)
    }
  }

  const shownft=()=>{
    if(status=="show nft") test()
    else if (status=="DOWNLOAD METAMASK") window.location.href='https://metamask.io/download.html'
    else connectWalletHandler()
  }
  const receive=async (data)=>{
    console.log(seleted)
    await setselected([...seleted,data])
  }
  const deldata=async (data)=>{
    await setselected(seleted.filter(item=>item!=data))
  }
  const receive1=async (data)=>{
    console.log(level)
    await setlevel([...level,data])
  }
  const deldata1=async (data)=>{
    await setlevel(level.filter(item=>item!=data))
  }
  const receivestaking=async (data)=>{
    console.log(data)
    let aa =[]
    aa.push(data)
    if(seletedstaking.length==0)
    await setselectedstaking([...seletedstaking,data])
    else {
      setselectedstaking(aa)
    }
  }
  const deldatastaking=async (data)=>{
    await setselectedstaking(seletedstaking.filter(item=>item!=data))
  }


  return (
    <div className="App">
        <header className="App-header">
          <figure className='textover' onClick={connect}>
              <img className='button' src="./button.svg" />
              <figcaption className='caption'>Connect</figcaption>
          </figure>
          <div >
            <img className='logo'  src="./logo.png" />
          </div>
          <React.Fragment>
          <section className='topelement'>
          <div className='title'>
              <img className='titleimage'  src='./title.svg'></img>
            </div>
            <div className='description'>
              <img className='descriptionimage'  src='./text.svg'></img>
            </div>
            
            <div className='main'>
              <Loader  backgroundStyle={{backgroundColor:'transparent'}} show={loading} message={spinner}>
              </Loader>
              <div id="container" >
                  <div className='nfts row'>
                  <Carousel autoPlaySpeed={300000000} infinite={true} autoPlay={false} responsive={responsive}>
                    {
                    json.length!=0?
                        json.map(data=>{
                          return(<NFT data={data} receive={receive} deldata={deldata} receivelevel={receive1} dellevel={deldata1} clear={clear}/>)
                        }):
                        <></>
                    }
                  </Carousel>
                  </div>
                  <div className='balance'>
                    You have {bal} MDOG
                  </div>
                  <div className='time'>
                    {time}
                  </div>
                    <button  class = 'senbtn glow-on-hover' onClick={send}>Send NFT</button>
              </div>
              </div>
                <div className='lamp'>
                  <a href="#breed">
                    <img href="#breed" className='downarrow' src='./down.svg'></img>
                  </a>
                </div>
            </section>
            <div>
            <section className='breedelement' id='breed'>
              <div className='lamp'>
                <img className='lampleft' src="./aaa.svg"></img>
              </div>
              <div className='lamp'>
                <img className='lampright' src="./aaa.svg"></img>
              </div>
              <div className='down nfts row'>
              <Carousel  containerClass="carousel-container1" autoPlaySpeed={300000000} infinite={true} autoPlay={false} responsive={responsive1}>
                {
                  staking.length!=0?
                    staking.map(data=>{
                        return(<NFTDOOR data={data} receive={receivestaking} deldata={deldatastaking} clear={clear}/>)
                      }):
                      <></>
                }
              </Carousel>
              </div>
            </section>
          </div>
          </React.Fragment>
        </header>
    </div>
  );
}

export default App;
