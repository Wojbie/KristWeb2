import React, { Component, ReactNode } from "react";
import { HeaderSpec, SortDirection } from "./ListView";

import Table from "react-bootstrap/Table";

import { ColumnHeader } from "./ColumnHeader";
import { KristValue } from "@components/krist-value/KristValue";

import "./ListTable.scss";
import { SkeletonText } from "@components/skeleton/SkeletonText";

// Default widths for the skeleton elements that look good enough
const SKELETON_EM_WIDTHS = [10, 7, 5, 4, 8, 10];
const SKELETON_ROWS = 5;

interface State<T> {
  orderBy?: Extract<keyof T, string>;
  order?: SortDirection;

  loading: boolean;
}

interface Props<T> {
  headers?: Map<Extract<keyof T, string>, HeaderSpec>;
}

export class ListTable<T> extends Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);

    this.state = {
      orderBy: undefined,
      order: undefined,

      loading: true
    };
  }

  componentDidMount(): void {
    // TODO: temporary
    setTimeout(() => {
      this.setState({ loading: false });
    }, 6000);
  }

  setSort(orderBy?: Extract<keyof T, string>, order?: SortDirection): void {
    this.setState({
      orderBy, order
    });
  }

  generateSkeletonSizes(): Array<number | undefined> | undefined {
    const { headers } = this.props;
    const { loading } = this.state;

    // Generate the sizes of skeleton text
    const skeletonSizes = headers && loading 
      ? Array.from(headers, ([, headerSpec]) => 
        headerSpec.skeletonEmWidth || undefined) // If no width was defined, use undefined
      : undefined;

    // Fill any missing sizes with defaults
    if (skeletonSizes !== undefined) {
      for (let i = 0; i < Math.min(skeletonSizes.length, SKELETON_EM_WIDTHS.length); i++) {
        if (skeletonSizes[i] !== undefined) continue;
        skeletonSizes[i] = SKELETON_EM_WIDTHS[i];
      }
    }

    return skeletonSizes;
  }

  generateSkeletonRow(skeletonSizes: Array<number | undefined>, rowID: number): Array<ReactNode> {
    return skeletonSizes.map((width, j) =>
      <td key={`skeleton-row-${rowID}-col-${j}`}><SkeletonText emWidth={width} /></td>);
  }

  generateSkeletonRows(skeletonSizes: Array<number | undefined>): Array<ReactNode> {
    return new Array(SKELETON_ROWS).fill(null).map((_, i) => 
      <tr key={`skeleton-row-${i}`}>{this.generateSkeletonRow(skeletonSizes, i)}</tr>);
  }

  render(): ReactNode {
    const { headers } = this.props;
    const { orderBy, order, loading } = this.state;

    // Generate the skeleton rows
    const skeletonSizes = this.generateSkeletonSizes();
    const skeletonRows = skeletonSizes ? this.generateSkeletonRows(skeletonSizes) : null;

    // Render the table
    return <Table borderless hover className={loading ? "loading" : ""}>
      {/* Table headers, defined by the header map in the props */}
      {headers && <thead>
        <tr>
          {Array.from(headers, ([headerKey, headerSpec]) => 
            (<ColumnHeader
              key={headerKey} 
              headerKey={headerKey} 
              headerSpec={headerSpec}
              sortDirection={orderBy === headerKey ? order : undefined} 
              onSort={this.setSort.bind(this)}
            />))}
        </tr>
      </thead>}

      {/* Table rows */}
      <tbody>
        {/* Render skeleton rows if the table is loading loading */}
        {skeletonRows}

        {/* Otherwise, render the data */}
        {!loading && <>
          <tr>
            <td>Shop Wallet</td>
            <td className="text-nowrap">kreichdyes</td>
            <td className="text-nowrap"><KristValue value={15364} /></td>
            <td className="text-nowrap">12</td>
            <td className="text-nowrap">Shops</td>
            <td className="text-nowrap">2020/09/11 08:08</td>
          </tr>

          <tr>
            <td>Main Wallet</td>
            <td className="text-nowrap">khugepoopy</td>
            <td className="text-nowrap"><KristValue value={1024} /></td>
            <td className="text-nowrap">3</td>
            <td className="text-nowrap"></td>
            <td className="text-nowrap">2016/02/14 00:00</td>
          </tr>

          <tr>
            <td>Old Wallet</td>
            <td className="text-nowrap">kre3w0i79j</td>
            <td className="text-nowrap"><KristValue value={0} /></td>
            <td className="text-nowrap">0</td>
            <td className="text-nowrap"></td>
            <td className="text-nowrap">2015/02/14 00:00</td>
          </tr>
        </>}
      </tbody>
    </Table>;
  }
}
