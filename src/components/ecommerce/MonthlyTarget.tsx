import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlyTarget() {
  const series = [75.55];

  const options: ApexOptions = {
    colors: ["#26a5b9"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: {
          background: "#b9dcf0",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#458890",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#26a5b9"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-[#b9dcf0] bg-[#e2e8f6] dark:border-[#26a5b9]/40 dark:bg-[#458890]/10">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-[#1a1f1f] sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#458890] dark:text-[#99d8cd]">
              Servicios mas usados
            </h3>
            <p className="mt-1 text-[#458890]/80 text-theme-sm dark:text-[#99d8cd]/70">
              Progreso mensual
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart options={options} series={series} type="radialBar" height={330} />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-[#99d8cd]/40 px-3 py-1 text-xs font-medium text-[#458890] dark:bg-[#26a5b9]/30 dark:text-[#99d8cd]">
            +10%
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-[#458890]/80 dark:text-[#99d8cd]/80 sm:text-base">
          Has alcanzado el <span className="font-semibold text-[#26a5b9] dark:text-[#99d8cd]">75%</span> de tu meta. ¡Sigue así!
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-[#458890]/80 text-theme-xs dark:text-[#99d8cd]/70 sm:text-sm">
            Meta
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-[#458890] dark:text-[#99d8cd] sm:text-lg">
            Bs. 20K
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                fill="#f86e6e"
              />
            </svg>
          </p>
        </div>

        <div className="w-px bg-[#b9dcf0] h-7 dark:bg-[#26a5b9]/30"></div>

        <div>
          <p className="mb-1 text-center text-[#458890]/80 text-theme-xs dark:text-[#99d8cd]/70 sm:text-sm">
            Ingresos
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-[#458890] dark:text-[#99d8cd] sm:text-lg">
            Bs. 20K
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#26a5b9"
              />
            </svg>
          </p>
        </div>

        <div className="w-px bg-[#b9dcf0] h-7 dark:bg-[#26a5b9]/30"></div>

        <div>
          <p className="mb-1 text-center text-[#458890]/80 text-theme-xs dark:text-[#99d8cd]/70 sm:text-sm">
            Hoy
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-[#458890] dark:text-[#99d8cd] sm:text-lg">
            Bs.20K
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#26a5b9"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
