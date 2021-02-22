// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { createAction } from "typesafe-actions";
import { WSConnectionState } from "../../krist/api/types";

import * as constants from "../constants";

export const setConnectionState = createAction(constants.CONNECTION_STATE)<WSConnectionState>();
