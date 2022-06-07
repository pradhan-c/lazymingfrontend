import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import Axios from "axios";
import { Row, Col, Card, Button } from "react-bootstrap";

const Home = ({ contract, account }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadMarketplaceItems = async () => {
    
    Axios.get("https://lazy-minting.herokuapp.com/read").then((response) => {
      setItems(response.data);
      
    });
    setLoading(false);
  }

  
  const buyMarketItem = async (item) => {

    
    
    const amount = ethers.utils.parseEther(item.price.toString());
    console.log(contract);
    console.log(amount);
    if(account === item.account){
         alert("You cant buy your own nft");
    }else{
      await (await contract.redeem(account , item.tokenId, item.minPrice.toString(),item.uri,item.name,item.description,item.signature, { value: item.minPrice.toString()})).wait();
      Axios.put("https://lazy-minting.herokuapp.com/update",{
        id  : item._id ,
        listed : false ,
        account : account,
        });
      loadMarketplaceItems();
      
      
    }

   

  }

  useEffect(() => {
   
    loadMarketplaceItems();
    console.log("something changed");
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img
                    variant="top"
                    width="200"
                    height="200"
                    src={item.image}
                  />
                  <Card.Body color="secondary">
                    <Card.Title> {item.tokenId}</Card.Title>
                    <Card.Text>{item.name}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <Button
                       onClick={() => buyMarketItem(item)}
                        variant="primary"
                        size="lg"
                      >
                        Buy for {item.price} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};
export default Home;
