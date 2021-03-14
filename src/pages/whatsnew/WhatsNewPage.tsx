// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { useState, useEffect } from "react";
import { Row, Col, Typography, Tooltip } from "antd";
import { GithubOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import * as api from "@api";
import { WhatsNewResponse } from "./types";
import { getAuthorInfo } from "@utils/credits";

import { PageLayout } from "@layout/PageLayout";

import { CommitsCard } from "./CommitsCard";

import "./WhatsNewPage.less";

const { Title } = Typography;

export function WhatsNewPage(): JSX.Element {
  const { t } = useTranslation();

  const syncNode = api.useSyncNode();

  const [kristData, setKristData] = useState<WhatsNewResponse>();
  const [loading, setLoading] = useState(true);

  // Get the repository URL for KristWeb
  const kristWebRepo = getAuthorInfo().gitURL;
  // Get the repository URL for the sync node
  const kristPackage = useSelector((s: RootState) => s.node.package);

  useEffect(() => {
    // Fetch the 'whats new' and commits from the Krist sync node
    api.get<WhatsNewResponse>("whatsnew")
      .then(setKristData)
      .catch(console.error) // TODO: show errors to the user
      .finally(() => setLoading(false));
  }, [syncNode]);

  return <PageLayout
    titleKey="whatsNew.title"
    siteTitleKey="whatsNew.siteTitle"

    className="whats-new-page"
  >
    {/* KristWeb */}
    <Title level={2}>
      {t("whatsNew.titleKristWeb")}
      <GithubLink repoURL={kristWebRepo} />
    </Title>

    <Row gutter={16}>
      {/* KristWeb What's new */}
      <Col span={24} lg={12}></Col>

      {/* KristWeb commits */}
      <Col span={24} lg={12}></Col>
    </Row>

    {/* Krist */}
    <Title level={2}>
      {t("whatsNew.titleKrist")}
      <GithubLink repoURL={kristPackage.repository} />
    </Title>

    <Row gutter={16}>
      {/* Krist What's new */}
      <Col span={24} lg={12}></Col>

      {/* Krist commits */}
      <Col span={24} lg={12}>
        <CommitsCard
          loading={loading}
          commits={kristData?.commits}
          repoURL={kristPackage.repository}
        />
      </Col>
    </Row>
  </PageLayout>;
}

function GithubLink({ repoURL }: { repoURL: string }): JSX.Element {
  const { t } = useTranslation();

  return <Tooltip title={t("whatsNew.tooltipGitHub")}>
    <a
      className="whats-new-github-link"
      href={repoURL}
      target="_blank" rel="noopener noreferrer"
    >
      <GithubOutlined />
    </a>
  </Tooltip>;
}
