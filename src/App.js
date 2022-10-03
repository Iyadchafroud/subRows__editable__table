/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import styled from "styled-components";
import { useTable, usePagination, useExpanded } from "react-table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

// Create an editable cell renderer
function EditableCell({
  value: initialValue,
  row,
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (row, e) => {
    console.log({ cc: row, test: e.target.value });
    setValue(e.target.value);
  };

  const onBlur = () => {
    const rowId = row.id;

    updateMyData(row.index, id, value, row.depth, rowId);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  if (id === "Désignation") {
    return <p>{value}</p>;
  }
  if (row.subRows.length > 0) {
    return <p>{value}</p>;
  }

  if (row.subRows.length === 0) {
    return (
      <input value={value} onChange={(e) => onChange(row, e)} onBlur={onBlur} />
    );
  }
}

const defaultColumn = {
  Cell: EditableCell,
};

function Table({ columns, data, updateMyData, skipPageReset }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,

      updateMyData,
    },
    useExpanded,
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              console.log(e.target);
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        // Build our expander column
        id: "expander", // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps}>
            {isAllRowsExpanded ? "👇" : "👉"}
          </span>
        ),
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? "👇" : "👉"}
            </span>
          ) : null,
      },
      {
        Header: "Désignation",
        accessor: "Désignation",
      },
      {
        Header: "PrixHT",
        accessor: "PrixHT",
      },

      {
        Header: "TVA",
        accessor: "TVA",
      },
      {
        Header: "PrixTTC",
        accessor: "PrixTTC",
      },
    ],
    []
  );
  const [data, setData] = React.useState([
    {
      Désignation: "emporter",
      PrixHT: "",
      TVA: "",
      PrixTTC: "",
      subRows: [
        {
          Désignation: "kiosk",
          PrixHT: "",
          TVA: "",
          PrixTTC: "",
        },
        {
          Désignation: "dfiofsk",
          PrixHT: "",
          TVA: "",
          PrixTTC: "",
        },
      ],
    },
    {
      Désignation: "emporter",
      PrixHT: "",
      TVA: "",
      PrixTTC: "",
      subRows: [
        {
          Désignation: "kiosk",
          PrixHT: "",
          TVA: "",
          PrixTTC: "",
        },
        {
          Désignation: "dfiofsk",
          PrixHT: "",
          TVA: "",
          PrixTTC: "",
        },
      ],
    },
  ]);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const updateMyData = (rowIndex, columnId, value, deptht, rowId) => {
    console.log(rowIndex, columnId, deptht, value, rowId);

    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        console.log(row);
        if (index === rowIndex) {
          console.log(index);
          row.subRows.map((el, indexSub) => {
            console.log(index, indexSub);

            // if (indexSub === rowIndex) {
            //     console.log(el.Désignation);

            //     if (designation === row.Désignation) {
            //         el[columnId] = value;
            //     }
            //}
          });
        }

        return row;
      })
    );
  };

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  const resetData = () => setData(originalData);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </Styles>
  );
}

export default App;
