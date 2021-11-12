import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Form from './components/Form';
import Main from './components/Main';
import Letter from './components/Letter';
import Event from './components/Event';
import Winner from './components/Result/Winner';
import Lost from './components/Result/Lost';
import Almost from './components/Result/Almost';
import NotFound from './components/NotFound';


function App() {
  return (
    <BrowserRouter>
      <Main>
        <Switch>
          <Route path="/" component={Event} exact={true} />
          <Route path="/3fcdb73d36d54f2cc22d0f68e6b6e182" exact={true} component={Form} />
          <Route path="/3fcdb73d36d54f2cc22d0f68e6b6e182/winner" component={Winner} />
          <Route path="/3fcdb73d36d54f2cc22d0f68e6b6e182/try-again" component={Lost} />
          <Route path="/3fcdb73d36d54f2cc22d0f68e6b6e182/almost-there" component={Almost} />
          <Route path="/:hash" component={Letter} exact={true}/>
          <Route path="*" component={NotFound} />
        </Switch>
      </Main>
    </BrowserRouter>
  );
}

export default App;
