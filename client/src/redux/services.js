import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const brApi = createApi({
  reducerPath: 'brApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
        query: loginData => ({
            url: '/signin',
            method: 'POST',
            body: loginData    
        }),
        invalidatesTags: ['User']
    }),
    getUser: builder.query({
      query: email => `/users?email=${email}`,
      providesTags: ['User'],
      transformResponse: ([response]) => {
        delete response.password;
        return response;
      }
    }),
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ['User']
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useLoginMutation,
  useGetAllUsersQuery,
  useGetUserQuery
} = brApi