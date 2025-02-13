// import React from 'react';
import TopDealsBox from "../components/topDealsBox/TopDealsBox";
import ChartBox from "../components/charts/ChartBox";
import { useQuery } from "@tanstack/react-query";
import { MdChatBubbleOutline } from "react-icons/md";
import { HiOutlineDocumentChartBar, HiOutlineUserGroup } from "react-icons/hi2";
import {
  fetchTotalPosts,
  fetchTotalComments,
  fetchTotalAssessments,
  fetchTotalUsers,
} from "../api/ApiCollection";

const Home = () => {
  const queryGetTotalUsers = useQuery({
    queryKey: ["totalusers"],
    queryFn: fetchTotalUsers,
  });

  const queryGetTotalPost = useQuery({
    queryKey: ["totalposts"],
    queryFn: fetchTotalPosts,
  });

  const queryGetTotalComments = useQuery({
    queryKey: ["totalcomments"],
    queryFn: fetchTotalComments,
  });

  const queryGetTotalAssessments = useQuery({
    queryKey: ["totalassessments"],
    queryFn: fetchTotalAssessments,
  });

  return (
    // screen
    <div className="home w-full p-0 m-0">
      {/* grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 grid-flow-dense auto-rows-[minmax(200px,auto)] xl:auto-rows-[minmax(150px,auto)] gap-3 xl:gap-3 px-0">
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 row-span-4 3xl:row-span-1">
          <TopDealsBox />
        </div>
        <div className="box col-span-full sm:col-span-2 xl:col-span-3 3xl:row-span-2">
          <ChartBox
            chartType={"line"}
            IconBox={HiOutlineUserGroup}
            title="Total Users"
            {...queryGetTotalUsers.data}
            isLoading={queryGetTotalUsers.isLoading}
            isSuccess={queryGetTotalUsers.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-2 xl:col-span-3 3xl:row-span-2">
          <ChartBox
            chartType={"line"}
            IconBox={HiOutlineDocumentChartBar}
            title="Total Posts"
            {...queryGetTotalPost.data}
            isLoading={queryGetTotalPost.isLoading}
            isSuccess={queryGetTotalPost.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-2 xl:col-span-3 3xl:row-span-2">
          <ChartBox
            chartType={"line"}
            IconBox={MdChatBubbleOutline}
            title="Total Comments"
            {...queryGetTotalComments.data}
            isLoading={queryGetTotalComments.isLoading}
            isSuccess={queryGetTotalComments.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-2 xl:col-span-3 3xl:row-span-2">
          <ChartBox
            chartType={"line"}
            IconBox={MdChatBubbleOutline}
            title="Total Assessments"
            {...queryGetTotalAssessments.data}
            isLoading={queryGetTotalAssessments.isLoading}
            isSuccess={queryGetTotalAssessments.isSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
