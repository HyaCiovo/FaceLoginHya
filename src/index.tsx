/* @refresh reload */
import { For, render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Route, Router } from '@solidjs/router';
import { routes } from './configs/routes';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => <Router root={App}>
  <For each={routes}>
    {route => <Route path={route.path} component={route.component} />}
  </For>
</Router>, root!);
