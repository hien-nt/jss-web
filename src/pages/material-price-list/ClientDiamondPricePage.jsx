import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getDiamondPrices } from "../../services/Diamond/DiamondService";

const TableContainer = styled.div`
  margin: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #262626;
    color: white;
    font-weight: bold;
  }

  td:first-child {
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }

  th:first-child {
    background-color: #262626;
    color: white;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #262626;
  font-size: 24px;
`;

const DiamondPriceTable = ({ diamondPrices, caratRange }) => {
  const clarityLevels = ["IF", "VVS1", "VVS2", "VS1", "VS2"];
  const colors = ["D", "E", "F", "J"];

  // Organize data into a more accessible format
  const data = {
    D: {},
    E: {},
    F: {},
    J: {},
  };

  diamondPrices.forEach((price) => {
    if (!data[price.color]) return;
    data[price.color][price.clarity] = price.sellPrice;
  });

  return (
    <>
      <TableContainer>
        <Title>Kim Cương {caratRange} CT</Title>

        <Table>
          <thead>
            <tr>
              <th>{caratRange} CT</th>
              {clarityLevels.map((clarity) => (
                <th key={clarity}>{clarity}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color}>
                <td>{color}</td>
                {clarityLevels.map((clarity) => (
                  <td key={clarity}>
                    {data[color][clarity]
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "decimal",
                        }).format(data[color][clarity])
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const ClientDiamondPricePage = () => {
  const [diamondPrices, setDiamondPrices] = useState([]);

  useEffect(() => {
    getDiamondPrices(setDiamondPrices);
  }, []);

  // Separate diamond prices by carat weight ranges
  const ranges = {
    "0.17 - 0.2": diamondPrices.filter(
      (price) => price.caratWeightFrom === 0.17 && price.caratWeightTo === 0.2
    ),
    "0.21 - 0.24": diamondPrices.filter(
      (price) => price.caratWeightFrom === 0.21 && price.caratWeightTo === 0.24
    ),
    "0.25 - 0.29": diamondPrices.filter(
      (price) => price.caratWeightFrom === 0.25 && price.caratWeightTo === 0.29
    ),
  };

  return (
    <div>
      {Object.keys(ranges).map((range) => (
        <DiamondPriceTable
          key={range}
          diamondPrices={ranges[range]}
          caratRange={range}
        />
      ))}
    </div>
  );
};

export default ClientDiamondPricePage;
