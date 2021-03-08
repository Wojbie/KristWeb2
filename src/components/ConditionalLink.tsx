// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import React, { FC } from "react";

import { Link, useRouteMatch } from "react-router-dom";

interface Props {
  to: string;
  condition?: boolean;

  replace?: boolean;

  matchTo?: boolean;
  matchPath?: string;
  matchExact?: boolean;
  matchStrict?: boolean;
  matchSensitive?: boolean;
}

export const ConditionalLink: FC<Props> = ({
  to,
  condition,

  replace,

  matchTo,
  matchPath,
  matchExact,
  matchStrict,
  matchSensitive,

  children, ...props
}): JSX.Element => {
  // Disable the link if we're already on that route
  const wantsCondition = condition !== undefined;
  const wantsMatch = matchTo || !!matchPath;

  const match = useRouteMatch(wantsMatch ? {
    path: matchTo && to ? to : matchPath,
    exact: matchExact,
    strict: matchStrict,
    sensitive: matchSensitive
  } : {});

  const active = (!wantsCondition || !!condition) && (!wantsMatch || !match);

  return active && to
    ? (
      <Link
        to={to}
        replace={replace}
        {...props}
      >
        {children}
      </Link>
    )
    : (
      <a className="conditional-link-disabled" {...props}>
        {children}
      </a>
    );
};