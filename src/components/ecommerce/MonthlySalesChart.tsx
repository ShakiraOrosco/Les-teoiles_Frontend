import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState } from "react";

export default function MonthlySalesChart() {
  const [isOpen, setIsOpen] = useState(false);

  const isDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const options: ApexOptions = {
    colors: [isDarkMode ? "#99d8cd" : "#26a5b9"], // color de las barras
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: [isDarkMode ? "#99d8cd" : "#26a5b9"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: isDarkMode ? "#99d8cd" : "#458890",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? "#99d8cd" : "#458890",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: isDarkMode ? "#99d8cd" : "#458890",
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
      borderColor: isDarkMode ? "#26a5b950" : "#b9dcf050",
    },
    fill: {
      opacity: 0.9,
      colors: [isDarkMode ? "#99d8cd" : "#26a5b9"],
    },
    tooltip: {
      theme: isDarkMode ? "dark" : "light",
      x: { show: false },
      y: { formatter: (val: number) => `${val}` },
    },
  };

  const series = [
    {
      name: "Reservas",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#458890] dark:text-[#99d8cd]">
          Reservas por mes
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-[#b9dcf0] hover:text-[#26a5b9] dark:text-[#99d8cd]/70 dark:hover:text-[#26a5b9] size-6 transition-colors" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-[#458890] rounded-lg hover:bg-[#e2e8f6] hover:text-[#26a5b9] dark:text-[#99d8cd]/90 dark:hover:bg-[#26a5b9]/10"
            >
              Ver más
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-[#458890] rounded-lg hover:bg-[#fff3ef] hover:text-[#26a5b9] dark:text-[#99d8cd]/90 dark:hover:bg-[#26a5b9]/10"
            >
              Eliminar
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
