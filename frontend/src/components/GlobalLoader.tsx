import { useIsFetching } from "@tanstack/react-query";
import Loader from "./Loader";

const GlobalLoader = () => {
  const isFetching = useIsFetching({
    predicate: (query) => query.state.status === "pending",
  });
  if (!isFetching) return null;
  return <Loader />;
};

export default GlobalLoader;
