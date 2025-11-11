import { Button } from "@/components/ui/button";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 border-t bg-muted/30">
      <p className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * itemsPerPage + 1}–
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={handlePrev}
        >
          Prev
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                num === currentPage
                  ? "bg-primary text-white"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
