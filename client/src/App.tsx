import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Header } from './modules/core/Header';
import { NftCollections } from './modules/nft-collections';
import { Landing } from './modules/landing';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Switch>
        <Route path="/">
          <Landing />
        </Route>
        <Route path="/profile">
          <NftCollections />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
