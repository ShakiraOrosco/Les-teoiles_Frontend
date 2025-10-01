import Button from "../ui/button/Button";
import { ChevronLeftIcon } from "../../icons";

type Props = {
    paginaActual: number;
    totalPaginas: number;
    onPrev: () => void;
    onNext: () => void;
}

export function Pagination({ paginaActual, totalPaginas, onPrev, onNext }: Props) {
    return (
        <div className="flex justify-between items-center mt-4">
            <Button
                size="sm"
                variant="outline"
                startIcon={<ChevronLeftIcon className="size-6" />}
                disabled={paginaActual === 1}
                onClick={onPrev}
            >
                Anterior
            </Button>
            <span
                className="text-gray-400 dark:text-gray-500">
                Página {paginaActual} de {totalPaginas}
            </span>
            <Button
                size="sm"
                variant="outline"
                disabled={paginaActual === totalPaginas}
                onClick={onNext}
                endIcon={<ChevronLeftIcon
                className="rotate-180 size-6" />}
            >
                Siguiente
            </Button>
        </div>
    );
}