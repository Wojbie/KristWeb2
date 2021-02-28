// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { getInitialWalletManagerState } from "./reducers/WalletManagerReducer";
import { getInitialWalletsState } from "./reducers/WalletsReducer";
import { getInitialSettingsState } from "./reducers/SettingsReducer";
import { getInitialNodeState } from "./reducers/NodeReducer";

import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import rootReducer from "./reducers/RootReducer";

export const initStore = () => createStore(
  rootReducer,
  {
    walletManager: getInitialWalletManagerState(),
    wallets: getInitialWalletsState(),
    settings: getInitialSettingsState(),
    node: getInitialNodeState()
  },
  devToolsEnhancer({})
);
