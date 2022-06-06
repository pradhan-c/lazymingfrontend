import {
  BrowserRouter,
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navbar.js';
import LazyMintAbi from './Lazymint/LazyNFT.json';
import Home from './components/Home.js';
import Lazy from './components/lazy.js';
import { ethers } from "ethers";
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { LazyMinter } from "./Lazymint/Createvoucher";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});
  const [signer , setSigner] = useState({});

  const chainHandler = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
   })
  }
    // MetaMask Login/Connect
    const web3Handler = async () => {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
     })
     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
     setAccount(accounts[0]);
     
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Set signer
      const signer = provider.getSigner();
      setSigner(signer);
    
  
      window.ethereum.on('chainChanged', (chainId) => {
        chainHandler();
        
      })
  
      window.ethereum.on('accountsChanged', async function (accounts) {
        setAccount(accounts[0]);
        await web3Handler();
      })
      loadContracts(signer);
    }
    const loadContracts = async (signer) => {
      // Get deployed copies of contracts
      const marketplace = new ethers.Contract("0x710343B47E92C4c1ccAeb9ad898396966f7F0D5a", LazyMintAbi.abi, signer);
      setContract(marketplace);
      setLoading(false);
      console.log(loading);
    }
  return (
<BrowserRouter>
      <div className="App">
        <>
          <Navigation  web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route  path="/" element={
                <Home contract={contract} account={account} />
              } />
               <Route  path="/Lazy" element={
                <Lazy contract={contract} signer ={ signer } account={account} />
              } />
           

            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
