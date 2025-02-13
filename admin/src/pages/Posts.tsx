import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import AddData from '../components/AddData';
import { fetchListPosts } from "../api/ApiCollection";
import ShowDataPost from "../components/ShowDataPost";
import EditDataPost from "../components/EditDataPost";
import { HiOutlineGlobeAmericas, HiOutlineLockClosed } from "react-icons/hi2";

const Posts = () => {
  const [isOpenView, setIsOpenView] = React.useState(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [postData, setPostData] = React.useState({});

  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["allposts"],
    queryFn: fetchListPosts,
  });

  const handleViewPost = (post: any) => {
    setPostData(post);
    setIsOpenView(true);
  };

  const handleEditPost = (post: any) => {
    setPostData(post);
    setIsOpenEdit(true);
  };

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", minWidth: 90 },
    {
      field: "content",
      headerName: "Content",
      minWidth: 500,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-3 relative items-center py-2">
            <div className="flex flex-col items-start gap-0">
              <div className="relative w-[300px] xl:w-[320px] overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-ellipsis whitespace-nowrap text-base font-medium dark:text-white">
                  {params.row.content}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: "createdBy",
      headerName: "Created By",
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
      field: "date",
      type: "string",
      headerName: "Date",
      minWidth: 100,
    },
    {
      field: "comments",
      type: "number",
      headerName: "Comments",
      minWidth: 120,
    },
    {
      field: "likes",
      type: "number",
      headerName: "Likes",
      minWidth: 80,
    },
  ];

  React.useEffect(() => {
    if (isLoading) {
      // toast.loading("Loading...", { id: "promisePosts" });
    }
    if (isError) {
      toast.error("Error while getting the data!", {
        id: "promisePosts",
      });
    }
    if (isSuccess) {
      toast.success("Got the data successfully!", {
        id: "promisePosts",
      });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Posts
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Posts Found
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
            slug="posts"
            columns={columns}
            rows={[]}
            includeActionColumn={true}
            isReported={true}
            handleViewPost={handleViewPost}
            handleEditPost={handleEditPost}
          />
        ) : isSuccess ? (
          <DataTable
            slug="posts"
            columns={columns}
            rows={data}
            includeActionColumn={true}
            isReported={true}
            handleViewPost={handleViewPost}
            handleEditPost={handleEditPost}
          />
        ) : (
          <>
            <DataTable
              slug="posts"
              columns={columns}
              rows={[]}
              includeActionColumn={true}
              isReported={true}
              handleViewPost={handleViewPost}
              handleEditPost={handleEditPost}
            />
            <div className="w-full flex justify-center">
              Error while getting the data!
            </div>
          </>
        )}

        {isOpenView && (
          <ShowDataPost
            slug={"post"}
            isOpen={isOpenView}
            setIsOpen={setIsOpenView}
            data={postData}
          />
        )}

        {isOpenEdit && (
          <EditDataPost
            slug={"post"}
            isOpen={isOpenEdit}
            setIsOpen={setIsOpenEdit}
            data={postData}
          />
        )}
      </div>
    </div>
  );
};

export default Posts;
