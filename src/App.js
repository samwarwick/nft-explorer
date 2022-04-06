import React from 'react';
import './App.css';
import contract from './contracts/CastleNFT.json';
import { ethers } from 'ethers';
import Gallery from './components/gallery';
import NFT from './components/nft';
import mocks from './mocks/castle-nft-mock.json';
import { Button, Container, Divider, Form, Header, Icon, Input, Loader } from 'semantic-ui-react';
import { mapEtherscanUrl, mapMetadataUrl, mapNetworkName } from './Utils';

const CASTLE_NFT_ADDRESS = "0x91a77525830109968b6Ab745cDC7150aeFFD008C";
const abi = contract.abi;

const MOCK_WEB3 = false;    // Mock ethers calls for reading contract data
const MAX_TOKENS = 10;      // Maximum number of NFTs to be loaded and displayed

class App extends React.Component {

  state = {
      currentAccount: '',
      loading: false,
      network: '',
      contractAddress: CASTLE_NFT_ADDRESS,
      contractUrl: '',
      token: '',
      nfts: [],
      selectedNft: null
  }

  async checkWalletIsConnected() {
      const { ethereum } = window;

      if(!ethereum) {
          console.log("MetaMask not detected");
          return;
      } else {
          console.log("MetaMask detected");
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an account. Address: ", accounts[0]);
          this.setState({ currentAccount: account});
      } else {
          console.log("No account");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const network = await provider.getNetwork();
      const networkName = mapNetworkName(network.name);
      console.log(`network: ${networkName}`);
      this.setState({ network: networkName});
  }

  async connectWalletHandler() { 
      const { ethereum } = window;

      if(!ethereum) {
          alert("Please install MetaMask");
      }

      try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
          console.log("Found an account. Address: ", accounts[0]);
          this.setState({ currentAccount: accounts[0]});
      } catch (err) {
          console.log(err);
      }
  }

  connectWalletButton() {
      return (
          <div>
              <Button onClick={this.connectWalletHandler} primary>
                  Connect Wallet
             </Button>
             <br/><br/>
          </div>
      )
  }

  contractLink() {
      if (!this.state.loadedContractAddress) return '';
      const url = mapEtherscanUrl(`https://${this.state.network}.etherscan.io/address/${this.state.loadedContractAddress}`);
      return (
          <a href={url} target='_blank'>{this.state.loadedContractAddress}</a>);
  }

  loadJson = async(url) => {
      let json = null;
      
      try {
          json = await (await fetch(url)).json();
      } catch(e) {
          console.log('error');
      }

      return json;
  }

  loadCollection = async (event) => { 
      console.log(`Loading collection from ${this.state.contractAddress}`);
      event.preventDefault();

      this.setState({ loading: true});

      if (MOCK_WEB3 === true) {
          console.log('Using mocked response');
          this.setState({ loadedContractAddress: this.state.contractAddress});
          this.setState({ token: `${mocks.name} (${mocks.symbol})`});
          this.setState({ nfts: mocks.tokens });
          this.setState({ selectedNft: mocks.tokens[0] });
          this.setState({ loading: false});
          return;
      }

      let tokens = [];
      try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(this.state.contractAddress, abi, signer);
    
          const name = await nftContract.name();
          const symbol = await nftContract.symbol();
          this.setState({ loadedContractAddress: this.state.contractAddress});
          this.setState({ token: `${name} (${symbol})`});

          let tokenId = 0;
          let tokenURI;
          let metadata;
          let ownerAccount;

          while(true) {
              if (tokenId++ >= MAX_TOKENS) break;
              try {
                  tokenURI = await nftContract.tokenURI(tokenId);
                  ownerAccount = await nftContract.ownerOf(tokenId);
              } catch(err) {
                  break;
              }
              console.log(`TokenID: ${tokenId} URI: ${tokenURI}`);
              metadata = await this.loadJson(mapMetadataUrl(tokenURI));
              if (metadata === null) {
                  console.log('Invalid metadata!');
              } else {
                  console.log(`image url: ${metadata.image}`);
                  tokens.push({tokenId, metadata, tokenURI, 
                  ownerAccount, 
                  currentAccount: this.state.currentAccount,
                  network: this.state.network});
              }
          }
      } catch (err) {
          console.log(err);
      }

      this.setState({ nfts: tokens });
      this.setState({ selectedNft: tokens[0] });
      this.setState({ loading: false});
  }

  async componentDidMount() {
      this.checkWalletIsConnected();
  }

  render() { 
    const accountUrl = mapEtherscanUrl(`https://${this.state.network}.etherscan.io/address/${this.state.currentAccount}`);

    return (
      <Container>
      <div>
        <div className='nftx-heading'>
          <Header size='huge' textAlign='center'>
            <Icon name='find' />
            <Header.Content>NFT Explorer</Header.Content>    
          </Header>
        </div>
        <div>
        {!this.state.currentAccount ? this.connectWalletButton() : ''}
        </div>
        <div>
        <span className='nftx-label'>Network: </span>{this.state.network}
        </div>
        <div>
        <span className='nftx-label'>Account: </span><a href={accountUrl} target="_blank">{this.state.currentAccount}</a>
        </div>

        <br/>

        Search for an ERC721 contract:
        <Form onSubmit={this.loadCollection}>
            <Form.Field inline> 
                <label>Address</label>
                <Input 
                  action={{ icon: 'search' }}
                  type="text"
                  maxLength="42"
                  value={this.state.contractAddress}
                  onChange={event => this.setState({contractAddress: event.target.value})}
                  placeholder='Address'
                  style={{width: "420px"}}
                />
            </Form.Field>             
        </Form>  

        { this.state.loading && <div>    
            <Loader active inline>Loading...</Loader>
        </div> }
  
        <Divider horizontal>
            <Header as='h3'>
                Collection
            </Header>
        </Divider>
        <div>
            <span className='nftx-label'>Contract: </span>{this.contractLink()}<br/>
            <span className='nftx-label'>Token: </span>{this.state.token}
        </div>
        <Gallery
            onItemSelect={selectedNft => this.setState({selectedNft})}
            items={this.state.nfts}
        />
        <NFT nft={this.state.selectedNft} />
    </div>
    </Container>
  )
  }
}

export default App;
