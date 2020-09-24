import React, { ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { KristValue } from "@components/krist-value/KristValue";

// TODO: temporary
import { Wallet } from "./MyWalletsPage";

interface Props {
  item: Wallet
};

export const Separator: React.FC = () => 
  <span className="text-muted"> &ndash; </span>

export const MyWalletsMobileItem: React.FC<Props> = ({ item }: Props) => {
  const { t } = useTranslation();

  const formattedFirstSeen = item.firstSeen
    ? new Date(item.firstSeen).toLocaleString()
    : null;

  return <>
    <h4>
      <KristValue value={item.balance} className="float-right" />
      {item.label ?? item.address}
    </h4>
    <p className="mb-0">
      {/* Show the address if it has a label, otherwise this is unnecessary */}
      {item.label && <>
        {item.address}<Separator />
      </>}

      {/* Show the category if set */}
      {item.category && <>
        <span className="text-quiet">{item.category}</span><Separator />
      </>}

      {/* Show the name count */}
      <span className="text-quiet">
        {t("myWallets.nameCount", { count: item.names })}
      </span>

      {/* Show the first seen date and time on a new line if set */}
      {formattedFirstSeen && <>
        <br />
        <span className="text-muted">
          {t("myWallets.firstSeen", { date: formattedFirstSeen })}
        </span>
      </>}
    </p>
  </>
}