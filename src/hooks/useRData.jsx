import { useState } from "react";
import { toast } from "react-toastify";

const useRData = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);

      const res = await response.json();
      setData(res);
    } catch (error) {
      setError(error?.response);
      toast(error?.response.message);
      // console.log(error?.response);
    }
  };

  return {
    fetchData,
    data,
    error,
    // showModal
  };
};

export default useRData;
