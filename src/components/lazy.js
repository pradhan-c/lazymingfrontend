import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Navigate  } from "react-router-dom";
import { Row, Form, Button ,Spinner} from 'react-bootstrap';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import  Axios  from "axios";
import { LazyMinter }  from "../Lazymint/Createvoucher";
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
const BigNumber = require('bignumber.js');
const convert = require('ethereum-unit-converter')


const  Lazy = ({contract, signer,account}) =>  {
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [id, setid] = useState('');
    const [rt, setRt] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [voucher,setVoucher] =useState('');
    const [isLoading, setLoading] = useState(false);
    const [redirect,setredirect] = useState(false);
    const [listed,setListed] = useState(true);
    const [sa,setSa]=useState('');

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        setSa(account.toString());
        console.log(sa);
        
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
          try {
            const result = await client.add(file);
            console.log(result);
            setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
          } catch (error){
            console.log("ipfs image upload error: ", error);
          }
        }
        Axios.get("https://lazy-minting.herokuapp.com/data").then((response) => {
        
            setid(response.data.tokenId + 1);
          
          
         
        });
      }
      const createNFT = async () => {
        if (!image || !price || !id || !name || !description ){
        
          return;
        } 
        setLoading(true);
        try{
         
          const rt = convert(price, 'ether', 'wei');
          console.log(rt);
          setRt(rt);
      
      
          const result = await client.add(JSON.stringify({image, rt, id,name,description}));
          const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
          console.log(uri);
         
         
         
        
          console.log(contract.address);
        
          
         
      
          const lazyminter = new LazyMinter({contract , signer});
          console.log(lazyminter);
          const voucher = await lazyminter.createVoucher(id, uri, rt,name,description);

		      console.log(voucher);
          setVoucher(voucher)
          
          Axios.post("https://lazy-minting.herokuapp.com/insert",{
            voucher:voucher,
            image : image,
            price : price,
            listed : listed,
            account : account,
            

          });
          setLoading(false);
          let timer1 = setTimeout(() =>setredirect(true), 4000);

         
          
          
        
         
         
         } catch(error) {
          console.log("ipfs uri upload error: ", error);
          setLoading(false);
          
        }
      }
      
  if(redirect) {
        return<Navigate  to="/"/>
  }
  return (
    <div>
        <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}

              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="NAME" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required type="text" placeholder="DESCRIPTION" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT}  variant="primary" size="lg">
                { isLoading ? <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                   
                    /> : 
                    
                  'Create and list NFT'}
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}

export default Lazy;