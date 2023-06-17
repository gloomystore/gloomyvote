'use client'
import React, { useCallback, useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getServerSideProps: GetServerSideProps<{ uuid: (string | null) }> = async (ctx:GetServerSidePropsContext) => {
  try {
    const { uuid } = ctx.query;
    return {
      props : {
        uuid: uuid as string
      }
    }
  } catch (err:any) {
    console.log(err.message)
  }
  return {
    props : {
      uuid: null
    }
  };
};
const Todos = ({uuid}:{uuid:string}) => {
  console.log(uuid)
  const fetchTodoList = useCallback(async() => {
    try {
      const response = await axios("https://blog.gloomy-store.com/php/getIp.php");
      if (!response.data) {
        throw new Error("Failed to fetch todos");
      }
      return response.data;
    } catch (error:any) {
      throw new Error(error.message);
    }
  },[uuid]) 
  const { isLoading, isError, data, error } = useQuery([uuid], fetchTodoList, {
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행함. true or false
    retry: 0, // 실패시 재호출 몇번 할지
    onSuccess: data => {
      // 성공시 호출
      console.log(data);
    },
    onError: (e:Error) => {
      // 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출)
      // 강제로 에러 발생시키려면 api단에서 throw Error 날리면됨 (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
      console.log(e.message);
    }
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  else if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ul>
      <li>{data}</li>
    </ul>
  );
};
export default Todos