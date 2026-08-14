const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col border border-neutral-200 bg-white">
      {/* Image area */}
      <div className="relative flex-1 overflow-hidden bg-neutral-100">
        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-neutral-100 via-neutral-200 to-neutral-100" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />

        {/* <div className="mt-2 flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3 w-3 animate-pulse rounded-full bg-neutral-200" />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
