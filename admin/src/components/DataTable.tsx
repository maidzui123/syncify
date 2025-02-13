import React from "react";
import {
  DataGrid,
  GridColDef,
  //   GridToolbarQuickFilter,
  GridToolbar,
  //   GridValueGetterParams,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  HiOutlinePencilSquare,
  HiOutlineEye,
  HiOutlineTrash,
} from "react-icons/hi2";
import { TbLock, TbLockOpen, TbTrash } from "react-icons/tb";

import toast from "react-hot-toast";
import { bannedUser, deleteReportedPost } from "../api/ApiCollection";
import { useQueryClient } from "@tanstack/react-query";

interface DataTableProps {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  includeActionColumn: boolean;
  isReported: boolean;
  handleViewUser?: any;
  handleEditUser?: any;
  handleViewPost?: any;
  handleEditPost?: any;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  slug,
  includeActionColumn,
  isReported,
  handleViewUser,
  handleEditUser,
  handleViewPost,
  handleEditPost,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleBannedUser = async (bannedUserId: string) => {
    try {
      const response = await bannedUser(bannedUserId);
      if (response) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["allusers"] });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteReportedPost = async (postId: string) => {
    try {
      const response = await deleteReportedPost(postId);
      if (response) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["allreportedposts"] });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      return (
        <>
          <div className="flex items-center">
            <button
              className="btn btn-square btn-ghost"
              onClick={() => {
                if (slug === "users") {
                  handleViewUser(params.row);
                }
                if (slug === "posts") {
                  handleViewPost(params.row);
                }
              }}
            >
              <HiOutlineEye />
            </button>
          </div>
          <div className="flex items-center">
            <button
              className="btn btn-square btn-ghost"
              onClick={() => {
                if (slug === "users") {
                  handleEditUser(params.row);
                }
                if (slug === "posts") {
                  handleEditPost(params.row);
                }
              }}
            >
              <HiOutlinePencilSquare />
            </button>
          </div>
          {isReported ? (
            <div className="flex items-center">
              <button
                onClick={() => handleDeleteReportedPost(params.row.postId)}
                className="btn btn-square btn-ghost"
              >
                <TbTrash />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={() => handleBannedUser(params.row._id)}
                className="btn btn-square btn-ghost"
              >
                {params.row.isBanned ? <TbLock /> : <TbLockOpen />}
              </button>
            </div>
          )}
        </>
      );
    },
  };

  if (includeActionColumn === true) {
    return (
      <div className="w-full bg-base-100 text-base-content">
        <DataGrid
          className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
          rows={rows}
          columns={[...columns, actionColumn]}
          getRowHeight={() => "auto"}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
        />
      </div>
    );
  } else {
    return (
      <div className="w-full bg-base-100 text-base-content">
        <DataGrid
          className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
          rows={rows}
          columns={[...columns]}
          getRowHeight={() => "auto"}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
        />
      </div>
    );
  }
};

export default DataTable;
