import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import market from './market.png';

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href={`https://etherscan.io/address/${account}`}>
                    <img src={market} width="40" height="40"  alt="" className="d-inline-block align-top"/>{' '}ClosedSea
                   
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/ethereum-boilerplate/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/ethereum-boilerplate/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/ethereum-boilerplate/my-listed-items">My NFT's</Nav.Link>
                        <Nav.Link as={Link} to="/ethereum-boilerplate/my-purchases">My Listed Items</Nav.Link>
                    </Nav>
                    
                    <Nav>
                        
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;