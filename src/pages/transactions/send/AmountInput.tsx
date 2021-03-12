// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { Form, Input, InputNumber, Button } from "antd";

import { useTranslation } from "react-i18next";

import { useWallets } from "@wallets";
import { useCurrency } from "@utils/currency";

import { KristSymbol } from "@comp/krist/KristSymbol";

interface Props {
  from: string;
  setValue: (value: number) => void;
}

export function AmountInput({ from, setValue, ...props }: Props): JSX.Element {
  const { t } = useTranslation();

  // Used to populate 'Max'
  const { walletAddressMap } = useWallets();

  // Used to format the currency prefix/suffix
  const { currency_symbol } = useCurrency();

  function onClickMax() {
    const currentWallet = walletAddressMap[from];
    setValue(currentWallet?.balance || 0);
  }

  return <Form.Item
    label={t("sendTransaction.labelValue")}
    required
    {...props}
  >
    <Input.Group compact style={{ display: "flex" }}>
      {/* Prepend the Krist symbol if possible. Note that ant's InputNumber
        * doesn't support addons, so this has to be done manually. */}
      {(currency_symbol || "KST") === "KST" && (
        <span className="ant-input-group-addon currency-prefix">
          <KristSymbol />
        </span>
      )}

      {/* Value/amount number input */}
      <Form.Item
        name="value"
        style={{ flex: 1, marginBottom: 0 }}

        validateFirst
        rules={[
          { required: true, message: t("sendTransaction.errorAmountRequired") },
          { type: "number", message: t("sendTransaction.errorAmountNumber") },

          // Validate that the number isn't higher than the selected wallet's
          // balance
          {
            async validator(_, value): Promise<void> {
              if (value < 1)
                throw t("sendTransaction.errorAmountTooLow");

              const currentWallet = walletAddressMap[from];
              if (!currentWallet) return;
              if (value > (currentWallet.balance || 0))
                throw t("sendTransaction.errorAmountTooHigh");
            }
          },
        ]}
      >
        <InputNumber
          type="number"
          min={1}
          style={{ width: "100%", height: 32 }}
        />
      </Form.Item>

      {/* Currency suffix */}
      <span className="ant-input-group-addon">
        {currency_symbol || "KST"}
      </span>

      {/* Max value button */}
      <Button onClick={onClickMax}>
        {t("sendTransaction.buttonMax")}
      </Button>
    </Input.Group>
  </Form.Item>;
}
