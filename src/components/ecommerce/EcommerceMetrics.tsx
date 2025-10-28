import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Reservas en Hotel --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Icono */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#e2e8f6] dark:bg-[#26a5b9]/20">
          <GroupIcon className="size-6 text-[#458890] dark:text-[#99d8cd]" />
        </div>

        {/* Texto y badge */}
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-[#458890]/80 dark:text-[#99d8cd]/80">
              Reservas en Hotel
            </span>
            <h4 className="mt-2 font-bold text-[#458890] dark:text-[#99d8cd] text-title-sm">
              3,782
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* <!-- Reservas de Evento --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Icono */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#fff3ef] dark:bg-[#26a5b9]/20">
          <BoxIconLine className="size-6 text-[#458890] dark:text-[#99d8cd]" />
        </div>

        {/* Texto y badge */}
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-[#458890]/80 dark:text-[#99d8cd]/80">
              Reservas de Evento
            </span>
            <h4 className="mt-2 font-bold text-[#458890] dark:text-[#99d8cd] text-title-sm">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
    </div>
  );
}
