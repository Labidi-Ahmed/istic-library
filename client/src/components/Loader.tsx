const Loader = () => {
  return (
    <section className=" mx-auto p-5 max-w-7xl">
      <div className="flex w-full  flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </section>
  );
};

export default Loader;
