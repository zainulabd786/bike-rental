import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const brApi = createApi({
  reducerPath: 'brApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  tagTypes: ['Users', 'Bikes'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: loginData => ({
        url: '/signin',
        method: 'POST',
        body: loginData
      }),
      invalidatesTags: ['Users']
    }),
    getUser: builder.query({
      query: email => `/users?email=${email}`,
      providesTags: ['User'],
      transformResponse: ([response]) => {
        if(response) delete response.password;
        return response;
      }
    }),
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ['Users']
    }),
    signUp: builder.mutation({
      query: data => ({
        url: '/signup',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    updateUser: builder.mutation({
      query: data => ({
        url: `/users/${data.id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users']
    }),
    addBike: builder.mutation({
      query: data => ({
        url: '/bikes',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Bikes']
    }),
    getAllBikes: builder.query({
      query: () => "/bikes",
      providesTags: ['Bikes']
    }),
    updateBike: builder.mutation({
      query: data => ({
        url: `/bikes/${data.id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Bikes']
    }),
    deleteBike: builder.mutation({
      query: id => ({
        url: `/bikes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Bikes']
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useGetAllUsersQuery,
  useGetUserQuery,
  useSignUpMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAddBikeMutation,
  useGetAllBikesQuery,
  useUpdateBikeMutation,
  useDeleteBikeMutation
} = brApi