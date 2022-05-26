import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from "ethers";
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState({});

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
      console.log(account);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Set signer
      const signer = provider.getSigner();
  
      window.ethereum.on('chainChanged', (chainId) => {
        chainHandler();
        
      })
  
      window.ethereum.on('accountsChanged', async function (accounts) {
        setAccount(accounts[0]);
        await web3Handler();
      })
      
    }
  return (
    <div className="App">
        <h1>helloworld</h1>
    </div>
  );
}

export default App;
