import React from "react";
import {
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "../../../redux/api/userApi";
import {
  useGetlikeofblogQuery,
  useGetMyBlogsQuery,
} from "../../../redux/api/blogApi";
import { useSelector } from "react-redux";

const Stats = () => {
  return <div className="mx-auto max-w-7xl"></div>;
};

export default Stats;
