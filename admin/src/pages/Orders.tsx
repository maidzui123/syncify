import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import AddData from '../components/AddData';
import { fetchAssessments } from "../api/ApiCollection";

const Orders = () => {
  // const [isOpen, setIsOpen] = React.useState(false);
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["allassessments"],
    queryFn: fetchAssessments,
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "content",
      headerName: "Content",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "createdBy",
      headerName: "Author",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-3 items-center">
            <div className="avatar">
              <div className="w-6 xl:w-9 rounded-full">
                <img
                  src={
                    params.row.createdBy.avatar || "/Portrait_Placeholder.png"
                  }
                  alt="user-picture"
                />
              </div>
            </div>
            <span className="mb-0 pb-0 leading-none">
              {params.row.createdBy.username}
            </span>
          </div>
        );
      },
    },
    {
      field: "star",
      headerName: "Stars",
      minWidth: 100,
      type: "string",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 100,
      type: "string",
      flex: 1,
    },
  ];

  React.useEffect(() => {
    if (isLoading) {
      // toast.loading("Loading...", { id: "promiseOrders" });
    }
    if (isError) {
      toast.error("Error while getting the data!", {
        id: "promiseOrders",
      });
    }
    if (isSuccess) {
      toast.success("Got the data successfully!", {
        id: "promiseOrders",
      });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Assessments
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Assessments Found
              </span>
            )}
          </div>
          {/* <button
            onClick={() => setIsOpen(true)}
            className={`btn ${
              isLoading ? 'btn-disabled' : 'btn-primary'
            }`}
          >
            Add New Order +
          </button> */}
        </div>
        {isLoading ? (
          <DataTable
            slug="assessments"
            columns={columns}
            rows={[]}
            includeActionColumn={false}
            isReported={false}
          />
        ) : isSuccess ? (
          <DataTable
            slug="assessments"
            columns={columns}
            rows={data}
            includeActionColumn={false}
            isReported={false}
          />
        ) : (
          <>
            <DataTable
              slug="assessments"
              columns={columns}
              rows={[]}
              includeActionColumn={false}
              isReported={false}
            />
            <div className="w-full flex justify-center">
              Error while getting the data!
            </div>
          </>
        )}

        {/* {isOpen && (
          <AddData
            slug={'user'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )} */}
      </div>
    </div>
  );
};

export default Orders;
